const favoriteService = require('../service/favorite');
const router = require('koa-joi-router')
const Joi = router.Joi;

const getAllFavorites = async (ctx) => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const favorites = await favoriteService.findAll();
    ctx.body = favorites
}

const getFavoriteByID = async (ctx) => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const favorite = await favoriteService.findFavoritesByUserID(ctx.request.params.id)
    ctx.body = favorite
}

const deleteFavorite = async (ctx) => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
  const favorite = await favoriteService.findFavoriteByUserIDAndActivityID(ctx.request.params.user_id,ctx.request.params.activity_id)
  await favoriteService.deleteFavoriteByFavoriteID(favorite[0].id)
  ctx.status = 204;
}

const createFavorite = async (ctx) => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const newFavorite = await favoriteService.create(ctx.request.body)
    ctx.body = newFavorite;
    ctx.status=201;
}

module.exports = function installFavoriteRoutes(app){
    const favorites = router();
    favorites.prefix("/favorites");
    favorites.get('/', getAllFavorites);
    favorites.get('/:id', getFavoriteByID);
    favorites.delete('/:user_id/:activity_id',deleteFavorite);
    favorites.post('/',createFavorite);

	app.use(favorites.middleware());
}