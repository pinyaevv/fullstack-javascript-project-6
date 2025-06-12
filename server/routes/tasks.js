import fp from 'fastify-plugin';
import Task from '../models/Task.js';

async function taskRoutes(app) {
  function authGuard(req, reply, done) {
    if (!req.isAuthenticated()) {
      req.flash('error', app.i18n.t('auth.required'));
      return reply.redirect('/session/new');
    }
    return done();
  }

  // GET /tasks - список задач
  app.get('/tasks', { name: 'tasks' }, async (req, reply) => {
    const tasks = await Task.query().withGraphFetched('[status, creator, executor]');
    return reply.render('tasks/index', { tasks });
  });

  // GET /tasks/new - форма создания
  app.get('/tasks/new', { preHandler: authGuard, name: 'tasks.new' }, async (req, reply) => {
    const statuses = await app.objection.models.taskStatus.query();
    const users = await app.objection.models.user.query();
    return reply.render('tasks/new', { statuses, users });
  });

  // POST /tasks - создание
  app.post('/tasks', { preHandler: authGuard, name: 'tasks.create' }, async (req, reply) => {
    try {
      const { data } = req.body;
      data.creatorId = req.user.id;
      data.statusId = Number(data.statusId);
      console.log('🛠️ Данные для вставки задачи:', data);
      await Task.query().insert(data);
      req.flash('info', app.i18n.t('tasks.created'));
      return reply.redirect('/tasks');
    } catch (e) {
      console.error('💥 Ошибка при создании задачи:', e);
      req.flash('error', app.i18n.t('tasks.error'));
      return reply.redirect('/tasks/new');
    }
  });

  // GET /tasks/:id - просмотр
  app.get('/tasks/:id', { name: 'tasks.show' }, async (req, reply) => {
    const task = await Task.query()
      .findById(req.params.id)
      .withGraphFetched('[status, creator, executor]');
    if (!task) {
      return reply.code(404).send();
    }
    return reply.render('tasks/show', { task });
  });

  // GET /tasks/:id/edit - форма редактирования
  app.get('/tasks/:id/edit', { preHandler: authGuard, name: 'tasks.edit' }, async (req, reply) => {
    const task = await Task.query().findById(req.params.id);
    if (!task) {
      return reply.code(404).send();
    }
    const statuses = await app.objection.models.taskStatus.query();
    const users = await app.objection.models.user.query();
    return reply.render('tasks/edit', { task, statuses, users });
  });

  // PATCH /tasks/:id - обновление
  app.patch('/tasks/:id', { preHandler: authGuard, name: 'tasks.update' }, async (req, reply) => {
    try {
      const task = await Task.query().findById(req.params.id);
      if (!task) {
        return reply.code(404).send();
      }
      if (task.creatorId !== req.user.id) {
        req.flash('error', app.i18n.t('tasks.updateDenied'));
        return reply.redirect('/tasks');
      }
      await Task.query().patchAndFetchById(req.params.id, req.body.data);
      req.flash('info', app.i18n.t('tasks.updated'));
      return reply.redirect('/tasks');
    } catch (e) {
      req.flash('error', app.i18n.t('tasks.error'));
      return reply.redirect(`/tasks/${req.params.id}/edit`);
    }
  });

  // DELETE /tasks/:id - удаление (только создатель)
  app.delete('/tasks/:id', { preHandler: authGuard, name: 'tasks.delete' }, async (req, reply) => {
    try {
      const task = await Task.query().findById(req.params.id);
      if (!task) {
        return reply.code(404).send();
      }
      if (task.creatorId !== req.user.id) {
        req.flash('error', app.i18n.t('tasks.deleteDenied'));
        return reply.redirect('/tasks');
      }
      await Task.query().deleteById(req.params.id);
      req.flash('info', app.i18n.t('tasks.deleted'));
      return reply.redirect('/tasks');
    } catch (e) {
      req.flash('error', app.i18n.t('tasks.error'));
      return reply.redirect('/tasks');
    }
  });
}

export default fp(taskRoutes);
