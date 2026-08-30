import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { randomUUID } from 'node:crypto'
import Project from '#models/project'

export default class ProjectView extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare projectId: string

  @column()
  declare eventType: 'view' | 'demo_click' | 'repo_click'

  @column()
  declare visitorHash: string

  @column()
  declare ipAddress: string | null

  @column()
  declare userAgent: string | null

  @column()
  declare deviceType: 'desktop' | 'mobile' | 'tablet'

  @column()
  declare browser: string

  @column()
  declare os: string

  @column()
  declare referrer: string | null

  @column()
  declare referrerSource: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Project, { foreignKey: 'projectId' })
  declare project: BelongsTo<typeof Project>

  @beforeCreate()
  static assignUuid(item: ProjectView) {
    if (!item.id) {
      item.id = randomUUID()
    }
  }
}
