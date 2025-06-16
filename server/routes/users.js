// @ts-check
import i18next from 'i18next';
import { encrypt } from '../lib/secure.js';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      return reply.render('users/index', { users });
    })

    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      return reply.render('users/new', { user });
    })

    .get('/users/:id/edit', { name: 'editUser' }, async (req, reply) => {
      const { id } = req.params;

      if (!req.user || req.user.id !== Number(id)) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        return reply.redirect(app.reverse('users'));
      }

      const user = await app.objection.models.user.query().findById(id);
      return reply.render('users/edit', { user });
    })

    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        console.log('Redirecting to root after successful registration');
        return reply.redirect(app.reverse('root'));
      } catch (error) {
        console.error('Registration error:', error);
        const errors = error.data || error.details || error;
        const flash = { error: [i18next.t('flash.users.create.error')] };
        return reply.render('users/new', { user, errors, flash });
      }
    })

    .patch('/users/:id', { name: 'updateUser' }, async (req, reply) => {
      const { id } = req.params;

      if (!req.user || req.user.id !== Number(id)) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        return reply.redirect(app.reverse('root'));
      }

      try {
        const patchData = { ...req.body.data };
        if (patchData.password) {
          patchData.passwordDigest = encrypt(patchData.password);
          delete patchData.password;
        }

        const user = await app.objection.models.user.query().findById(id);
        await user.$query().patchAndFetch(patchData);

        req.flash('info', i18next.t('flash.users.update.success'));
        return reply.redirect(app.reverse('users'));
      } catch (error) {
        const user = await app.objection.models.user.query().findById(id);
        const errors = error.data || error;
        const flash = { error: [i18next.t('flash.users.update.error')] };
        return reply.render('users/edit', { user, errors, flash });
      }
    })

    .delete('/users/:id', { name: 'deleteUser' }, async (req, reply) => {
      const { id } = req.params;
      const targetUserId = Number(id);
      const currentUserId = req.user?.id;

      if (!currentUserId) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        return reply.redirect(app.reverse('root'));
      }

      if (currentUserId !== targetUserId) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        return reply.redirect(app.reverse('users'));
      }

      try {
        await app.objection.models.user.query().deleteById(targetUserId);
        req.flash('info', i18next.t('flash.users.delete.success'));
        req.logout();
        return reply.redirect(app.reverse('users'));
      } catch (error) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        return reply.redirect(app.reverse('users'));
      }
    });
};
