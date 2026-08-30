import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  hasMany,
  manyToMany,
  beforeCreate,
  beforeSave,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import Category from '#models/category'
import Tag from '#models/tag'
import ArticleView from '#models/article_view'
import type { ArticleStatus } from '@growthcoder/types'

function safeNormalizeUnicode(str?: string | null): string | null {
  if (!str) return str ?? null
  return str
    .replace(/→/g, '&rarr;')
    .replace(/←/g, '&larr;')
    .replace(/↔/g, '&harr;')
    .replace(/⇒/g, '&rArr;')
    .replace(/⇐/g, '&lArr;')
    .replace(/—/g, '&mdash;')
    .replace(/–/g, '&ndash;')
    .replace(/…/g, '&hellip;')
    .replace(/•/g, '&bull;')
    .replace(/★/g, '&#9733;')
    .replace(/✓/g, '&#10003;')
    .replace(/✔/g, '&#10004;')
    .replace(/✗/g, '&#10007;')
    .replace(/✘/g, '&#10008;')
}

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare excerpt: string

  @column()
  declare content: string

  @column()
  declare coverImage: string | null

  @column()
  declare status: ArticleStatus

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column.dateTime()
  declare scheduledAt: DateTime | null

  @column()
  declare viewCount: number

  @column()
  declare readingTimeMinutes: number | null

  @column()
  declare metaTitle: string | null

  @column()
  declare metaDescription: string | null

  @column()
  declare categoryId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Category, { foreignKey: 'categoryId' })
  declare category: BelongsTo<typeof Category>

  @hasMany(() => ArticleView, { foreignKey: 'postId' })
  declare views: HasMany<typeof ArticleView>

  @manyToMany(() => Tag, {
    pivotTable: 'post_tags',
    pivotForeignKey: 'post_id',
    pivotRelatedForeignKey: 'tag_id',
  })
  declare tags: ManyToMany<typeof Tag>

  @beforeCreate()
  static assignUuid(post: Post) {
    if (!post.id) {
      post.id = randomUUID()
    }
  }

  @beforeSave()
  static normalizeUnicodeContent(post: Post) {
    if (post.content) {
      post.content = safeNormalizeUnicode(post.content) || ''
    }
    if (post.excerpt) {
      post.excerpt = safeNormalizeUnicode(post.excerpt) || ''
    }
    if (post.title) {
      post.title = safeNormalizeUnicode(post.title) || ''
    }
  }
}
