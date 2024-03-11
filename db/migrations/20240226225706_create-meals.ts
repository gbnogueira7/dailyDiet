import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').defaultTo(knex.raw('gen_random_uuid()')).primary()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.boolean('inDiet').notNullable()
    table.uuid('userId').notNullable().references('id').inTable('users')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
