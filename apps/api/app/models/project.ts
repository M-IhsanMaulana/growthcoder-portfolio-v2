import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  hasMany,
  manyToMany,
  beforeCreate,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import ProjectCategory from '#models/project_category'
import ProjectGallery from '#models/project_gallery'
import TechStack from '#models/tech_stack'
import ProjectView from '#models/project_view'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare excerpt: string

  @column()
  declare content: string

  @column()
  declare clientName: string | null

  @column()
  declare role: string | null

  @column()
  declare projectYear: number

  @column()
  declare coverImage: string

  @column()
  declare demoUrl: string | null

  @column()
  declare repositoryUrl: string | null

  @column()
  declare isFeatured: boolean

  @column()
  declare order: number

  @column()
  declare viewCount: number

  @column()
  declare demoClickCount: number

  @column()
  declare repoClickCount: number

  @column()
  declare categoryId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => ProjectCategory, { foreignKey: 'categoryId' })
  declare category: BelongsTo<typeof ProjectCategory>

  @hasMany(() => ProjectGallery, { foreignKey: 'projectId' })
  declare galleries: HasMany<typeof ProjectGallery>

  @hasMany(() => ProjectView, { foreignKey: 'projectId' })
  declare views: HasMany<typeof ProjectView>

  @manyToMany(() => TechStack, {
    pivotTable: 'project_tech_stacks',
    pivotForeignKey: 'project_id',
    pivotRelatedForeignKey: 'tech_stack_id',
  })
  declare techStacks: ManyToMany<typeof TechStack>

  @beforeCreate()
  static assignUuid(project: Project) {
    if (!project.id) {
      project.id = randomUUID()
    }
  }
}
