import type { HttpContext } from '@adonisjs/core/http'
import MediaAsset from '#models/media_asset'
import { MediaService } from '#services/media_service'
import {
  uploadMediaValidator,
  updateMediaValidator,
  bulkDeleteMediaValidator,
} from '#validators/media_validator'
import { ActivityLogService } from '#services/activity_log_service'

export default class MediaController {
  /**
   * Get paginated media assets with filtering and sorting
   */
  async index({ request, response }: HttpContext) {
    await MediaService.syncLegacyAssets()

    const page = request.input('page', 1)
    const perPage = request.input('perPage', 24)
    const type = request.input('type')
    const search = request.input('search')
    const sortBy = request.input('sortBy', 'created_at')
    const sortOrder = request.input('sortOrder', 'desc') === 'asc' ? 'asc' : 'desc'

    const query = MediaAsset.query()

    if (type && type !== 'all') {
      query.where('media_type', type)
    }

    if (search) {
      query.where((subQuery) => {
        subQuery.whereILike('file_name', `%${search}%`).orWhereILike('alt_text', `%${search}%`)
      })
    }

    const validSortColumns = ['created_at', 'file_size', 'file_name']
    const actualSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at'
    query.orderBy(actualSortBy, sortOrder)

    const assets = await query.paginate(page, perPage)

    return response.ok({
      success: true,
      data: assets.all(),
      meta: {
        total: assets.total,
        page: assets.currentPage,
        perPage: assets.perPage,
        lastPage: assets.lastPage,
      },
    })
  }

  /**
   * Get overall media stats
   */
  async stats({ response }: HttpContext) {
    await MediaService.syncLegacyAssets()
    const stats = await MediaService.getStats()
    return response.ok({
      success: true,
      data: stats,
    })
  }

  /**
   * Get single media asset detail with usage inspection
   */
  async show({ params, response }: HttpContext) {
    const asset = await MediaAsset.find(params.id)
    if (!asset) {
      return response.notFound({
        success: false,
        message: 'Media asset tidak ditemukan',
      })
    }

    const usageInfo = await MediaService.checkUsage(asset)

    return response.ok({
      success: true,
      data: {
        ...asset.toJSON(),
        usagesCount: usageInfo.usages.length,
        usages: usageInfo.usages,
      },
    })
  }

  /**
   * Upload single or multiple media files
   */
  async upload(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(uploadMediaValidator)

    // Handle multiple files if sent under 'files'
    const files = request.files('files', {
      size: '30mb',
      extnames: [
        'jpg',
        'jpeg',
        'png',
        'webp',
        'gif',
        'svg',
        'pdf',
        'mp4',
        'webm',
        'zip',
        'doc',
        'docx',
      ],
    })

    if (files && files.length > 0) {
      const uploadedAssets: MediaAsset[] = []
      const errors: Array<{ fileName: string; errors: unknown }> = []

      for (const file of files) {
        if (!file.isValid) {
          errors.push({ fileName: file.clientName, errors: file.errors })
          continue
        }

        const asset = await MediaService.uploadFile(file, payload.altText)
        ActivityLogService.log(ctx, 'create', 'media', asset.id, { fileName: asset.fileName })
        uploadedAssets.push(asset)
      }

      return response.created({
        success: true,
        message: `Berhasil mengunggah ${uploadedAssets.length} file.${errors.length > 0 ? ` (${errors.length} gagal)` : ''}`,
        data: uploadedAssets,
        errors: errors.length > 0 ? errors : undefined,
      })
    }

    // Handle single file if sent under 'file'
    const file = request.file('file', {
      size: '30mb',
      extnames: [
        'jpg',
        'jpeg',
        'png',
        'webp',
        'gif',
        'svg',
        'pdf',
        'mp4',
        'webm',
        'zip',
        'doc',
        'docx',
      ],
    })

    if (!file) {
      return response.badRequest({
        success: false,
        message: 'Tidak ada file yang diunggah',
      })
    }

    if (!file.isValid) {
      return response.badRequest({
        success: false,
        message: 'Validasi upload file gagal',
        errors: file.errors,
      })
    }

    const asset = await MediaService.uploadFile(file, payload.altText)
    ActivityLogService.log(ctx, 'create', 'media', asset.id, { fileName: asset.fileName })

    return response.created({
      success: true,
      message: 'File berhasil diunggah',
      data: asset,
    })
  }

  /**
   * Update media metadata (altText, fileName)
   */
  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const payload = await request.validateUsing(updateMediaValidator)

    const asset = await MediaAsset.findOrFail(params.id)

    if (payload.altText !== undefined) {
      asset.altText = payload.altText
    }
    if (payload.fileName !== undefined) {
      asset.fileName = payload.fileName
    }

    await asset.save()

    ActivityLogService.log(ctx, 'update', 'media', asset.id, {
      fileName: asset.fileName,
      altText: asset.altText,
    })

    return response.ok({
      success: true,
      message: 'Metadata media berhasil diperbarui',
      data: asset,
    })
  }

  /**
   * Delete single media asset
   */
  async destroy(ctx: HttpContext) {
    const { params, request, response } = ctx
    const force = request.input('force') === 'true' || request.input('force') === true
    const asset = await MediaAsset.find(params.id)

    if (!asset) {
      return response.notFound({
        success: false,
        message: 'Media asset tidak ditemukan',
      })
    }

    const fileName = asset.fileName
    const id = asset.id

    try {
      await MediaService.deleteFile(asset, force)
      ActivityLogService.log(ctx, 'delete', 'media', id, { fileName })

      return response.ok({
        success: true,
        message: 'Media asset berhasil dihapus',
      })
    } catch (err: unknown) {
      const customErr = err as { isUsed?: boolean; usages?: unknown[]; message: string }
      if (customErr.isUsed) {
        return response.badRequest({
          success: false,
          message: customErr.message,
          usages: customErr.usages,
        })
      }
      return response.internalServerError({
        success: false,
        message: (err as Error).message || 'Gagal menghapus media asset',
      })
    }
  }

  /**
   * Bulk delete multiple media assets
   */
  async bulkDestroy(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = await request.validateUsing(bulkDeleteMediaValidator)
    const force = request.input('force') === 'true' || request.input('force') === true

    const assets = await MediaAsset.query().whereIn('id', payload.ids)
    const deletedIds: string[] = []
    const failedIds: Array<{ id: string; fileName: string; reason: string }> = []

    for (const asset of assets) {
      try {
        await MediaService.deleteFile(asset, force)
        deletedIds.push(asset.id)
        ActivityLogService.log(ctx, 'delete', 'media', asset.id, { fileName: asset.fileName })
      } catch (err: unknown) {
        failedIds.push({
          id: asset.id,
          fileName: asset.fileName,
          reason: (err as Error).message || 'Gagal menghapus',
        })
      }
    }

    return response.ok({
      success: true,
      message: `Berhasil menghapus ${deletedIds.length} media.${failedIds.length > 0 ? ` (${failedIds.length} gagal)` : ''}`,
      data: {
        deletedIds,
        failedIds,
      },
    })
  }
}
