// @ts-check

export default (app) => {
  if (app.hasRoute('GET', '/')) return;

  app
    .get('/', { name: 'root' }, (req, reply) => {
      reply.render('welcome/index');
    })
    .get('/protected', { name: 'protected', preValidation: app.authenticate }, (req, reply) => {
      reply.render('welcome/index');
    });
};
