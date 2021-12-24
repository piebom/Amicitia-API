const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const findAll = async () => {
  return await prisma.user.findMany()
};

const findById = async (id) => {
  return await prisma.user.findFirst({
    where: {
      id: id
    }
  })
};
const findByEmail = async (email) => {
  console.log(email)
  return await prisma.user.findFirst({
    where: {
      email: email
    }
  })
};
const updateTokenByEmail = async (email, token) => {
  return await prisma.user.update({
    where: {
        email: email
    },
    data: {
        token: token
    }
})
}
const updatePasswordByID = async (id, password) => {
  return await prisma.user.update({
    where: {
        id: id
    },
    data: {
        password: password
    }
})
}
const create = async (data) => {
  return await prisma.user.create({data:data
})
};

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  updateTokenByEmail,
  updatePasswordByID
};