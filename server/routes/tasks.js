import fp from 'fastify-plugin';
import Task from '../models/Task.js';
import buildAuthGuard from '../plugins/authGuard.js';

async function taskRoutes(app) {
  const authGuard = buildAuthGuard(app);

  app.get('/tasks', { name: 'tasks' }, async (req, reply) => {
    const tasks = await Task.query().withGraphFetched('[status, creator, executor]');
    return reply.render('tasks/index', { tasks });
  });

  app.get('/tasks/new', { preHandler: authGuard, name: 'tasks.new' }, async (req, reply) => {
    const task = {};
    const statuses = await app.objection.models.taskStatus.query();
    const users = await app.objection.models.user.query();
    return reply.render('tasks/new', {
      task, statuses, users, errors: {},
    });
  });

  app.post('/tasks', { preHandler: authGuard, name: 'tasks.create' }, async (req, reply) => {
    try {
      const { data } = req.body;
      data.creatorId = req.user.id;
      data.statusId = Number(data.statusId);
      data.executorId = Number(data.executorId);
      await Task.query().insert(data);
      req.flash('info', app.i18n.t('tasks.created'));
      return reply.redirect('/tasks');
    } catch (e) {
      req.flash('error', app.i18n.t('tasks.error'));
      return reply.redirect('/tasks/new');
    }
  });

  app.get('/tasks/:id', { name: 'tasks.show' }, async (req, reply) => {
    const task = await Task.query()
      .findById(req.params.id)
      .withGraphFetched('[status, creator, executor]');
    if (!task) {
      return reply.code(404).send();
    }
    return reply.render('tasks/show', { task });
  });

  app.get('/tasks/:id/edit', { preHandler: authGuard, name: 'tasks.edit' }, async (req, reply) => {
    const task = await Task.query().findById(req.params.id);
    if (!task) {
      return reply.code(404).send();
    }
    const statuses = await app.objection.models.taskStatus.query();
    const users = await app.objection.models.user.query();
    return reply.render('tasks/edit', {
      task, statuses, users, errors: {},
    });
  });

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
      const {
        name, description, statusId, executorId,
      } = req.body.data;

      await Task.query().patchAndFetchById(req.params.id, {
        name,
        description,
        statusId: Number(statusId),
        executorId: executorId ? Number(executorId) : null,
      });
      req.flash('info', app.i18n.t('tasks.updated'));
      return reply.redirect('/tasks');
    } catch (e) {
      req.flash('error', app.i18n.t('tasks.error'));
      return reply.redirect(`/tasks/${req.params.id}/edit`);
    }
  });

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
