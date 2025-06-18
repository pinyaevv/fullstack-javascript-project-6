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
    let testLabels;
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

        const data = await prepareData(app);
        testUsers = data.users;
        testStatuses = data.taskStatuses;
        testLabels = data.labels;

        testTasks = [];

        const task1 = await models.task.query().insertGraph({
            name: 'Frontend Task',
            description: 'Test desc 1',
            statusId: testStatuses[0].id,
            creatorId: testUsers[0].id,
            executorId: testUsers[1].id,
            labels: [{ id: testLabels[0].id }],
        }, { relate: true });

        const task2 = await models.task.query().insertGraph({
            name: 'Backend Task',
            description: 'Test desc 2',
            statusId: testStatuses[1].id,
            creatorId: testUsers[1].id,
            executorId: testUsers[0].id,
            labels: [{ id: testLabels[1].id }],
        }, { relate: true });

        testTasks.push(task1, task2);
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
            url: app.reverse('tasks.new'),
        });
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe(app.reverse('root'));
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
            url: app.reverse('tasks.new'),
            cookies,
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toContain('Создание задачи');
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
        expect(response.headers.location).toBe(app.reverse('root'));
    });

    it('GET /tasks/:id - просмотр задачи', async () => {
        const task = testTasks[0];

        const response = await app.inject({
            method: 'GET',
            url: app.reverse('tasks.show', { id: task.id }),
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toContain(task.name);
    });

    it('GET /tasks/:id/edit - редирект для неавторизованных', async () => {
        const task = testTasks[0];

        const response = await app.inject({
            method: 'GET',
            url: app.reverse('tasks.edit', { id: task.id }),
        });
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe(app.reverse('root'));
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
            url: app.reverse('tasks.edit', { id: task.id }),
            cookies,
        });
        expect(response.statusCode).toBe(200);
        expect(response.body).toContain(task.name);
    });

    it('PATCH /tasks/:id - обновление создателем', async () => {
        const user = testUsers[0];
        const task = testTasks[0];

        const newData = {
            name: 'Updated Task Name',
            description: task.description,
            statusId: task.statusId,
            executorId: task.executorId,
            labelIds: [],
        };

        const loginRes = await app.inject({
            method: 'POST',
            url: app.reverse('session'),
            payload: { data: user },
        });
        const [sessionCookie] = loginRes.cookies;
        const cookies = { [sessionCookie.name]: sessionCookie.value };

        const response = await app.inject({
            method: 'PATCH',
            url: app.reverse('tasks.update', { id: task.id }),
            payload: { data: newData },
            cookies,
        });
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe(app.reverse('tasks'));

        const updated = await models.task.query().findById(task.id);
        expect(updated.name).toBe(newData.name);
    });

    it('PATCH /tasks/:id - отказ в обновлении не-создателем', async () => {
        const [anotherUser] = testUsers;
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
            url: app.reverse('tasks.update', { id: task.id }),
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
            url: app.reverse('tasks.delete', { id: task.id }),
            cookies,
        });
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe(app.reverse('tasks'));

        const deleted = await models.task.query().findById(task.id);
        expect(deleted).toBeUndefined();
    });

    it('DELETE /tasks/:id - отказ не-создателю', async () => {
        const [, anotherUser] = testUsers;
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
            url: app.reverse('tasks.delete', { id: task.id }),
            cookies,
        });
        expect(response.statusCode).toBe(302);

        const notDeleted = await models.task.query().findById(task.id);
        expect(notDeleted).not.toBeUndefined();
    });

    it('filters by status', async () => {
        const status = testStatuses[0];

        const response = await app.inject({
            method: 'GET',
            url: `${app.reverse('tasks')}?statusId=${status.id}`,
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toContain('Frontend Task');
        expect(response.body).not.toContain('Backend Task');
    });

    it('filters by executor', async () => {
        const executor = testUsers[1];

        const response = await app.inject({
            method: 'GET',
            url: `${app.reverse('tasks')}?executorId=${executor.id}`,
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toContain('Frontend Task');
        expect(response.body).not.toContain('Backend Task');
    });

    it('filters by label', async () => {
        const label = testLabels[1];

        const response = await app.inject({
            method: 'GET',
            url: `${app.reverse('tasks')}?labelId=${label.id}`,
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toContain('Backend Task');
        expect(response.body).not.toContain('Frontend Task');
    });

    it('filters by current user as author', async () => {
        const loginRes = await app.inject({
            method: 'POST',
            url: app.reverse('session'),
            payload: { data: testUsers[0] },
        });
        const [cookie] = loginRes.cookies;
        const cookies = { [cookie.name]: cookie.value };

        const response = await app.inject({
            method: 'GET',
            url: `${app.reverse('tasks')}?isCreatorUser=on`,
            cookies,
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toContain('Frontend Task');
        expect(response.body).not.toContain('Backend Task');
    });
});
