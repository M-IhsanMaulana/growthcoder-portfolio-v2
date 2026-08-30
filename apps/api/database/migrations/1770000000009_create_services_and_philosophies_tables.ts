import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('services', (table) => {
      table.uuid('id').primary()
      table.string('title', 150).notNullable()
      table.string('slug', 180).notNullable().unique()
      table.text('icon_svg').nullable()
      table.text('short_description').notNullable()
      table.text('value_proposition').notNullable()
      table.jsonb('deliverables').notNullable().defaultTo('[]')
      table.integer('order').notNullable().defaultTo(0)
      table.boolean('is_featured').notNullable().defaultTo(false)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.createTable('service_faqs', (table) => {
      table.uuid('id').primary()
      table
        .uuid('service_id')
        .notNullable()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')
      table.text('question').notNullable()
      table.text('answer').notNullable()
      table.integer('sort_order').notNullable().defaultTo(0)
      table.timestamp('created_at', { useTz: true }).notNullable()
    })

    this.schema.createTable('philosophies', (table) => {
      table.uuid('id').primary()
      table.string('title', 150).notNullable()
      table.text('icon_svg').nullable()
      table.string('tagline', 255).notNullable()
      table.text('description').notNullable()
      table.integer('order').notNullable().defaultTo(0)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable('philosophies')
    this.schema.dropTable('service_faqs')
    this.schema.dropTable('services')
  }
}
