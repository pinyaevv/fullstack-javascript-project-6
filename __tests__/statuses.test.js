// @ts-check
import fastify from 'fastify';

import init from '../server/plugin.js';
import { buildUser } from './factories/userFactory.js';
import prepareData from './helpers/index.js';

describe('Task statuses CRUD', () => {
  let app;
  let knex;
  let models;
  let user;
  let cookies;

  beforeAll(async () => {
    app = fastify({ logger: false });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;

    await knex.migrate.latest();
    await prepareData(app);

    user = buildUser();
    await models.user.query().insert(user);

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

  afterAll(async () => {
    await knex.migrate.rollback();
    await app.close();
  });
});
