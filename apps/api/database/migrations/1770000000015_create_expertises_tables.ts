import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('expertises', (table) => {
      table.uuid('id').primary()
      table.string('title', 150).notNullable()
      table.string('slug', 180).notNullable().unique()
      table.string('subtitle', 200).notNullable()
      table.text('description').notNullable()
      table.text('icon_svg').nullable()
      table.integer('order').notNullable().defaultTo(0)
      table.boolean('is_featured').notNullable().defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.createTable('expertise_tech_stacks', (table) => {
      table.increments('id').primary()
      table
        .uuid('expertise_id')
        .notNullable()
        .references('id')
        .inTable('expertises')
        .onDelete('CASCADE')
      table
        .uuid('tech_stack_id')
        .notNullable()
        .references('id')
        .inTable('tech_stacks')
        .onDelete('CASCADE')
      table.unique(['expertise_id', 'tech_stack_id'])
    })
  }

  async down() {
    this.schema.dropTable('expertise_tech_stacks')
    this.schema.dropTable('expertises')
  }
}
