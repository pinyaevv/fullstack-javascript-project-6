import {
  beforeEach,
  describe,
  test,
  expect,
} from '@jest/globals';
import fastify from 'fastify';
import init from '../server/plugin.js';
import { encrypt } from '../server/lib/secure.js';

let app;
let knex;
let models;

beforeEach(async () => {
  app = fastify();
  await init(app);
  await app.ready();

  knex = app.objection.knex;
  models = app.objection.models;

  await knex.migrate.rollback(undefined, true);
  await knex.migrate.latest();

  await knex('users').insert({
    email: 'Sheridan88@hotmail.com',
    passwordDigest: encrypt('password'),
  });

  await knex('task_statuses').insert({ name: 'Open' });
});

afterEach(async () => {
  await knex.migrate.rollback(undefined, true);
  await app.close();
});

describe('Task statuses CRUD', () => {
  test('index page', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/statuses',
    });
    expect(response.statusCode).toBe(200);
  });

  test('new page', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/statuses/new',
    });
    expect(response.statusCode).toBe(200);
  });

  test('create', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/statuses',
      payload: { data: { name: 'In Progress' } },
    });
    expect(response.statusCode).toBe(302);

    const status = await models.taskStatus.query().findOne({ name: 'In Progress' });
    expect(status).not.toBeNull();
  });

  test('update', async () => {
    const [status] = await models.taskStatus.query();
    const response = await app.inject({
      method: 'PATCH',
      url: `/statuses/${status.id}`,
      payload: { data: { name: 'Updated' } },
    });
    expect(response.statusCode).toBe(302);

    const updated = await models.taskStatus.query().findById(status.id);
    expect(updated.name).toBe('Updated');
  });

  test('delete', async () => {
    const [status] = await models.taskStatus.query();
    const response = await app.inject({
      method: 'DELETE',
      url: `/statuses/${status.id}`,
    });
    expect(response.statusCode).toBe(302);

    const deleted = await models.taskStatus.query().findById(status.id);
    expect(deleted).toBeUndefined();
  });
});
