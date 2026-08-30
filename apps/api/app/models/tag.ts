import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import Post from '#models/post'

export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => Post, {
    pivotTable: 'post_tags',
    pivotForeignKey: 'tag_id',
    pivotRelatedForeignKey: 'post_id',
  })
  declare posts: ManyToMany<typeof Post>

  @beforeCreate()
  static assignUuid(item: Tag) {
    if (!item.id) {
      item.id = randomUUID()
    }
  }
}
