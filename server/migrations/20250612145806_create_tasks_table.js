// @ts-check

/** @param { import("knex").Knex } knex */
export async function up(knex) {
  await knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.integer('status_id').unsigned().notNullable()
      .references('id').inTable('task_statuses')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.integer('creator_id').unsigned().notNullable()
      .references('id').inTable('users')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.integer('executor_id').unsigned()
      .references('id').inTable('users')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.timestamps(true, true);
  });
}

/** @param { import("knex").Knex } knex */
export async function down(knex) {
  await knex.schema.dropTableIfExists('tasks');
}
