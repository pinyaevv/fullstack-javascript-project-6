// @ts-check

export default (app) => {
  app
    .get('/session/new', { name: 'newSession' }, (req, reply) => {
      console.log('req.t exists?', typeof req.t === 'function');
      const signInForm = {};
      return reply.render('session/new', { signInForm });
    })
    .post('/session', { name: 'session' }, app.fp.authenticate('form', async (req, reply, err, user) => {
      if (err) {
        return app.httpErrors.internalServerError(err);
      }
      if (!user) {
        const signInForm = req.body.data;
        const errors = {
          email: [{ message: req.t('flash.session.create.error') }],
        };
        return reply.render('session/new', { signInForm, errors });
      }
      await req.logIn(user);
      req.flash('success', req.t('flash.session.create.success'));
      return reply.redirect(app.reverse('root'));
    }))
    .delete('/session', { name: 'deleteSession' }, (req, reply) => {
      req.logOut();
      req.flash('info', req.t('flash.session.delete.success'));
      return reply.redirect(app.reverse('root'));
    });
};
