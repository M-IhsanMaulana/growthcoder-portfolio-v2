import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'workflow_steps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('step_number', 10).notNullable()
      table.string('title', 200).notNullable()
      table.string('short_title', 100).notNullable()
      table.text('description').notNullable()
      table.jsonb('activities').notNullable().defaultTo('[]')
      table.string('icon_svg', 100).nullable()
      table.string('badge_color', 100).nullable()
      table.integer('order').notNullable().defaultTo(0)
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
