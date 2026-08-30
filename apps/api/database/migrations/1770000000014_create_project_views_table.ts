import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('projects', (table) => {
      table.integer('view_count').notNullable().defaultTo(0)
      table.integer('demo_click_count').notNullable().defaultTo(0)
      table.integer('repo_click_count').notNullable().defaultTo(0)
    })

    this.schema.createTable('project_views', (table) => {
      table.uuid('id').primary()
      table
        .uuid('project_id')
        .notNullable()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
      table.string('event_type', 30).notNullable().defaultTo('view') // 'view', 'demo_click', 'repo_click'
      table.string('visitor_hash', 64).notNullable()
      table.string('ip_address', 45).nullable()
      table.text('user_agent').nullable()
      table.string('device_type', 30).notNullable().defaultTo('desktop') // desktop, mobile, tablet
      table.string('browser', 50).notNullable().defaultTo('Unknown')
      table.string('os', 50).notNullable().defaultTo('Unknown')
      table.text('referrer').nullable()
      table.string('referrer_source', 100).notNullable().defaultTo('Direct')
      table.timestamp('created_at', { useTz: true }).notNullable()

      table.index(['project_id', 'created_at'])
      table.index(['project_id', 'event_type', 'created_at'])
      table.index(['project_id', 'visitor_hash', 'event_type', 'created_at'])
    })
  }

  async down() {
    this.schema.dropTable('project_views')

    this.schema.alterTable('projects', (table) => {
      table.dropColumn('view_count')
      table.dropColumn('demo_click_count')
      table.dropColumn('repo_click_count')
    })
  }
}
