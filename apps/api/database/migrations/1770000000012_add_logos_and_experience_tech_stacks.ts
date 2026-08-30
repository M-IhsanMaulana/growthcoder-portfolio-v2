import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('experiences', (table) => {
      table.text('company_logo_url').nullable()
    })

    this.schema.alterTable('educations', (table) => {
      table.text('institution_logo_url').nullable()
    })

    this.schema.alterTable('certifications', (table) => {
      table.text('issuer_logo_url').nullable()
    })

    this.schema.createTable('experience_tech_stacks', (table) => {
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
    this.schema.dropTable('experience_tech_stacks')

    this.schema.alterTable('certifications', (table) => {
      table.dropColumn('issuer_logo_url')
    })

    this.schema.alterTable('educations', (table) => {
      table.dropColumn('institution_logo_url')
    })

    this.schema.alterTable('experiences', (table) => {
      table.dropColumn('company_logo_url')
    })
  }
}
