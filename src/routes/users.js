const JoiRouter = require("koa-joi-router");
const bcrypt = require("bcrypt");
const Joi = JoiRouter.Joi;
const router = new JoiRouter();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

router.get(
    "/api/users",
    async ctx => {
        if (!ctx.state.userAuthenticated){
            ctx.throw("403", "User authentication required");
        }
        const users = await prisma.user.findMany()
        ctx.body = users
    }
);

module.exports = router;