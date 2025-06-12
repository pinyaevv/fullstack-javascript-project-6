// __tests__/tasks.test.js
import _ from 'lodash';
import fastify from 'fastify';

import init from '../server/plugin.js';
import prepareData from './helpers/index.js';

describe('test tasks CRUD', () => {
  let app;
  let knex;
  let models;
  let testUsers;
  let testStatuses;
  let testTasks;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: false,
    });
    await init(app);

    knex = app.objection.knex;
    models = app.objection.models;
  });

  beforeEach(async () => {
    await knex.migrate.rollback(undefined, true);
    await knex.migrate.latest();

    // Получаем пользователей и статусы из prepareData
    const data = await prepareData(app);
    testUsers = data.users;
    testStatuses = data.taskStatuses;

    // Создаём задачу через ORM напрямую
    testTasks = [];
    const task = await models.task.query().insert({
      name: 'Test task',
      description: 'Test description',
      statusId: testStatuses[0].id,
      creatorId: testUsers[0].id,
      executorId: testUsers[1]?.id || null,
    });
    testTasks.push(task);
  });

  afterAll(async () => {
    await knex.migrate.rollback(undefined, true);
    await app.close();
  });

  it('GET /tasks - список задач', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toContain(testTasks[0].name);
  });

  it('GET /tasks/new - редирект для неавторизованных', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
    });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(app.reverse('newSession'));
  });

  it('GET /tasks/new - доступ для авторизованных', async () => {
    const user = testUsers[0];

    const loginRes = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: user },
    });
    const [sessionCookie] = loginRes.cookies;
    const cookies = { [sessionCookie.name]: sessionCookie.value };

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toContain('Create task');
  });

  it('POST /tasks - создание задачи (авторизованный)', async () => {
    const user = testUsers[0];

    const loginRes = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: user },
    });
    const [sessionCookie] = loginRes.cookies;
    const cookies = { [sessionCookie.name]: sessionCookie.value };

    const taskData = {
      name: 'New Task Test',
      description: 'Description for new task',
      statusId: testStatuses[0].id,
      executorId: testUsers[1]?.id || null,
    };

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: { data: taskData },
      cookies,
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(app.reverse('tasks'));

    const created = await models.task.query().findOne({ name: taskData.name });
    expect(created).toMatchObject(_.omit(taskData, ['executorId']));
  });

  it('POST /tasks - редирект для неавторизованных', async () => {
    const taskData = {
      name: 'New Task Test Unauthorized',
      description: 'Description',
      statusId: testStatuses[0].id,
    };

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: { data: taskData },
    });

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(app.reverse('newSession'));
  });

  it('GET /tasks/:id - просмотр задачи', async () => {
    const task = testTasks[0];

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('task', { id: task.id }),
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toContain(task.name);
  });

  it('GET /tasks/:id/edit - редирект для неавторизованных', async () => {
    const task = testTasks[0];

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editTask', { id: task.id }),
    });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(app.reverse('newSession'));
  });

  it('GET /tasks/:id/edit - доступ для создателя задачи', async () => {
    const user = testUsers[0];
    const task = testTasks[0];

    const loginRes = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: user },
    });
    const [sessionCookie] = loginRes.cookies;
    const cookies = { [sessionCookie.name]: sessionCookie.value };

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editTask', { id: task.id }),
      cookies,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toContain(task.name);
  });

  it('PATCH /tasks/:id - обновление создателем', async () => {
    const user = testUsers[0];
    const task = testTasks[0];
    const newData = { name: 'Updated Task Name' };

    const loginRes = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: user },
    });
    const [sessionCookie] = loginRes.cookies;
    const cookies = { [sessionCookie.name]: sessionCookie.value };

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateTask', { id: task.id }),
      payload: { data: newData },
      cookies,
    });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(app.reverse('tasks'));

    const updated = await models.task.query().findById(task.id);
    expect(updated.name).toBe(newData.name);
  });

  it('PATCH /tasks/:id - отказ в обновлении не-создателем', async () => {
    const [creator, anotherUser] = testUsers;
    const task = testTasks[0];
    const newData = { name: 'Should Not Update' };

    const loginRes = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: anotherUser },
    });
    const [sessionCookie] = loginRes.cookies;
    const cookies = { [sessionCookie.name]: sessionCookie.value };

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('updateTask', { id: task.id }),
      payload: { data: newData },
      cookies,
    });
    expect(response.statusCode).toBe(302);

    const notUpdated = await models.task.query().findById(task.id);
    expect(notUpdated.name).not.toBe(newData.name);
  });

  it('DELETE /tasks/:id - удаление создателем', async () => {
    const user = testUsers[0];
    const task = testTasks[0];

    const loginRes = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: user },
    });
    const [sessionCookie] = loginRes.cookies;
    const cookies = { [sessionCookie.name]: sessionCookie.value };

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteTask', { id: task.id }),
      cookies,
    });
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe(app.reverse('tasks'));

    const deleted = await models.task.query().findById(task.id);
    expect(deleted).toBeUndefined();
  });

  it('DELETE /tasks/:id - отказ не-создателю', async () => {
    const [creator, anotherUser] = testUsers;
    const task = testTasks[0];

    const loginRes = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: { data: anotherUser },
    });
    const [sessionCookie] = loginRes.cookies;
    const cookies = { [sessionCookie.name]: sessionCookie.value };

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('deleteTask', { id: task.id }),
      cookies,
    });
    expect(response.statusCode).toBe(302);

    const notDeleted = await models.task.query().findById(task.id);
    expect(notDeleted).not.toBeUndefined();
  });
});
