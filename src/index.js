const Koa = require('koa');
const {getLogger} = require('./core/logging');
const bodyParser = require('koa-bodyparser');
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const tokenAuthMiddleware = require("./middlewares/tokenAuth");
const app = new Koa();
const logger = getLogger();

app
	.use(bodyParser())
	.use(authRoutes.middleware())
	.use(tokenAuthMiddleware)
	.use(userRoutes.middleware());
/*
router.get('/api/users', async (ctx) =>{
  const users = await prisma.user.findMany()
  ctx.body = users
});
*/
app.listen(3001);

logger.info('Server listening on https://localhost:3001')