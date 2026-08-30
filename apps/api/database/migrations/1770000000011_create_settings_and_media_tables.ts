import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('site_settings', (table) => {
      table.uuid('id').primary()
      table.string('key', 100).notNullable().unique()
      table.jsonb('value').notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.createTable('media_assets', (table) => {
      table.uuid('id').primary()
      table.string('file_name', 255).notNullable()
      table.text('file_path').notNullable()
      table.text('file_url').notNullable()
      table.string('mime_type', 100).notNullable()
      table.bigInteger('file_size').notNullable()
      table.string('media_type', 50).notNullable().defaultTo('image') // image, document, video, other
      table.integer('width').nullable()
      table.integer('height').nullable()
      table.string('alt_text', 255).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable('media_assets')
    this.schema.dropTable('site_settings')
  }
}
