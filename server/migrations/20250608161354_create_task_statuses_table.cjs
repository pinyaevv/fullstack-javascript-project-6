// 20250608161354_create_task_statuses_table.cjs

/** @param { import("knex").Knex } knex */
exports.up = async function (knex) {
  await knex.schema.createTable('task_statuses', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/** @param { import("knex").Knex } knex */
exports.down = async function (knex) {
  await knex.schema.dropTable('task_statuses');
};
