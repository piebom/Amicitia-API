const config = require('config');
const KoaCors = require('@koa/cors');
const {getLogger} = require('./core/logging');
const bodyParser = require('koa-bodyparser');
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const favoriteRoutes = require("./routes/favorites");
const activitiesRoutes = require("./routes/activities");
const resettokenRoutes = require("./routes/resettoken")
const tokenAuthMiddleware = require("./middlewares/tokenAuth");
const CORS_MAX_AGE = config.get('cors.maxAge');
const Koa = require('koa');
const app = new Koa();
const logger = getLogger();

app
	.use(bodyParser())
	.use(KoaCors({
		origin: '*',
		allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
		maxAge: CORS_MAX_AGE,
	}
	))
	.use(tokenAuthMiddleware)
	.use(authRoutes.middleware())
	.use(favoriteRoutes.middleware())
	.use(activitiesRoutes.middleware())
	.use(userRoutes.middleware())
	.use(resettokenRoutes.middleware());

app.listen(3001);

logger.info('Server listening on https://localhost:3001')