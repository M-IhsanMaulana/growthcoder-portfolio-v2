import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import type { InboxStatus } from '@growthcoder/types'

export default class ContactInbox extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare subject: string | null

  @column()
  declare message: string

  @column()
  declare budgetRange: string | null

  @column()
  declare projectCategory: string | null

  @column()
  declare ipAddress: string | null

  @column()
  declare userAgent: string | null

  @column()
  declare status: InboxStatus

  @column()
  declare replyNotes: string | null

  @column.dateTime()
  declare repliedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUuid(item: ContactInbox) {
    if (!item.id) {
      item.id = randomUUID()
    }
  }
}
