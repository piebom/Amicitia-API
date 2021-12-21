const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const router = require('koa-joi-router')
const Joi = router.Joi;
const nodemailer = require("nodemailer");
const crypto = require("crypto")

const checkToken = async (ctx) => {
    const token = await prisma.resettoken.findFirst({
      where: {
          token: ctx.request.body.token
      }
    })
    if(token){
      ctx.body = true
      return true;
    }
    else{
      ctx.body = false
      return false;
    }
}

const resetToken = async (ctx) => {
  const user = await prisma.user.findFirst({where:{
    email: ctx.request.body.email
  }});
  if(!user){
    throw new Error("User does not exist");
  }
  let rtoken = await prisma.resettoken.findMany({where:{
    userId: user.id
  }})
  if (rtoken.length > 0){
    const deletetoken = await prisma.resettoken.deleteMany({
      where:{
        id: rtoken.id
    }});
  }
  let token = crypto.randomBytes(32).toString("hex");
  const userId = user.id;
  const createdAt =new Date((new Date()).toISOString().slice(0, 19).replace('T', ' '));
  const result = await prisma.resettoken.createMany({
    data: {
      userId,
      token,
      createdAt
    },
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
	app.use(resettoken.middleware());
}