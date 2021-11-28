const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const Router = require('@koa/router');

const getAllFavorites = async (ctx) => {
    const favorites = await prisma.favorite.findMany();
    ctx.body = favorites
}

const getFavoriteByID = async (ctx) => {
  const favorite = await prisma.favorite.findMany({
    where: {
        user_id: parseInt(ctx.request.params.id)
    }
})
ctx.body = favorite
}

const deleteFavorite = async (ctx) => {
  await prisma.favorite.findMany({
    where: {
        user_id: parseInt(ctx.request.params.user_id),
        activity_id: parseInt(ctx.request.params.activity_id)
    }
  })
  const favorites = await prisma.favorite.delete({
    where: {
        id: favorite[0].id
    }
  })
  ctx.status = 204;
}

const createFavorite = async (ctx) => {
    const newFavorite = await prisma.favorite.create({
        data: {
            ...ctx.request.body,
        }
    })
    ctx.body = newFavorite;
    ctx.status=201;
}

module.exports = function installFavoriteRoutes(app){
    const router = new Router({
        prefix: "/favorites"
    });
    router.get('/', getAllFavorites);
    router.get('/:id', getFavoriteByID);
    router.delete('/:user_id/:activity_id',deleteFavorite);
    router.post('/',createFavorite);

	app.use(router.routes()).use(router.allowedMethods());
}