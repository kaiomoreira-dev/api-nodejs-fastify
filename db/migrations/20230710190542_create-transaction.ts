/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
/* eslint-disable prettier/prettier */
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transaction', (table) => {
        table.uuid('id').primary(),
        table.text('description').notNullable(),
        table.decimal('amount', 10, 2).notNullable(),
        table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('transaction')
}
