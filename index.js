const Koa = require('koa');
const {getLogger} = require('./core/logging');

const app = new Koa();
const logger = getLogger();

app.use(async (ctx, next) =>{
    console.log('Eerste keer');
    await next();
    console.log('Tweede keer');
});

app.use(async ctx => {
    console.log(ctx);
    ctx.body = 'Hello world!';
});

app.listen(3001);

logger.info('Server listening on https://localhost:3001')