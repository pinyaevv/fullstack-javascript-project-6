// @ts-check

import fastify from 'fastify';
import init from '../server/plugin.js';
import prepareData from '../test-helpers/helpers/index.js';
import { buildUserWithPassword } from '../test-helpers/factories/userFactory.js';

describe('test session', () => {
  let app;
  /** @type {import('knex').Knex} */
  let knex;
  let user;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: false,
    });

    await init(app);
    knex = /** @type {import('knex').Knex} */ (app.objection.knex);
    await knex.migrate.latest();

    const { plain, hashed } = buildUserWithPassword();
    user = plain;

    await prepareData(app, { users: [{ plain, hashed }] });
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
