import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export default class Education extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare institution: string

  @column()
  declare degree: string

  @column()
  declare fieldOfStudy: string

  @column()
  declare institutionLogoUrl: string | null

  @column.date()
  declare startDate: DateTime

  @column.date()
  declare endDate: DateTime | null

  @column()
  declare isCurrent: boolean

  @column()
  declare grade: string | null

  @column()
  declare description: string | null

  @column()
  declare order: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUuid(item: Education) {
    if (!item.id) {
      item.id = randomUUID()
    }
  }
}
