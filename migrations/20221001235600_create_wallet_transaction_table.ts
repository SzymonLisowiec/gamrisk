import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('wallet_transaction', (table) => {
    table.bigIncrements('id');
    table.uuid('userId').notNullable();
    table.string('walletType', 16).notNullable();
    table.integer('value').notNullable();
    table.integer('balance').unsigned().notNullable();
    table.string('location', 32).notNullable();
    table.json('meta').nullable();
    table.dateTime('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table.dateTime('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('wallet_transaction');
}
