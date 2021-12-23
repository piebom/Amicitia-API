const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const findAll = async () => {
  return await prisma.favorite.findMany()
}
const findFavoritesByUserID = async (id)=> {
  return await prisma.favorite.findMany({
    where: {
        user_id: parseInt(id)
    }
    })
}
const findFavoriteByUserIDAndActivityID = async (user_id, activity_id) => {
  return await prisma.favorite.findMany({
    where: {
        user_id: user_id,
        activity_id: activity_id
    }
  })
}

const deleteFavoriteByFavoriteID = async (id) => {
  return await prisma.favorite.delete({
    where: {
        id: id
    }
  })
}

const create = async (data) => {
  return await prisma.favorite.create({
    data: data
})
}
module.exports = {
  findAll,
  findFavoritesByUserID,
  findFavoriteByUserIDAndActivityID,
  deleteFavoriteByFavoriteID,
  create
};