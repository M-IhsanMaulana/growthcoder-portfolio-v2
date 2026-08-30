import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import type { MediaType } from '@growthcoder/types'

export default class MediaAsset extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare fileName: string

  @column()
  declare filePath: string

  @column({
    consume: (value: string) => {
      if (value && value.startsWith('/')) {
        const appUrl = process.env.APP_URL || 'http://localhost:3333'
        return `${appUrl.replace(/\/$/, '')}${value}`
      }
      return value
    },
  })
  declare fileUrl: string

  @column()
  declare mimeType: string

  @column()
  declare fileSize: number

  @column({
    consume: (value: MediaType, _attribute: string, model: any) => {
      if ((value === 'other' || !value) && model?.fileName) {
        const ext = model.fileName.split('.').pop()?.toLowerCase() || ''
        if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'avif', 'ico', 'bmp'].includes(ext)) {
          return 'image'
        }
        if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) {
          return 'video'
        }
        if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(ext)) {
          return 'document'
        }
      }
      return value || 'other'
    },
  })
  declare mediaType: MediaType

  @column()
  declare width: number | null

  @column()
  declare height: number | null

  @column()
  declare altText: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUuid(item: MediaAsset) {
    if (!item.id) {
      item.id = randomUUID()
    }
  }
}
