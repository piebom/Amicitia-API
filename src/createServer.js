const Router = require('@koa/router');
const Koa = require('koa');
const koaCors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const { getLogger } = require('./core/logging');
const installRoutes = require('./routes');
const NODE_ENV = "NODE_ENV";
const CORS_ORIGINS = ['*'];
const CORS_MAX_AGE = 3 * 60 * 60;
const LOG_LEVEL = 'silly';
const LOG_DISABLED = false;
const tokenAuthMiddleware = require("./middlewares/tokenAuth");
module.exports = async function createServer (){
  const app = new Koa();
	app.use(
		koaCors()
	);
  const logger = getLogger();
  app.use(bodyParser());
  app.use(tokenAuthMiddleware);
  installRoutes(app);
  return {
    getApp(){
      return app;
    },
    start(){
      return new Promise((resolve) => {
        app.listen(process.env.PORT || 5000);
        logger.info(`🚀 Server listening on http://localhost:3001`)
        resolve()
      })
    },
    async stop(){
      app.removeAllListeners();
      logger.info('Goodbye');
    }
  }
}