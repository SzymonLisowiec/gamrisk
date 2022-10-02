import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('wallet', (table) => {
    table.uuid('userId').notNullable();
    table.string('type', 16).notNullable();
    table.integer('balance').unsigned().notNullable().defaultTo(0);
    table.dateTime('createdAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table.dateTime('updatedAt').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.primary(['userId', 'type']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('wallet');
}
