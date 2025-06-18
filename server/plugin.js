// @ts-check

import { fileURLToPath } from 'url';
import path from 'path';
import fastifyStatic from '@fastify/static';
// NOTE: не поддердивает fastify 4.x
// import fastifyErrorPage from 'fastify-error-page';
import fastifyView from '@fastify/view';
import fastifyFormbody from '@fastify/formbody';
import fastifySecureSession from '@fastify/secure-session';
import FastifyPassport from '@fastify/passport';
import fastifySensible from '@fastify/sensible';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';
import fastifyMethodOverride from 'fastify-method-override';
import fastifyObjectionjs from 'fastify-objectionjs';
import qs from 'qs';
import Pug from 'pug';
import i18next from 'i18next';
import dayjs from 'dayjs';

import ru from './locales/ru.js';
import en from './locales/en.js';
// @ts-ignore
import addRoutes from './routes/index.js';
import getHelpers from './helpers/index.js';
import knexConfig from '../knexfile.js';
import models from './models/index.js';
import FormStrategy from './lib/passportStrategies/FormStrategy.js';
import rollbar from './lib/rollbar.js';

const __dirname = fileURLToPath(path.dirname(import.meta.url));

const mode = process.env.NODE_ENV || 'development';
// const isDevelopment = mode === 'development';

const setUpViews = (app) => {
    const helpers = getHelpers(app);
    app.register(fastifyView, {
        engine: {
            pug: Pug,
        },
        includeViewExtension: true,
        defaultContext: {
            ...helpers,
            assetPath: (filename) => `/assets/${filename}`,
            t: i18next.t,
        },
        templates: path.join(__dirname, '..', 'server', 'views'),
    });

    app.decorateReply('render', function render(viewPath, locals = {}) {
        return this.view(viewPath, { ...this.locals, ...locals, reply: this });
    });
};

const setUpStaticAssets = (app) => {
    const pathPublic = path.join(__dirname, '..', 'static');
    app.register(fastifyStatic, {
        root: pathPublic,
        prefix: '/assets/',
        decorateReply: false,
    });
};

const setupLocalization = async (app) => {
    await i18next
        .init({
            lng: 'ru',
            fallbackLng: 'en',
            // debug: isDevelopment,
            resources: {
                ru,
                en,
            },
        });
    app.decorate('i18n', i18next);
};

const addHooks = (app) => {
    app.addHook('preHandler', async (req, reply) => {
        const flash = req.session.get('flash') || {};

        const defaultLocals = {
            t: req.t || i18next.t,
            route: app.reverse.bind(app),
            isAuthenticated: () => req.isAuthenticated(),
            flash,
            getAlertClass: (type) => {
                switch (type) {
                case 'error': return 'alert-danger';
                case 'info': return 'alert-info';
                case 'warning': return 'alert-warning';
                case 'success': return 'alert-success';
                default: return 'alert-secondary';
                }
            },
            formatDate: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
        };

        const originalRender = reply.render.bind(reply);

        reply.render = (template, data = {}) => {
            return originalRender(template, { ...defaultLocals, ...data });
        };

        await req.session.set('flash', {});

        req.flash = async (type, message) => {
            const current = req.session.get('flash') || {};
            if (!current[type]) current[type] = [];
            current[type].push(message);
            await req.session.set('flash', current);
        };
    });
};

const registerPlugins = async (app) => {
    await app.register(fastifySensible);
    // await app.register(fastifyErrorPage);
    await app.register(fastifyReverseRoutes);
    await app.register(fastifyFormbody, { parser: qs.parse });
    const helmet = (await import('@fastify/helmet')).default;
    await app.register(helmet);

    const cors = (await import('@fastify/cors')).default;
    await app.register(cors, {
        origin: process.env.APP_URL || '*',
    });
    await app.register(fastifySecureSession, {
        secret: process.env.SESSION_KEY,
        cookie: {
            path: '/',
            secure: false,
        },
    });

    const fastifyPassport = new FastifyPassport.Authenticator();

    fastifyPassport.registerUserDeserializer(
        (user) => app.objection.models.user.query().findById(user.id),
    );
    fastifyPassport.registerUserSerializer((user) => Promise.resolve(user));
    fastifyPassport.use(new FormStrategy('form', app));
    await app.register(fastifyPassport.initialize());
    await app.register(fastifyPassport.secureSession());
    await app.decorate('fp', fastifyPassport);
    app.decorate('authenticate', (...args) => fastifyPassport.authenticate(
        'form',
        {
            failureRedirect: app.reverse('root'),
            failureFlash: { message: i18next.t('flash.authError') },
        },
        // @ts-ignore
    )(...args));
    await app.register(fastifyMethodOverride);
    await app.register(fastifyObjectionjs, {
        knexConfig: knexConfig[mode],
        models,
    });
};

export const options = {
    exposeHeadRoutes: false,
};

// eslint-disable-next-line no-unused-vars
export default async (app, _options) => {
    await registerPlugins(app);

    await setupLocalization(app);
    setUpViews(app);
    setUpStaticAssets(app);
    app.decorateRequest('t', null);
    app.addHook('onRequest', async (req) => {
        req.t = i18next.t.bind(i18next);
    });
    addHooks(app);
    addRoutes(app);

    app.setErrorHandler((err, req, reply) => {
        if (process.env.NODE_ENV === 'production') {
            rollbar.error(err, req);
        } else {
            app.log.error(err);
        }

        reply.status(err.statusCode || 500).send({
            error: 'Internal Server Error',
        });
    });

    return app;
};
