// @ts-check

/** @param { import("knex").Knex } knex */
export async function up(knex) {
  await knex.schema.createTable('task_statuses', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

/** @param { import("knex").Knex } knex */
export async function down(knex) {
  await knex.schema.dropTable('task_statuses');
}
