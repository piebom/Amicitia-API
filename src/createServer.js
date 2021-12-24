const Router = require('@koa/router');
const Koa = require('koa');
const koaCors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const { getLogger, initializeLogger } = require('./core/logging');
const installRoutes = require('./routes');
const NODE_ENV = "NODE_ENV";
const CORS_ORIGINS = ['*'];
const CORS_MAX_AGE = 3 * 60 * 60;
const LOG_LEVEL = 'silly';
const LOG_DISABLED = false;
const tokenAuthMiddleware = require("./middlewares/tokenAuth");
const { emoji } = require('node-emoji');
module.exports = async function createServer (){
  initializeLogger({
		level: LOG_LEVEL,
		disabled: LOG_DISABLED,
		isProduction: NODE_ENV === 'production',
		defaultMeta: { NODE_ENV },
	});
  var corsOptions = {
    origin: '*'
  };
  const app = new Koa();
  const logger = getLogger();
	app.use(
		koaCors(corsOptions)
	);
  app.use(async (ctx,next) => {
    const logger = getLogger();
    logger.info(`${emoji.fast_forward} ${ctx.method} ${ctx.url}`);

    const getStatusEmoji = () => {
      if (ctx.status >= 500) return emoji.skull;
      if (ctx.status >= 400) return emoji.x;
      if (ctx.status >= 300) return emoji.rocket;
      if (ctx.status >= 200) return emoji.white_check_mark;
      return emoji.get('rewind');
    }

    try{
      await next();
      logger.info(`${getStatusEmoji()} ${ctx.method} ${ctx.status} ${ctx.url}`)
    }catch (error) {
      logger.error(`${getStatusEmoji()} ${ctx.method} ${ctx.status} ${ctx.url}`);
      throw error;
    }
  });

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