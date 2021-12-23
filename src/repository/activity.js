const {PrismaClient} = require('@prisma/client');
const { orderBy } = require('lodash');
const prisma = new PrismaClient();

const create = async (data) => {
  return await prisma.activity.create({
    data: data
})
}
const countCreatedActivities = async (id) => {
  return (await prisma.activity.findMany({
    where: {
        createdby: parseInt(id)
    }
})).length;
}
const getCreatedActivitiesByUserid = async (id) => {
  return await prisma.activity.findMany({
    where: {
        createdby: parseInt(id)
    }
})
}

const getAll = async ({limit, offset}) => {
  return await prisma.activity.findMany({
    skip: offset,
    take: limit,
    orderBy : 
    {
      id: 'desc'
    }
  }
  )
}

const findAll = async () => {
  return prisma.activity.findMany()
}

const countAll = async () => {
  return (await prisma.activity.findMany()).length
}
module.exports = {
  findAll,
  getAll,
  countAll,
  getCreatedActivitiesByUserid,
  create,
  countCreatedActivities,
};