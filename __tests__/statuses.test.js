// @ts-check
import fastify from 'fastify';

import init from '../server/plugin.js';
import { buildUserWithPassword } from './factories/userFactory.js';
import prepareData from './helpers/index.js';

/**
 * @typedef {import('objection').Model & { id: number, name: string }} TaskStatus
 */

describe('Task statuses CRUD', () => {
  let app;
  /** @type {import('knex').Knex} */
  let knex;
  /** @type {any} */
  let models;
  let user;
  let cookies;

  beforeEach(async () => {
    app = fastify({ logger: false });
    await init(app);
    knex = /** @type {import('knex').Knex} */ (app.objection.knex);
    models = /** @type {any} */ (app.objection.models);

    await knex.migrate.latest();

    const { plain, hashed } = buildUserWithPassword();
    user = plain;

    await prepareData(app, { users: [{ plain, hashed }] });

    const login = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: { email: user.email, password: user.password } },
    });

    const [cookie] = login.cookies;
    cookies = { [cookie.name]: cookie.value };
  });

  it('index page', async () => {
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('taskStatuses'),
    });
    expect(res.statusCode).toBe(200);
  });

  it('new page', async () => {
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('newTaskStatus'),
    });
    expect(res.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = { name: 'ready' };

    const res = await app.inject({
      method: 'POST',
      url: app.reverse('taskStatuses'),
      cookies,
      payload: { data: params },
    });

    expect(res.statusCode).toBe(302);
    const status = await models.taskStatus.query().findOne({ name: 'ready' });
    expect(status).not.toBeNull();
  });

  it('update', async () => {
    const status = await models.taskStatus.query().insert({ name: 'will-be-updated' });

    const res = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateTaskStatus', { id: status.id }),
      cookies,
      payload: { data: { name: 'updated' } },
    });

    expect(res.statusCode).toBe(302);

    const updated = await models.taskStatus.query().findById(status.id);
    expect(updated.name).toBe('updated');
  });

  it('delete', async () => {
    const status = await models.taskStatus.query().insert({ name: 'to-be-deleted' });

    const res = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteTaskStatus', { id: status.id }),
      cookies,
    });

    expect(res.statusCode).toBe(302);

    const deleted = await models.taskStatus.query().findById(status.id);
    expect(deleted).toBeUndefined();
  });

  afterEach(async () => {
    await knex.migrate.rollback();
    await app.close();
  });
});
