import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import Post from '#models/post'

export default class ArticleView extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare postId: string

  @column()
  declare visitorHash: string

  @column()
  declare ipAddress: string | null

  @column()
  declare userAgent: string | null

  @column()
  declare deviceType: 'desktop' | 'mobile' | 'tablet'

  @column()
  declare browser: string

  @column()
  declare os: string

  @column()
  declare referrer: string | null

  @column()
  declare referrerSource: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Post, { foreignKey: 'postId' })
  declare post: BelongsTo<typeof Post>

  @beforeCreate()
  static assignUuid(item: ArticleView) {
    if (!item.id) {
      item.id = randomUUID()
    }
  }
}
