const JoiRouter = require("koa-joi-router");
const bcrypt = require("bcrypt");
const Joi = JoiRouter.Joi;
const router = new JoiRouter();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require("crypto");

router.prefix("/api/auth");

router.post("/register",
    {
        validate: {
            type: "json",
            body: {
                email: Joi.string()
                    .lowercase()
                    .email()
                    .required(),
                password: Joi.string().required(),
                confirmation: Joi.string().required()
            }
        }   
    },
    async ctx => {
        if(ctx.request.body.password == ctx.request.body.confirmation){
            const password = await bcrypt.hash(ctx.request.body.password, 10);
            const email = ctx.request.body.email;
            const result = await prisma.user.create({
                data: {
                  email,
                  password,
                },
              });
            ctx.response.body = { route: "/auth/register", params: ctx.request.body };
        }
        else{
            ctx.throw(400, "Passwords don't match");
        }
    }
);

router.post("/login",
    {
        validate:{
            type: "json",
            body: {
                email: Joi.string()
                    .lowercase()
                    .email()
                    .required(),
                password: Joi.string().required()
            }
        }
    },
    async ctx => {
        const user = await prisma.user
            .findUnique({
                where: {
                    email: ctx.request.body.email,
                },
            })
        if (!user) {
            ctx.throw(400, "Login failed");
          }

          const isPasswordCorrect = await bcrypt.compare(
            ctx.request.body.password,
            user.password
          );
          if (!isPasswordCorrect) {
            ctx.throw(400, "Login failed");
          }
          const usertoken = await prisma.accesstoken
          .findUnique({
              where: {
                  user_id: user.id,
              },
          })
          if (usertoken == null) {
            const buffer = await crypto.randomBytes(32);
            const token = buffer.toString("hex");
            const user_id = user.id;
            const created_at =new Date((new Date()).toISOString().slice(0, 19).replace('T', ' '));
            const result = await prisma.accesstoken.create({
              data: {
                user_id,
                token,
                created_at
              },
            });
            ctx.response.body = { access_token: token };
          }else{
            ctx.response.body = { access_token: usertoken.token };
          }
    }
)

module.exports = router;