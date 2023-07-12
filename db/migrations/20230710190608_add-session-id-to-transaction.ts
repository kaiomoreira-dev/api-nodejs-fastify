/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
/* eslint-disable prettier/prettier */
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('transaction', (table) => {
        table.uuid('sessionId').after('id').index()
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('transaction', (table) => {
        table.dropColumn('sessionId')
    })
}
