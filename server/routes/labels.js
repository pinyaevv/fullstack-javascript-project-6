import Label from '../models/Label.js';

export default async (app) => {
    app
        .get('/labels', { name: 'labels' }, async (req, reply) => {
            const labels = await Label.query();
            return reply.render('labels/index.pug', { labels });
        })

        .get('/labels/new', { name: 'newLabel' }, async (req, reply) => {
            const label = new Label();
            return reply.render('labels/new.pug', { label, errors: {} });
        })

        .post('/labels', async (req, reply) => {
            try {
                await Label.query().insert(req.body.data);
                await req.flash('success', req.t('flash.labels.create.success'));
                return reply.redirect(app.reverse('labels'));
            } catch (e) {
                const errors = e.data || {};
                const label = new Label();
                label.$set(req.body.data);
                const flash = { error: [req.t('flash.labels.create.error')] };
                return reply.code(422).render('labels/new.pug', { label, errors, flash });
            }
        })

        .get('/labels/:id/edit', { name: 'editLabel' }, async (req, reply) => {
            const label = await Label.query().findById(req.params.id);
            return reply.render('labels/edit.pug', { label, errors: {} });
        })

        .patch('/labels/:id', { name: 'labels.update' }, async (req, reply) => {
            const label = await Label.query().findById(req.params.id);

            try {
                await label.$query().patch(req.body.data);
                req.flash('info', req.t('flash.labels.update.success'));
                return reply.redirect(app.reverse('labels'));
            } catch (e) {
                req.flash('error', req.t('flash.labels.update.error'));
                return reply.code(422).render('labels/edit.pug', { label, errors: e.data });
            }
        })

        .delete('/labels/:id', { name: 'labels.delete' }, async (req, reply) => {
            const label = await Label.query().findById(req.params.id)
                .withGraphFetched('tasks');

            if (label.tasks.length > 0) {
                req.flash('error', req.t('flash.labels.delete.error'));
                return reply.redirect(app.reverse('labels'));
            }

            await label.$query().delete();
            req.flash('info', req.t('flash.labels.delete.success'));
            return reply.redirect(app.reverse('labels'));
        });
};
