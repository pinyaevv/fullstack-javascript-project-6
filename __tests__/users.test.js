// @ts-check

import _ from 'lodash';
import fastify from 'fastify';

import { jest } from '@jest/globals';
import init from '../server/plugin.js'; // твой инициализатор, где регаешь fastifySecureSession
import encrypt from '../server/lib/secure.cjs';
import { getTestData, prepareData } from './helpers/index.js';

jest.setTimeout(20000);

describe('test users CRUD', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();

  beforeAll(async () => {
    console.log('Starting test setup...');
    app = fastify({
      exposeHeadRoutes: false,
      logger: false, // для тестов лучше без логов или с target: 'pino-pretty'
    });

    await init(app);

    knex = app.objection.knex;
    models = app.objection.models;

    // Применяем миграции для in-memory базы (если используешь in-memory sqlite)
    await knex.migrate.latest();

    // Подготавливаем данные
    await prepareData(app);
    console.log('Test setup complete');
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('users'),
    });
    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newUser'),
    });
    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: { data: params },
    });

    expect(response.statusCode).toBe(302);

    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };

    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  test('update user (self)', async () => {
    const { existing } = testData.users;

    const loginResponse = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: existing },
    });
    expect(loginResponse.statusCode).toBe(302);

    const [sessionCookie] = loginResponse.cookies;
    const cookies = { [sessionCookie.name]: sessionCookie.value };

    const user = await models.user.query().findOne({ email: existing.email });

    const newData = {
      firstName: 'UpdatedName',
      lastName: 'UpdatedLast',
      email: existing.email,
      password: '',
    };

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateUser', { id: user.id }),
      cookies,
      payload: { data: newData },
    });

    expect(response.statusCode).toBe(302);

    const updatedUser = await models.user.query().findById(user.id);
    expect(updatedUser).toMatchObject({
      firstName: 'UpdatedName',
      lastName: 'UpdatedLast',
      email: existing.email,
    });
  });

  it('fail to update another user', async () => {
    const params = testData.users.another;
    const updateData = {
      email: 'updated@example.com',
      password: 'newpassword',
      firstName: 'UpdatedFirst',
      lastName: 'UpdatedLast',
    };

    const loginResponse = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: params },
    });
    expect(loginResponse.statusCode).toBe(302);

    const [sessionCookie] = loginResponse.cookies;
    const cookies = { [sessionCookie.name]: sessionCookie.value };

    const targetUser = await models.user.query().findOne({ email: testData.users.existing.email });
    expect(targetUser).not.toBeNull();

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateUser', { id: targetUser.id }),
      cookies,
      payload: { data: updateData },
    });

    expect(response.statusCode).toBe(302);

    const untouchedUser = await models.user.query().findById(targetUser.id);
    expect(untouchedUser.email).toBe(targetUser.email);
  });

  it('delete user (self)', async () => {
    const params = testData.users.existing;

    const loginResponse = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: params },
    });
    expect(loginResponse.statusCode).toBe(302);

    const [sessionCookie] = loginResponse.cookies;
    const cookies = { [sessionCookie.name]: sessionCookie.value };

    const user = await models.user.query().findOne({ email: params.email });
    expect(user).not.toBeNull();

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteUser', { id: user.id }),
      cookies,
    });

    expect(deleteResponse.statusCode).toBe(302);

    const deletedUser = await models.user.query().findById(user.id);
    expect(deletedUser).toBeUndefined();
  });

  it('fail to delete another user', async () => {
    const anotherUser = testData.users.another;
    const targetUser = testData.users.existing;

    const loginResponse = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: anotherUser },
    });
    expect(loginResponse.statusCode).toBe(302);

    const [sessionCookie] = loginResponse.cookies;
    const cookies = { [sessionCookie.name]: sessionCookie.value };

    const user = await models.user.query().findOne({ email: targetUser.email });
    expect(user).not.toBeNull();

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteUser', { id: user.id }),
      cookies,
    });

    expect(deleteResponse.statusCode).toBe(302);

    const stillExists = await models.user.query().findById(user.id);
    expect(stillExists).not.toBeUndefined();
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await app.close();
  });
});
