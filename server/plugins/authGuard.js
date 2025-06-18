const buildAuthGuard = (app) => async function authGuard(req, reply) {
  if (!req.isAuthenticated()) {
    req.flash('error', req.t('flash.authError'));
    return reply.redirect(app.reverse('root'));
  }

  return null;
};

export default buildAuthGuard;
