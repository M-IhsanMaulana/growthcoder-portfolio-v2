import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import Project from '#models/project'
import type { TechCategory } from '@growthcoder/types'

export default class TechStack extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare iconSvg: string | null

  @column()
  declare category: TechCategory

  @column()
  declare isFeatured: boolean

  @column()
  declare level: number | null

  @column()
  declare order: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => Project, {
    pivotTable: 'project_tech_stacks',
    pivotForeignKey: 'tech_stack_id',
    pivotRelatedForeignKey: 'project_id',
  })
  declare projects: ManyToMany<typeof Project>

  @beforeCreate()
  static assignUuid(item: TechStack) {
    if (!item.id) {
      item.id = randomUUID()
    }
  }
}
