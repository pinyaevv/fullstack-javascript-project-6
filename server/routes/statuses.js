import i18next from 'i18next';
import buildAuthGuard from '../plugins/authGuard.js';

export default (app) => {
  const authGuard = buildAuthGuard(app);

  app.get('/statuses', {
    name: 'statuses',
  }, async (req, reply) => {
    const statuses = await app.objection.models.taskStatus.query();
    return reply.render('statuses/index', { statuses });
  });

  app.get('/statuses/new', {
    name: 'statuses.new',
    preHandler: authGuard,
  }, async (req, reply) => reply.render('statuses/new'));

  app.get('/statuses/:id/edit', {
    name: 'statuses.edit',
    preHandler: authGuard,
  }, async (req, reply) => {
    const { id } = req.params;
    const status = await app.objection.models.taskStatus.query().findById(id);
    if (!status) {
      req.flash('error', i18next.t('flash.statuses.edit.notFound'));
      return reply.redirect(app.reverse('statuses'));
    }
    return reply.render('statuses/edit', { status });
  });

  app.post('/statuses', {
    name: 'statuses.create',
    preHandler: authGuard,
  }, async (req, reply) => {
    try {
      await app.objection.models.taskStatus.query().insert(req.body.data);
      req.flash('success', i18next.t('flash.statuses.create.success'));
      return reply.redirect(app.reverse('statuses'));
    } catch (e) {
      req.flash('error', i18next.t('flash.statuses.create.error'));
      return reply.render('statuses/new', { status: req.body.data, errors: e.data });
    }
  });

  app.patch('/statuses/:id', {
    name: 'statuses.update',
    preHandler: authGuard,
  }, async (req, reply) => {
    const { id } = req.params;
    try {
      await app.objection.models.taskStatus.query().patchAndFetchById(id, req.body.data);
      req.flash('success', i18next.t('flash.statuses.update.success'));
      return reply.redirect(app.reverse('statuses'));
    } catch (e) {
      req.flash('error', i18next.t('flash.statuses.update.error'));
      const status = await app.objection.models.taskStatus.query().findById(id);
      return reply.render('statuses/edit', { status, errors: e.data });
    }
  });

  app.delete('/statuses/:id', {
    name: 'statuses.delete',
    preHandler: authGuard,
  }, async (req, reply) => {
    const { id } = req.params;
    try {
      await app.objection.models.taskStatus.query().deleteById(id);
      req.flash('success', i18next.t('flash.statuses.delete.success'));
    } catch (e) {
      req.flash('error', i18next.t('flash.statuses.delete.error'));
    }
    return reply.redirect(app.reverse('statuses'));
  });
};
