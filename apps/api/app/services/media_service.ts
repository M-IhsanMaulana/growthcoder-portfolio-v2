import drive from '@adonisjs/drive/services/main'
import env from '#start/env'
import db from '@adonisjs/lucid/services/db'
import MediaAsset from '#models/media_asset'
import Post from '#models/post'
import Project from '#models/project'
import ProjectGallery from '#models/project_gallery'
import User from '#models/user'
import SiteSetting from '#models/site_setting'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import { randomUUID } from 'node:crypto'
import type {
  MediaType,
  MediaStats,
  MediaUsageItem,
  MediaUsageCheckResponse,
} from '@growthcoder/types'
import sharp from 'sharp'

export class MediaService {
  /**
   * Sync and fix any legacy media records directly in database
   */
  static async syncLegacyAssets() {
    try {
      const appUrl = (env.get('APP_URL') || 'http://localhost:3333').replace(/\/$/, '')

      // 1. Update misclassified images
      await db.rawQuery(`
        UPDATE media_assets 
        SET media_type = 'image' 
        WHERE (media_type = 'other' OR media_type IS NULL) 
          AND (
            file_name ILIKE '%.png' 
            OR file_name ILIKE '%.jpg' 
            OR file_name ILIKE '%.jpeg' 
            OR file_name ILIKE '%.webp' 
            OR file_name ILIKE '%.gif' 
            OR file_name ILIKE '%.svg' 
            OR file_name ILIKE '%.avif' 
            OR file_name ILIKE '%.ico'
          )
      `)

      // 2. Update misclassified videos
      await db.rawQuery(`
        UPDATE media_assets 
        SET media_type = 'video' 
        WHERE (media_type = 'other' OR media_type IS NULL) 
          AND (
            file_name ILIKE '%.mp4' 
            OR file_name ILIKE '%.webm' 
            OR file_name ILIKE '%.mov' 
            OR file_name ILIKE '%.avi'
          )
      `)

      // 3. Update misclassified documents
      await db.rawQuery(`
        UPDATE media_assets 
        SET media_type = 'document' 
        WHERE (media_type = 'other' OR media_type IS NULL) 
          AND (
            file_name ILIKE '%.pdf' 
            OR file_name ILIKE '%.doc' 
            OR file_name ILIKE '%.docx' 
            OR file_name ILIKE '%.xls' 
            OR file_name ILIKE '%.xlsx' 
            OR file_name ILIKE '%.txt'
          )
      `)

      // 4. Update relative URLs to absolute URLs
      await db.rawQuery(`
        UPDATE media_assets 
        SET file_url = CONCAT('${appUrl}', file_url) 
        WHERE file_url LIKE '/uploads/%'
      `)
    } catch (err) {
      console.warn('syncLegacyAssets error:', err)
    }
  }

