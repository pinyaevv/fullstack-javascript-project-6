// @ts-check
import fastify from 'fastify';
import _ from 'lodash';

import init from '../server/plugin.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('Task statuses CRUD', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();

  beforeAll(async () => {
    app = fastify({ logger: false });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;

    await knex.migrate.latest();
    await prepareData(app);
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
    const { existing } = testData.users;

    const login = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: existing },
    });

    const [cookie] = login.cookies;
    const cookies = { [cookie.name]: cookie.value };

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
    const { existing } = testData.users;
    const login = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: existing },
    });

    const [cookie] = login.cookies;
    const cookies = { [cookie.name]: cookie.value };

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
    const { existing } = testData.users;
    const login = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: existing },
    });

    const [cookie] = login.cookies;
    const cookies = { [cookie.name]: cookie.value };

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
