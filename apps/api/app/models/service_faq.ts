import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import Service from '#models/service'

export default class ServiceFaq extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare serviceId: string

  @column()
  declare question: string

  @column()
  declare answer: string

  @column()
  declare sortOrder: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Service, { foreignKey: 'serviceId' })
  declare service: BelongsTo<typeof Service>

  @beforeCreate()
  static assignUuid(item: ServiceFaq) {
    if (!item.id) {
      item.id = randomUUID()
    }
  }
}
