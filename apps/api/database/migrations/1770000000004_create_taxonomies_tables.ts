import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('project_categories', (table) => {
      table.uuid('id').primary()
      table.string('name', 150).notNullable()
      table.string('slug', 180).notNullable().unique()
      table.text('description').nullable()
      table.integer('order').notNullable().defaultTo(0)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.createTable('categories', (table) => {
      table.uuid('id').primary()
      table.string('name', 150).notNullable()
      table.string('slug', 180).notNullable().unique()
      table.text('description').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.createTable('tags', (table) => {
      table.uuid('id').primary()
      table.string('name', 100).notNullable()
      table.string('slug', 120).notNullable().unique()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable('tags')
    this.schema.dropTable('categories')
    this.schema.dropTable('project_categories')
  }
}
