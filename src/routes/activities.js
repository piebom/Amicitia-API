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
router.get('/api/activities/:id',
async ctx => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const favorites = await prisma.activity.findMany({
        where: {
            createdby: parseInt(ctx.request.params.id)
        }
    })
    ctx.body = favorites
}
)
router.post("/api/activities",
    {
        validate: {
            type: "json",
            body: {
                activity: Joi.string().required(),
                type: Joi.string().required(),
                participants: Joi.number().required(),
                accessibility: Joi.number().required(),
                createdby: Joi.number()
            }
        }   
    },
    async ctx => {
        if (!ctx.state.userAuthenticated){
            ctx.throw("403", "User authentication required");
        }
            const activity = ctx.request.body.activity;
            const type = ctx.request.body.type;
            const participants = ctx.request.body.participants;
            const accessibility = ctx.request.body.accessibility;
            var createdby = null;
            if (ctx.request.body.createdby){
                createdby = ctx.request.body.createdby;
            }
            const result = await prisma.activity.create({
                data: {
                  activity,
                  type,
                  participants,
                  accessibility,
                  createdby
                },
              });
            const activities = await prisma.activity.findMany()
            ctx.response.body = { activities };
    }
);

module.exports = router;