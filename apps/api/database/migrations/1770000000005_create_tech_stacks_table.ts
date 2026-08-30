import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tech_stacks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name', 150).notNullable()
      table.string('slug', 180).notNullable().unique()
      table.text('icon_svg').nullable()
      table.string('category', 50).notNullable().defaultTo('tools') // frontend, backend, database, devops, tools
      table.boolean('is_featured').notNullable().defaultTo(false)
      table.integer('level').nullable()
      table.integer('order').notNullable().defaultTo(0)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
