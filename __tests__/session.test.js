// @ts-check

import fastify from 'fastify';
import { jest } from '@jest/globals';
import init from '../server/plugin.js';
import prepareData from './helpers/index.js';
import { buildUser } from './factories/userFactory.js';

jest.setTimeout(30000);

describe('test session', () => {
  let app;
  let knex;
  let user;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: false,
    });

    await init(app);
    knex = app.objection.knex;

    await knex.migrate.latest();

    user = await buildUser(app);

    await prepareData(app, { users: [user] });
  });

  it('test sign in / sign out', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newSession'),
    });
    expect(response.statusCode).toBe(200);

    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: {
          email: user.email,
          password: user.password,
        },
      },
    });

    expect(responseSignIn.statusCode).toBe(302);

    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    const cookie = { [name]: value };

    const responseSignOut = await app.inject({
      method: 'DELETE',
      url: app.reverse('session'),
      cookies: cookie,
    });

    expect(responseSignOut.statusCode).toBe(302);
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await app.close();
  });
});
