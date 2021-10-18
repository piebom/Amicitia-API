const JoiRouter = require("koa-joi-router");
const bcrypt = require("bcrypt");
const Joi = JoiRouter.Joi;
const router = new JoiRouter();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

router.get(
    "/api/favorites",
    async ctx => {
        if (!ctx.state.userAuthenticated){
            ctx.throw("403", "User authentication required");
        }
        const favorites = await prisma.favorite.findMany()
        ctx.body = favorites
    }
);

router.get('/api/favorites/:id',
async ctx => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const favorites = await prisma.favorite.findMany({
        where: {
            user_id: parseInt(ctx.request.params.id)
        }
    })
    ctx.body = favorites
}
)

router.delete("/api/favorites/:user_id/:activity_id",
async ctx => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const favorite = await prisma.favorite.findMany({
        where: {
            user_id: parseInt(ctx.request.params.user_id),
            activity_id: parseInt(ctx.request.params.activity_id)
        }
    })
    const favorites = await prisma.favorite.delete({
        where: {
            id: favorite[0].id
        }
    })
    ctx.response.body = { favorites };
}
)

router.post("/api/favorites",
    {
        validate: {
            type: "json",
            body: {
                user_id: Joi.number()
                    .required(),
                activity_id: Joi.number().required(),
            }
        }   
    },
    async ctx => {
        if (!ctx.state.userAuthenticated){
            ctx.throw("403", "User authentication required");
        }
            const user_id = ctx.request.body.user_id;
            const activity_id = ctx.request.body.activity_id;
            const favorites = await prisma.favorite.findMany()
            var exist = false;
            favorites.forEach((item) => {
                if (item.user_id == user_id && item.activity_id == activity_id){
                    exist = true;
                }
            })
            if(exist == false){
                const result = await prisma.favorite.create({
                    data: {
                        user_id,
                      activity_id,
                    },
                  });
                ctx.response.body = { result };
            }
            else{
                ctx.throw("403", "User already favored this activity")
            }
    }
);

module.exports = router;