import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('posts', (table) => {
      table.uuid('id').primary()
      table.string('title', 255).notNullable()
      table.string('slug', 255).notNullable().unique()
      table.text('excerpt').notNullable()
      table.text('content').notNullable() // Tiptap HTML / JSON / Markdown
      table.text('cover_image').nullable()
      table.string('status', 50).notNullable().defaultTo('draft') // draft, published, scheduled
      table.timestamp('published_at', { useTz: true }).nullable()
      table.timestamp('scheduled_at', { useTz: true }).nullable()
      table.bigInteger('view_count').notNullable().defaultTo(0)
      table.integer('reading_time_minutes').nullable()
      table.string('meta_title', 255).nullable()
      table.text('meta_description').nullable()
      table
        .uuid('category_id')
        .nullable()
        .references('id')
        .inTable('categories')
        .onDelete('SET NULL')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })

    this.schema.createTable('post_tags', (table) => {
      table.increments('id').primary()
      table.uuid('post_id').notNullable().references('id').inTable('posts').onDelete('CASCADE')
      table.uuid('tag_id').notNullable().references('id').inTable('tags').onDelete('CASCADE')
      table.unique(['post_id', 'tag_id'])
    })
  }

  async down() {
    this.schema.dropTable('post_tags')
    this.schema.dropTable('posts')
  }
}
