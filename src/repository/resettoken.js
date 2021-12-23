const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const findResetTokenByToken = async (token) => {
  return await prisma.resettoken.findFirst({
    where: {
        token: token
    }
  })
}
const findResetTokenByUserID = async (id) => {
  return await prisma.resettoken.findMany({where:{
    userId: id
  }})
}

const deleteTokenByTokenID = async (id) => {
  return await prisma.resettoken.deleteMany({
    where:{
      id: id
  }});
}

const create = async (data) => {
  await prisma.resettoken.createMany({
    data: data,
  })
}
module.exports = {
  findResetTokenByUserID,
  findResetTokenByToken,
  deleteTokenByTokenID,
  create,
};