// @ts-check

export default (app) => {
    console.log('Registering route GET / with name root');
    app
        .get('/', { name: 'root' }, (req, reply) => {
            reply.render('welcome/index');
        })
        .get('/protected', { name: 'protected', preValidation: app.authenticate }, (req, reply) => {
            reply.render('welcome/index');
        });
};
