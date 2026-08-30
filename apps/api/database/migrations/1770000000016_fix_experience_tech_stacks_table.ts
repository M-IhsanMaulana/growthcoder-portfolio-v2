import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'experience_tech_stacks'

  async up() {
    this.schema.dropTableIfExists(this.tableName)

    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .uuid('experience_id')
        .notNullable()
        .references('id')
        .inTable('experiences')
        .onDelete('CASCADE')
      table
        .uuid('tech_stack_id')
        .notNullable()
        .references('id')
        .inTable('tech_stacks')
        .onDelete('CASCADE')

      table.unique(['experience_id', 'tech_stack_id'])
    })
  }

  async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
