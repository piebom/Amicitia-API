const resettokenService = require('../service/resettoken');
const userService = require('../service/user');
const router = require('koa-joi-router')
const Joi = router.Joi;
const nodemailer = require("nodemailer");
const crypto = require("crypto")

const checkToken = async (ctx) => {
    const token = await resettokenService.findResetTokenByToken(ctx.request.body.token)
    if(token){
      ctx.body = true
      return true;
    }
    else{
      ctx.body = false
      return false;
    }
}

const resetPassword = async (ctx) => {
  const token = await resettokenService.findResetTokenByToken(ctx.request.body.token)
  
    if(token != null){
      const updateUser = await userService.updatePasswordByID(id,await bcrypt.hash(ctx.request.body.password, 10))

      let rtoken = await resettokenService.findResetTokenByUserID(updateUser.id)
      if (rtoken.length > 0){
        resettokenService.deleteTokenByTokenID(rtoken.id)
      }
      ctx.body = updateUser
    }else{
    ctx.throw(400, "No user with token found");
    }
}
const resetToken = async (ctx) => {
  const user = await userService.getByEmail(ctx.request.body.email)
  if(!user){
    throw new Error("User does not exist");
  }
  let rtoken = resettokenService.findResetTokenByUserID(user.id)
  if (rtoken.length > 0){
    await resettokenService.deleteTokenByTokenID(rtoken.id)
  }
  let token = crypto.randomBytes(32).toString("hex");
  const userId = user.id;
  const createdAt =new Date((new Date()).toISOString().slice(0, 19).replace('T', ' '));
  const result = await resettokenService.create({
    userId,
    token,
    createdAt
  })
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'activityjournal.helpdesk@gmail.com',
      pass: 'Kaas1212'
    }
  });
  let info = await transporter.sendMail({
    from: 'ActivityJournal Support', // sender address
    to: "pbandere@gmail.com", // list of receivers
    subject: "Password Reset", // Subject line
    text: token, // plain text body
    html: "<p>Hi,</p></br><P>You requested to reset your password.</p></br><p>Please, click the link below to reset your password.</p></br><a href='https://frontendweb-pieter-2122-pie-bomm.vercel.app/password-reset?token=" + String(token) + "'>Reset Password</a>", // html body
  });
  ctx.body=info

}
module.exports = function installFavoriteRoutes(app){
    const resettoken = router();
    resettoken.prefix("/resettoken");
    resettoken.post('/check',{
      validate: {
        token: Joi.string().required()
      }
    },checkToken)
    resettoken.post('/reset',{
      validate: {
        token: Joi.string().required()
      }
    }, resetToken)
    resettoken.post('/resetpassword', {
      validate: {
          token: Joi.string().required(),
          password: Joi.string().required()
      }
  }, resetPassword)
	app.use(resettoken.middleware());
}