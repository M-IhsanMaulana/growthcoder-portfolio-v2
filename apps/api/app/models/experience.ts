import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import TechStack from '#models/tech_stack'

export default class Experience extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare company: string

  @column()
  declare position: string

  @column()
  declare location: string | null

  @column()
  declare employmentType: 'full-time' | 'part-time' | 'contract' | 'freelance' | null

  @column()
  declare companyLogoUrl: string | null

  @column.date()
  declare startDate: DateTime

  @column.date()
  declare endDate: DateTime | null

  @column()
  declare isCurrent: boolean

  @column()
  declare description: string

  @column()
  declare order: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => TechStack, {
    pivotTable: 'experience_tech_stacks',
    pivotForeignKey: 'experience_id',
    pivotRelatedForeignKey: 'tech_stack_id',
  })
  declare techStacks: ManyToMany<typeof TechStack>

  @beforeCreate()
  static assignUuid(item: Experience) {
    if (!item.id) {
      item.id = randomUUID()
    }
  }
}
