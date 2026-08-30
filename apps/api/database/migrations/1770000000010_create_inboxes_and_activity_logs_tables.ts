import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('contact_inboxes', (table) => {
      table.uuid('id').primary()
      table.string('name', 150).notNullable()
      table.string('email', 254).notNullable()
      table.string('subject', 255).nullable()
      table.text('message').notNullable()
      table.string('budget_range', 100).nullable()
      table.string('project_category', 100).nullable()
      table.string('ip_address', 45).nullable()
      table.text('user_agent').nullable()
      table.string('status', 50).notNullable().defaultTo('unread') // unread, read, replied, archived
      table.text('reply_notes').nullable()
      table.timestamp('replied_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.createTable('activity_logs', (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.string('action', 50).notNullable() // create, update, delete, login, logout, setting_change
      table.string('entity', 100).notNullable()
      table.string('entity_id', 100).nullable()
      table.jsonb('payload').nullable()
      table.string('ip_address', 45).nullable()
      table.text('user_agent').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable('activity_logs')
    this.schema.dropTable('contact_inboxes')
  }
}
