import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('article_views', (table) => {
      table.uuid('id').primary()
      table.uuid('post_id').notNullable().references('id').inTable('posts').onDelete('CASCADE')
      table.string('visitor_hash', 64).notNullable()
      table.string('ip_address', 45).nullable()
      table.text('user_agent').nullable()
      table.string('device_type', 30).notNullable().defaultTo('desktop') // desktop, mobile, tablet
      table.string('browser', 50).notNullable().defaultTo('Unknown')
      table.string('os', 50).notNullable().defaultTo('Unknown')
      table.text('referrer').nullable()
      table.string('referrer_source', 100).notNullable().defaultTo('Direct')
      table.timestamp('created_at', { useTz: true }).notNullable()

      table.index(['post_id', 'created_at'])
      table.index(['post_id', 'visitor_hash', 'created_at'])
    })
  }

  async down() {
    this.schema.dropTable('article_views')
  }
}
