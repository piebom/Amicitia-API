const JoiRouter = require("koa-joi-router");
const crypto = require("crypto");
const Joi = JoiRouter.Joi;
const router = new JoiRouter();
const {PrismaClient} = require('@prisma/client');
const nodemailer = require("nodemailer");
const prisma = new PrismaClient();
router.prefix("/api");
router.get('/reset',
async ctx => {
    const token = await prisma.resettoken.findFirst({
        where: {
            token: ctx.request.body.token
        }
    })
    console.log(token)
    if(token){
      ctx.response.body = true
    }
    else{
      ctx.response.body = false
    }
}
)
router.post("/reset",
    {
        validate: {
            type: "json",
            body: {
                email: Joi.string().required(),
            }
        }   
    },
    async ctx => {
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
        html: "<p>Hi,</p></br><P>You requested to reset your password.</p></br><p>Please, click the link below to reset your password.</p></br><a href='http://192.168.0.213:3000/password-reset?token=" + String(token) + "'>Reset Password</a>", // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
);
module.exports = router;