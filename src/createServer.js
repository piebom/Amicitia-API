const Router = require('@koa/router');
const Koa = require('koa');
const koaCors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const { getLogger } = require('./core/logging');
const installRoutes = require('./routes');
const config = require('config');
const NODE_ENV = config.get('env');
const CORS_ORIGINS = config.get('cors.origins');
const CORS_MAX_AGE = config.get('cors.maxAge');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');

module.exports = async function createServer (){
  const app = new Koa();
	app.use(
		koaCors({
			origin: (ctx) => {
				if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
					return ctx.request.header.origin;
				}
				// Not a valid domain at this point, let's return the first valid as we should return a string
				return CORS_ORIGINS[0];
			},
			allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
			maxAge: CORS_MAX_AGE,
		})
	);
  const logger = getLogger();
  app.use(bodyParser());
  installRoutes(app);
  return {
    getApp(){
      return app;
    },
    start(){
      return new Promise((resolve) => {
        app.listen(3001);
        logger.info(`🚀 Server listening on http://localhost:3001`)
        resolve()
      })
    },
    async stop(){
      app.removeAllListeners();
      await shutdownData();
      logger.info('Goodbye');
    }
  }
}