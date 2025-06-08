export default (app) => async function authGuard(req, reply) {
  if (!req.isAuthenticated()) {
    req.flash('error', req.t('flash.authError'));
    reply.redirect(app.reverse('root'));
  }
};
