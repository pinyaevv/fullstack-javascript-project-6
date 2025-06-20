import 'dotenv/config';
import knex from 'knex';
import config from '../knexfile.js';

const db = knex(config.production);

async function main() {
  try {
    const count = await db('knex_migrations')
      .where({ name: '20250608161354_create_task_statuses_table.cjs' })
      .del();

    console.log(`Удалено записей: ${count}`);
  } catch (err) {
    console.error('Ошибка удаления миграции:', err);
  } finally {
    await db.destroy();
  }
}

main();
