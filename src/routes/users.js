const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const router = require('koa-joi-router')
const Joi = router.Joi;
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

const loginUser = async (ctx) => {
    const TOKEN_KEY="ccee31ac26c0c8437b0ead8c5db6df2b726cec976b828297f61594c4939ca3fb7ffa9c5d03fec458626df6f75cc93fc6f5e30e930c1ec38b70a0dcb7"
    try{
        const email = ctx.request.body.email;
        const password = ctx.request.body.password;
        if(!(email && password)){
            ctx.throw(400,"All input is required");
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })

        if (user && (await bcrypt.compare(password, user.password))){
            const token = jwt.sign(
                { user_id: user.id, email },
                TOKEN_KEY
            );
            await prisma.user.update({
                where: {
                    email: user.email
                },
                data: {
                    token: token
                }
            })
            user.token = token;

            ctx.status = 200;
            ctx.body = user;
            return;
        }
        ctx.throw(400, "Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
}
const resetPassword = async (ctx) => {
    const token = await prisma.resettoken.findFirst({
        where: {
          token: ctx.request.body.token
        }
      })
    
      if(token != null){
        const updateUser = await prisma.user.update({
          where:{
            id: token.userId
          },
          data: {
            password: await bcrypt.hash(ctx.request.body.password, 10),
          }
        })
        let rtoken = await prisma.resettoken.findMany({where:{
          userId: updateUser.id
        }})
        if (rtoken.length > 0){
          await prisma.resettoken.deleteMany({
            where:{
              id: rtoken.id
          }});
        }
        ctx.body = updateUser
      }else{
      ctx.throw(400, "No user with token found");
      }
}
const registerUser = async (ctx) => {
    const TOKEN_KEY="ccee31ac26c0c8437b0ead8c5db6df2b726cec976b828297f61594c4939ca3fb7ffa9c5d03fec458626df6f75cc93fc6f5e30e930c1ec38b70a0dcb7"
    try{
        const email = ctx.request.body.email;
        const username = ctx.request.body.username;
        const password = ctx.request.body.password;

        if (!(email && password && username)) {
            ctx.throw(400, "All input is required")
            ctx.status(400)
        }

        const oldUser = await prisma.user.findUnique({where:{email:email}})

        if (oldUser) {
            ctx.throw(409, "User already exist. Please Login.")
        }

        encryptPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                username: username,
                password: encryptPassword,
            }
        });

        const token = jwt.sign(
            { user_id: user.id, email},
            TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        await prisma.user.update({
            where: {
                email: user.email
            },
            data: {
                token: token
            }
        })
        user.token = token;
        ctx.status = 201;
        ctx.body = user;
    }catch (err){
        console.log(err);
    }
}

module.exports = function installUserRoutes(app){
    const users = router();
    users.prefix("/user");
    users.post('/register',{
        validate:{
            email: Joi.string().required(),
            password: Joi.string().required(),
            username: Joi.string().required()
        }
    },registerUser)
    users.post('/login',{
        validate: {
            email: Joi.string().required(),
            password: Joi.string().required()
        }
    }, loginUser)
    users.post('/resetpassword', {
        validate: {
            token: Joi.string().required(),
            password: Joi.string().required()
        }
    }, resetPassword)
	app.use(users.middleware());
}