/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('task_labels', (table) => {
    table.increments('id').primary();
    table.integer('task_id').unsigned().notNullable()
      .references('id').inTable('tasks')
      .onDelete('CASCADE');
    table.integer('label_id').unsigned().notNullable()
      .references('id').inTable('labels')
      .onDelete('CASCADE');
    table.unique(['task_id', 'label_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable('task_labels');
};
