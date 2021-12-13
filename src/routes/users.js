const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const Router = require('@koa/router');
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
    const router = new Router({
        prefix: "/user"
    });
    router.post('/register', registerUser);
    router.post('/login', loginUser);
	app.use(router.routes()).use(router.allowedMethods());
}