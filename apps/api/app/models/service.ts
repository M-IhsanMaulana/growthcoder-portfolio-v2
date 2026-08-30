import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import ServiceFaq from '#models/service_faq'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare iconSvg: string | null

  @column()
  declare shortDescription: string

  @column()
  declare valueProposition: string

  @column({
    prepare: (value: string[]) => JSON.stringify(value || []),
    consume: (value: string | string[]) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return []
        }
      }
      return value || []
    },
  })
  declare deliverables: string[]

  @column()
  declare order: number

  @column()
  declare isFeatured: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => ServiceFaq, { foreignKey: 'serviceId' })
  declare faqs: HasMany<typeof ServiceFaq>

  @beforeCreate()
  static assignUuid(item: Service) {
    if (!item.id) {
      item.id = randomUUID()
    }
  }
}
