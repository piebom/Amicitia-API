const Router = require('@koa/router');
const installUserRouter = require('./_user');
const installMatchRouter = require('./_match');
module.exports = (app) => {
    const router = new Router({
        prefix: '/api',
    });
    installUserRouter(router);
    installMatchRouter(router);
    app.use(router.routes()).use(router.allowedMethods());
};