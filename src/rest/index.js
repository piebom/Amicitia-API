const Router = require('@koa/router');
const installUserRouter = require('./_user');
const installPostRouter = require('./_post');
module.exports = (app) => {
    const router = new Router({
        prefix: '/api',
    });
    installUserRouter(router);
    installPostRouter(router);
    app.use(router.routes()).use(router.allowedMethods());
};