  /**
   * Store uploaded file via AdonisJS Drive and persist in media_assets table
   */
  static async uploadFile(file: MultipartFile, altText?: string | null) {
    const ext = (file.extname || file.clientName?.split('.').pop() || 'bin')
      .toLowerCase()
      .replace(/^\./, '')
    const fileName = `${randomUUID()}.${ext}`
    const key = `media/${fileName}`

    // Determine full MIME type accurately from headers / bodyparser
    const rawMime = (
      file.headers?.['content-type'] ||
      (file.type && file.subtype ? `${file.type}/${file.subtype}` : file.type) ||
      'application/octet-stream'
    ).toLowerCase()

    const isImage =
      rawMime.startsWith('image') ||
      ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'avif', 'ico', 'bmp', 'tiff'].includes(ext)
    const isVideo =
      rawMime.startsWith('video') || ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv'].includes(ext)
    const isDocument =
      rawMime.includes('pdf') ||
      rawMime.includes('document') ||
      rawMime.includes('text') ||
      rawMime.includes('sheet') ||
      rawMime.includes('presentation') ||
      rawMime.includes('msword') ||
      ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'json', 'md'].includes(ext)

    let mediaType: MediaType = 'other'
    if (isImage) {
      mediaType = 'image'
    } else if (isVideo) {
      mediaType = 'video'
    } else if (isDocument) {
      mediaType = 'document'
    }

    let mime = rawMime
    if (!mime.includes('/') && ext) {
      if (isImage) mime = `image/${ext === 'jpg' ? 'jpeg' : ext}`
      else if (isVideo) mime = `video/${ext}`
      else if (ext === 'pdf') mime = 'application/pdf'
    }

    let width: number | null = null
    let height: number | null = null

    // Extract image dimensions using sharp if it's an image
    if (mediaType === 'image' && file.tmpPath) {
      try {
        const metadata = await sharp(file.tmpPath).metadata()
        width = metadata.width || null
        height = metadata.height || null
      } catch (err) {
        // Fallback gracefully if sharp cannot parse file (e.g. some SVGs or corrupted images)
        console.warn('Could not extract image metadata via sharp:', err)
      }
    }

    // Move file to drive disk
    await file.moveToDisk(key)

    const disk = drive.use()
    let fileUrl = await disk.getUrl(key)
    if (fileUrl.startsWith('/')) {
      const appUrl = env.get('APP_URL') || 'http://localhost:3333'
      fileUrl = `${appUrl.replace(/\/$/, '')}${fileUrl}`
    }

    const mediaAsset = await MediaAsset.create({
      fileName: file.clientName || fileName,
      filePath: key,
      fileUrl: fileUrl,
      mimeType: mime,
      fileSize: file.size || 0,
      mediaType,
      width,
      height,
      altText: altText || null,
    })

    return mediaAsset
  }

  /**
   * Check if a media asset is actively referenced in other content
   */
  static async checkUsage(mediaAsset: MediaAsset): Promise<MediaUsageCheckResponse> {
    const usages: MediaUsageItem[] = []
    const url = mediaAsset.fileUrl
    const id = mediaAsset.id

    try {
      // 1. Check in Posts (cover_image or content)
      const posts = await Post.query()
        .where('cover_image', url)
        .orWhereILike('cover_image', `%${id}%`)
        .orWhereILike('content', `%${url}%`)
        .orWhereILike('content', `%${id}%`)
        .select('id', 'title')

      for (const p of posts) {
        usages.push({
          entity: 'post',
          entityId: String(p.id),
          title: p.title,
          fieldName: 'Cover Image / Content',
        })
      }

      // 2. Check in Projects (cover_image or content)
      const projects = await Project.query()
        .where('cover_image', url)
        .orWhereILike('cover_image', `%${id}%`)
        .orWhereILike('content', `%${url}%`)
        .orWhereILike('content', `%${id}%`)
        .select('id', 'title')

      for (const pr of projects) {
        usages.push({
          entity: 'project',
          entityId: String(pr.id),
          title: pr.title,
          fieldName: 'Cover Image / Case Study',
        })
      }

      // 3. Check in Project Galleries
      const galleries = await ProjectGallery.query()
        .where('image_url', url)
        .orWhereILike('image_url', `%${id}%`)
        .preload('project')
        .select('id', 'project_id', 'caption')

      for (const g of galleries) {
        usages.push({
          entity: 'project_gallery',
          entityId: String(g.id),
          title: g.project?.title ? `${g.project.title} (Gallery)` : 'Project Gallery Item',
          fieldName: 'Gallery Image',
        })
      }

      // 4. Check in Users (avatar_url)
      const users = await User.query()
        .where('avatar_url', url)
        .orWhereILike('avatar_url', `%${id}%`)
        .select('id', 'name')

      for (const u of users) {
        usages.push({
          entity: 'user',
          entityId: String(u.id),
          title: u.name,
          fieldName: 'User Avatar',
        })
      }

      // 5. Check in Site Settings (profile avatar, cv file, og image)
      const settings = await SiteSetting.all()
      for (const s of settings) {
        const valStr = JSON.stringify(s.value)
        if (valStr.includes(url) || valStr.includes(id)) {
          usages.push({
            entity: 'site_setting',
            entityId: String(s.id),
            title: `Pengaturan: ${s.key}`,
            fieldName: s.key,
          })
        }
      }
    } catch (error) {
      console.error('Error during media usage check:', error)
    }

    return {
      isUsed: usages.length > 0,
      usages,
    }
  }

  /**
   * Delete media asset from disk and database with safety check
   */
  static async deleteFile(mediaAsset: MediaAsset, force = false) {
    if (!force) {
      const usageCheck = await this.checkUsage(mediaAsset)
      if (usageCheck.isUsed) {
        const err = new Error(
          `Tidak dapat menghapus file karena sedang digunakan oleh ${usageCheck.usages.length} konten.`
        ) as Error & { usages?: MediaUsageItem[]; isUsed?: boolean }
        err.usages = usageCheck.usages
        err.isUsed = true
        throw err
      }
    }

    const disk = drive.use()
    if (await disk.exists(mediaAsset.filePath)) {
      await disk.delete(mediaAsset.filePath)
    }
    await mediaAsset.delete()
  }

  /**
   * Aggregate statistics of media library
   */
  static async getStats(): Promise<MediaStats> {
    const assets = await MediaAsset.all()

    let totalSize = 0
    let imageCount = 0
    let documentCount = 0
    let videoCount = 0
    let otherCount = 0

    for (const asset of assets) {
      // Auto-heal any legacy records with relative URL or misclassified type
      let needsSave = false
      if (asset.mediaType === 'other' && asset.fileName) {
        const ext = asset.fileName.split('.').pop()?.toLowerCase() || ''
        if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'avif', 'ico', 'bmp'].includes(ext)) {
          asset.mediaType = 'image'
          needsSave = true
        } else if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) {
          asset.mediaType = 'video'
          needsSave = true
        } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'].includes(ext)) {
          asset.mediaType = 'document'
          needsSave = true
        }
      }
      if (asset.fileUrl && asset.fileUrl.startsWith('/')) {
        const appUrl = env.get('APP_URL') || 'http://localhost:3333'
        asset.fileUrl = `${appUrl.replace(/\/$/, '')}${asset.fileUrl}`
        needsSave = true
      }
      if (needsSave) {
        await asset.save()
      }

      totalSize += Number(asset.fileSize) || 0
      switch (asset.mediaType) {
        case 'image':
          imageCount++
          break
        case 'document':
          documentCount++
          break
        case 'video':
          videoCount++
          break
        default:
          otherCount++
          break
      }
    }

    return {
      totalFiles: assets.length,
      totalSize,
      imageCount,
      documentCount,
      videoCount,
      otherCount,
    }
  }
}
