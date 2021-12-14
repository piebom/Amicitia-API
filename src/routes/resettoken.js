const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const Router = require('@koa/router');
const nodemailer = require("nodemailer");
const crypto = require("crypto")

const checkToken = async (ctx) => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const token = await prisma.resettoken.findFirst({
      where: {
          token: ctx.request.body.token
      }
    })
    if(token){
      ctx.response.body = true
    }
    else{
      ctx.response.body = false
    }
}

const changeToken = async (ctx) => {
  if (!ctx.state.userAuthenticated){
      ctx.throw("403", "User authentication required");
  }
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
      const deletetoken = await prisma.resettoken.deleteMany({
        where:{
          id: rtoken.id
      }});
    }
    ctx.body = updateUser
}else{
  ctx.throw(400, "No user with token found");
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
  ctx.status(202)

}

module.exports = function installFavoriteRoutes(app){
    const router = new Router({
        prefix: "/resettoken"
    });
    router.post('/check', checkToken);
    router.post('/change',changeToken);
    router.post('/reset',resetToken);
	app.use(router.routes()).use(router.allowedMethods());
}