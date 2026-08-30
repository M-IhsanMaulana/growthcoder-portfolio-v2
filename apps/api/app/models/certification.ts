import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export default class Certification extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare issuer: string

  @column()
  declare issuerLogoUrl: string | null

  @column.date()
  declare issueDate: DateTime

  @column.date()
  declare expirationDate: DateTime | null

  @column()
  declare credentialId: string | null

  @column()
  declare credentialUrl: string | null

  @column()
  declare order: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUuid(item: Certification) {
    if (!item.id) {
      item.id = randomUUID()
    }
  }
}
