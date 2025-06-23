// @ts-check

import fastify from 'fastify';
import init from '../server/plugin.js';
import { encrypt } from '../server/lib/secure.js';

describe('Task statuses CRUD', () => {
  let app;
  let knex;
  let models;
  let cookie;

  beforeAll(async () => {
    app = fastify({ exposeHeadRoutes: false, logger: false });
    await init(app);
    await app.ready();

    knex = /** @type {import('knex').Knex} */ (app.objection.knex);
    models = app.objection.models;

    await knex.migrate.rollback(undefined, true);
    await knex.migrate.latest();

    const email = 'Hophop@tyktyk.com';
    const password = 'password';

    await knex('users').insert({
      email,
      passwordDigest: encrypt(password),
    });

    await knex('task_statuses').insert({ name: 'Open' });

    const signInResponse = await app.inject({
      method: 'POST',
      url: '/session',
      payload: {
        data: { email, password },
      },
    });

    const [sessionCookie] = signInResponse.cookies;
    cookie = { [sessionCookie.name]: sessionCookie.value };
  });

  afterAll(async () => {
    await knex.migrate.rollback(undefined, true);
    await app.close();
  });

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
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
  });

  test('create', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/statuses',
      payload: { data: { name: 'In Progress' } },
      cookies: cookie,
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
      cookies: cookie,
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
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);

    const deleted = await models.taskStatus.query().findById(status.id);
    expect(deleted).toBeUndefined();
  });
});
