import fastify from 'fastify';

import init from '../server/plugin.js';
import prepareData from './helpers/index.js';

describe('test labels CRUD', () => {
  let app;
  let knex;
  let models;
  let testUsers;

  beforeAll(async () => {
    app = fastify({ exposeHeadRoutes: false, logger: false });
    await init(app);

    knex = app.objection.knex;
    models = app.objection.models;
  });

  beforeEach(async () => {
    await knex.migrate.rollback(undefined, true);
    await knex.migrate.latest();

    const data = await prepareData(app);
    testUsers = data.users;
  });

  afterAll(async () => {
    await knex.migrate.rollback(undefined, true);
    await app.close();
  });

  const loginAndGetCookies = async (user) => {
    const res = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: user },
    });
    const [sessionCookie] = res.cookies;
    return { [sessionCookie.name]: sessionCookie.value };
  };

  it('GET /labels - список меток', async () => {
    const label = await models.label.query().insert({ name: 'bug' });

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('labels'),
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain(label.name);
  });

  it('POST /labels - создание метки', async () => {
    const cookies = await loginAndGetCookies(testUsers[0]);
    const labelData = { name: 'feature' };

    const res = await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      cookies,
      payload: { data: labelData },
    });

    expect(res.statusCode).toBe(302);

    const label = await models.label.query().findOne(labelData);
    expect(label).not.toBeNull();
  });

  it('PATCH /labels/:id - обновление метки', async () => {
    const cookies = await loginAndGetCookies(testUsers[0]);
    const label = await models.label.query().insert({ name: 'old name' });

    const res = await app.inject({
      method: 'PATCH',
      url: app.reverse('labels.update', { id: label.id }),
      cookies,
      payload: { data: { name: 'new name' } },
    });

    expect(res.statusCode).toBe(302);

    const updated = await models.label.query().findById(label.id);
    expect(updated.name).toBe('new name');
  });

  it('DELETE /labels/:id - удаление неиспользуемой метки', async () => {
    const cookies = await loginAndGetCookies(testUsers[0]);
    const label = await models.label.query().insert({ name: 'temporary' });

    const res = await app.inject({
      method: 'DELETE',
      url: app.reverse('labels.delete', { id: label.id }),
      cookies,
    });

    expect(res.statusCode).toBe(302);

    const deleted = await models.label.query().findById(label.id);
    expect(deleted).toBeUndefined();
  });

  it('DELETE /labels/:id - запрет на удаление связанной метки', async () => {
    const cookies = await loginAndGetCookies(testUsers[0]);

    const label = await models.label.query().insert({ name: 'linked' });
    const status = await models.taskStatus.query().findOne({ name: 'in progress' });

    await models.task.query().insertGraphAndFetch({
      name: 'task with label',
      statusId: status.id,
      creatorId: testUsers[0].id,
      executorId: testUsers[1]?.id || null,
      labels: [{ id: label.id, name: label.name }],
    }, { relate: true });

    const res = await app.inject({
      method: 'DELETE',
      url: app.reverse('labels.delete', { id: label.id }),
      cookies,
    });

    expect(res.statusCode).toBe(302);

    const notDeleted = await models.label.query().findById(label.id);
    expect(notDeleted).not.toBeUndefined();
  });
});
