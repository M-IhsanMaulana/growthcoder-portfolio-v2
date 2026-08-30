import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('experiences', (table) => {
      table.uuid('id').primary()
      table.string('company', 150).notNullable()
      table.string('position', 150).notNullable()
      table.string('location', 150).nullable()
      table.string('employment_type', 50).nullable().defaultTo('full-time')
      table.date('start_date').notNullable()
      table.date('end_date').nullable()
      table.boolean('is_current').notNullable().defaultTo(false)
      table.text('description').notNullable()
      table.integer('order').notNullable().defaultTo(0)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.createTable('educations', (table) => {
      table.uuid('id').primary()
      table.string('institution', 150).notNullable()
      table.string('degree', 100).notNullable()
      table.string('field_of_study', 150).notNullable()
      table.date('start_date').notNullable()
      table.date('end_date').nullable()
      table.boolean('is_current').notNullable().defaultTo(false)
      table.string('grade', 50).nullable()
      table.text('description').nullable()
      table.integer('order').notNullable().defaultTo(0)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.createTable('certifications', (table) => {
      table.uuid('id').primary()
      table.string('name', 200).notNullable()
      table.string('issuer', 150).notNullable()
      table.date('issue_date').notNullable()
      table.date('expiration_date').nullable()
      table.string('credential_id', 150).nullable()
      table.text('credential_url').nullable()
      table.integer('order').notNullable().defaultTo(0)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable('certifications')
    this.schema.dropTable('educations')
    this.schema.dropTable('experiences')
  }
}
