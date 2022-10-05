import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('jackpot_round', (table) => {
    table.uuid('id').primary();
    table.uuid('roundId');
    table.uuid('userId');
    table.integer('value').unsigned().notNullable();
    table.dateTime('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('jackpot_round');
}
