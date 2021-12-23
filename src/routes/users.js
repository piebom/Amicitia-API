const userService = require('../service/user');
const router = require('koa-joi-router')
const Joi = router.Joi;
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

const loginUser = async (ctx) => {
    const TOKEN_KEY="ccee31ac26c0c8437b0ead8c5db6df2b726cec976b828297f61594c4939ca3fb7ffa9c5d03fec458626df6f75cc93fc6f5e30e930c1ec38b70a0dcb7"
    try{
        const {email,password} = ctx.request.body;
        const user = await userService.getByEmail(email)
        if (user && (await bcrypt.compare(password, user.password))){
            const token = jwt.sign(
                { user_id: user.id, email },
                TOKEN_KEY
            );
            const updatedUser = await userService.updateTokenByEmail(email,token);

            ctx.status = 200;
            ctx.body = updatedUser;
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
        const {email, username, password} = ctx.request.body;
        const oldUser = await userService.getByEmail(email)

        if (oldUser) {
            ctx.throw(409, "User already exist. Please Login.")
        }

        encryptPassword = await bcrypt.hash(password, 10);
        const user = await userService.register(email.toLowerCase(),username,encryptPassword)
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
	app.use(users.middleware());
}