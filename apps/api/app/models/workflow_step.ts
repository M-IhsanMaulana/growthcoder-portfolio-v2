import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export default class WorkflowStep extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare stepNumber: string

  @column()
  declare title: string

  @column()
  declare shortTitle: string

  @column()
  declare description: string

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
  declare activities: string[]

  @column()
  declare iconSvg: string | null

  @column()
  declare badgeColor: string | null

  @column()
  declare order: number

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUuid(item: WorkflowStep) {
    if (!item.id) {
      item.id = randomUUID()
    }
  }
}
