import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('projects', (table) => {
      table.uuid('id').primary()
      table.string('title', 255).notNullable()
      table.string('slug', 255).notNullable().unique()
      table.text('excerpt').notNullable()
      table.text('content').notNullable() // Markdown / JSON case study
      table.string('client_name', 150).nullable()
      table.integer('project_year').notNullable().defaultTo(new Date().getFullYear())
      table.text('cover_image').notNullable()
      table.text('demo_url').nullable()
      table.text('repository_url').nullable()
      table.boolean('is_featured').notNullable().defaultTo(false)
      table.integer('order').notNullable().defaultTo(0)
      table
        .uuid('category_id')
        .nullable()
        .references('id')
        .inTable('project_categories')
        .onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.createTable('project_galleries', (table) => {
      table.uuid('id').primary()
      table
        .uuid('project_id')
        .notNullable()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
      table.text('image_url').notNullable()
      table.string('caption', 255).nullable()
      table.integer('sort_order').notNullable().defaultTo(0)
      table.timestamp('created_at', { useTz: true }).notNullable()
    })

    this.schema.createTable('project_tech_stacks', (table) => {
      table.increments('id').primary()
      table
        .uuid('project_id')
        .notNullable()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
      table
        .uuid('tech_stack_id')
        .notNullable()
        .references('id')
        .inTable('tech_stacks')
        .onDelete('CASCADE')

      table.unique(['project_id', 'tech_stack_id'])
    })
  }

  async down() {
    this.schema.dropTable('project_tech_stacks')
    this.schema.dropTable('project_galleries')
    this.schema.dropTable('projects')
  }
}
