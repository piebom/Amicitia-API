const JoiRouter = require("koa-joi-router");
const Joi = JoiRouter.Joi;
const router = new JoiRouter();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const tokenRoutes = require("./routes/token");

router.prefix("/api/token");

router.post("/add",
    {
        validate: {
            type: "json",
            body: {
                user_id: Joi.number().required(),
                token: Joi.string().required()
            }
        }   
    },
    async ctx => {
        const datetime = new Date().toLocaleString();
        const result = await prisma.accesstoken.create({
            data: {
              user_id,
              token,
              datetime
            },
          });
    }
);

router.get("/get",
{
    validate: {
        type: "json",
        body: {
            token: Joi.string().required()
        }
    }
},
async ctx => {
    const token = await prisma.accesstoken
    .findUnique({
        where: {
            token: ctx.request.body.token,
        },
    })
    if (!token) {
        ctx.throw(400, "No user with token found");
      }
}
)
