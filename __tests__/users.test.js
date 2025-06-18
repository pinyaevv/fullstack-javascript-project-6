// @ts-check

import _ from 'lodash';
import fastify from 'fastify';

import init from '../server/plugin.js';
import { verify } from '../server/lib/secure.js';
import prepareData from './helpers/index.js';
import { buildUser } from './factories/userFactory.js';

describe('test users CRUD', () => {
  let app;
  /** @type {import('knex').Knex} */
  let knex;
  let models;
  let testUsers;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: false,
    });

    await init(app);

    knex = /** @type {import('knex').Knex} */ (app.objection.knex);
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
    const params = buildUser();

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: { data: params },
    });

    expect(response.statusCode).toBe(302);

    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(_.omit(params, 'password'));
    expect(verify(params.password, user.passwordDigest)).toBe(true);
  });

  it('update user (self)', async () => {
    const existing = testUsers[0];

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
    };

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateUser', { id: user.id }),
      cookies,
      payload: { data: newData },
    });

    expect(response.statusCode).toBe(302);

    const updatedUser = await models.user.query().findById(user.id);
    expect(updatedUser).toMatchObject(newData);
  });

  it('fail to update another user', async () => {
    const [existing, another] = testUsers;
    const updateData = {
      email: 'updated@example.com',
      password: 'newpassword',
      firstName: 'UpdatedFirst',
      lastName: 'UpdatedLast',
    };

    const loginResponse = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: another },
    });
    expect(loginResponse.statusCode).toBe(302);

    const [sessionCookie] = loginResponse.cookies;
    const cookies = { [sessionCookie.name]: sessionCookie.value };

    const targetUser = await models.user.query().findOne({ email: existing.email });
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
    const existing = testUsers[0];

    const loginResponse = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: existing },
    });
    expect(loginResponse.statusCode).toBe(302);

    const [sessionCookie] = loginResponse.cookies;
    const cookies = { [sessionCookie.name]: sessionCookie.value };

    const user = await models.user.query().findOne({ email: existing.email });

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
    const [existing, another] = testUsers;

    const loginResponse = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: another },
    });
    expect(loginResponse.statusCode).toBe(302);

    const [sessionCookie] = loginResponse.cookies;
    const cookies = { [sessionCookie.name]: sessionCookie.value };

    const user = await models.user.query().findOne({ email: existing.email });

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteUser', { id: user.id }),
      cookies,
    });

    expect(deleteResponse.statusCode).toBe(302);

    const stillExists = await models.user.query().findById(user.id);
    expect(stillExists).not.toBeUndefined();
  });
});
