import fp from 'fastify-plugin';
import Task from '../models/Task.js';
import buildAuthGuard from '../plugins/authGuard.js';

async function taskRoutes(app) {
  const authGuard = buildAuthGuard(app);

  app.get('/tasks', { name: 'tasks' }, async (req, reply) => {
    const {
      statusId, executorId, labelId, isCreatorUser,
    } = req.query;
    const userId = req.user?.id;

    const filterIsCreatorUser = isCreatorUser === 'on' || isCreatorUser === true;

    const filterValues = {
      statusId: statusId || '',
      executorId: executorId || '',
      labelId: labelId || '',
      isCreatorUser: filterIsCreatorUser,
    };

    let query = Task.query().withGraphJoined('[status, creator, executor, labels]');

    if (statusId) {
      query = query.where('statusId', statusId);
    }

    if (executorId) {
      query = query.where('executorId', executorId);
    }

    if (labelId) {
      query = query.whereExists(
        Task.relatedQuery('labels').where('labels.id', labelId),
      );
    }

    if (filterIsCreatorUser && userId) {
      query = query.where('creatorId', userId);
    }

    const tasks = await query;

    const statuses = await app.objection.models.taskStatus.query();
    const users = await app.objection.models.user.query();
    const labels = await app.objection.models.label.query();

    return reply.render('tasks/index', {
      tasks,
      statuses,
      users,
      labels,
      filterValues,
    });
  });

  app.get('/tasks/new', { preHandler: authGuard, name: 'tasks.new' }, async (req, reply) => {
    const task = {};
    const statuses = await app.objection.models.taskStatus.query();
    const users = await app.objection.models.user.query();
    const labels = await app.objection.models.label.query();
    return reply.render('tasks/new', {
      task, statuses, users, labels, errors: {}, labelIds: [],
    });
  });

  app.post('/tasks', { preHandler: authGuard, name: 'tasks.create' }, async (req, reply) => {
    try {
      const { data } = req.body;
      data.creatorId = req.user.id;
      data.statusId = Number(data.statusId);
      data.executorId = Number(data.executorId);
      let labelIds = [];

      if (Array.isArray(data.labelIds)) {
        labelIds = data.labelIds.map(Number);
      } else if (data.labelIds) {
        labelIds = [Number(data.labelIds)];
      }

      const task = await Task.query().insert(data);
      if (labelIds.length > 0) {
        await task.$relatedQuery('labels').relate(labelIds);
      }

      req.flash('info', app.i18n.t('flash.tasks.created'));
      return reply.redirect('/tasks');
    } catch (e) {
      req.flash('error', app.i18n.t('flash.tasks.error'));
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
    const task = await Task.query().findById(req.params.id).withGraphFetched('labels');

    if (!task) {
      return reply.code(404).send();
    }

    const statuses = await app.objection.models.taskStatus.query();
    const users = await app.objection.models.user.query();
    const labels = await app.objection.models.label.query();
    const labelIds = task.labels.map((label) => label.id);

    return reply.render('tasks/edit', {
      task, statuses, users, labels, labelIds, errors: {},
    });
  });

  app.patch('/tasks/:id', { preHandler: authGuard, name: 'tasks.update' }, async (req, reply) => {
    try {
      const task = await Task.query().findById(req.params.id);
      if (!task) {
        return reply.code(404).send();
      }
      if (task.creatorId !== req.user.id) {
        req.flash('error', app.i18n.t('flash.tasks.updateDenied'));
        return reply.redirect('/tasks');
      }

      const {
        name, description, statusId, executorId, labelIds,
      } = req.body.data;

      const updatedTask = await Task.query().patchAndFetchById(req.params.id, {
        name,
        description,
        statusId: Number(statusId),
        executorId: executorId ? Number(executorId) : null,
      });

      let normalizedLabelIds = [];

      if (Array.isArray(labelIds)) {
        normalizedLabelIds = labelIds.map(Number);
      } else if (labelIds) {
        normalizedLabelIds = [Number(labelIds)];
      }

      await updatedTask.$relatedQuery('labels').unrelate();
      if (normalizedLabelIds.length > 0) {
        await updatedTask.$relatedQuery('labels').relate(normalizedLabelIds);
      }

      req.flash('info', app.i18n.t('flash.tasks.updated'));
      return reply.redirect('/tasks');
    } catch (e) {
      req.flash('error', app.i18n.t('flash.tasks.error'));
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
        req.flash('error', app.i18n.t('flash.tasks.deleteDenied'));
        return reply.redirect('/tasks');
      }
      await Task.query().deleteById(req.params.id);
      req.flash('info', app.i18n.t('flash.tasks.deleted'));
      return reply.redirect('/tasks');
    } catch (e) {
      req.flash('error', app.i18n.t('flash.tasks.error'));
      return reply.redirect('/tasks');
    }
  });
}

export default fp(taskRoutes);
