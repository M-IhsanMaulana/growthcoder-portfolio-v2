import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import TechStack from '#models/tech_stack'

export default class Expertise extends BaseModel {
  static table = 'expertises'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare subtitle: string

  @column()
  declare description: string

  @column()
  declare iconSvg: string | null

  @column()
  declare order: number

  @column()
  declare isFeatured: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => TechStack, {
    pivotTable: 'expertise_tech_stacks',
    pivotForeignKey: 'expertise_id',
    pivotRelatedForeignKey: 'tech_stack_id',
  })
  declare techStacks: ManyToMany<typeof TechStack>

  @beforeCreate()
  static assignUuid(item: Expertise) {
    if (!item.id) {
      item.id = randomUUID()
    }
  }
}
