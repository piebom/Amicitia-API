const JoiRouter = require("koa-joi-router");
const bcrypt = require("bcrypt");
const Joi = JoiRouter.Joi;
const router = new JoiRouter();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

router.get(
    "/api/activities",
    async ctx => {
        if (!ctx.state.userAuthenticated){
            ctx.throw("403", "User authentication required");
        }
        const activities = await prisma.activity.findMany()
        ctx.body = activities
    }
);

module.exports = router;