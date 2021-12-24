const router = require('koa-joi-router')
const Joi = router.Joi;
const auth = require("../middlewares/tokenAuth");
const activityService = require('../service/activity');
const favoriteService = require('../service/favorite');

const getActivityPage = async (ctx) => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const page = parseInt(ctx.query.page)
    const limit = parseInt(ctx.query.limit)

    const offset = (page - 1) * limit
    const results = await activityService.getAll({limit,offset})
    ctx.body = results
}

const getCreatedActivities = async (ctx) => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const activities = await activityService.getCreatedActivitiesByUserid(ctx.params.id)
    ctx.body = activities
}
const getAllActivityWithFavorite = async (ctx) => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const activities = await activityService.findAll()
    const favoritesFromUser = await favoriteService.findFavoritesByUserID(ctx.params.id)
    var favorites = [];
    favoritesFromUser.forEach(obj => {
        favorites.push(obj.activity_id);
    });
    activities.forEach((item) => favorites.includes(item.id)? item["isFavorite"] = true : item["isFavorite"] = false)
    ctx.body = {count,activities};
    return activities
}
const getActivityWithFavorite = async (ctx) => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const page = parseInt(ctx.query.page)
    const limit = parseInt(ctx.query.limit)

    const offset = (page - 1) * limit
    const count = Math.ceil((await activityService.findAll()).length / limit)
    const activities = await activityService.getAll({limit,offset})
    const favoritesFromUser = await favoriteService.findFavoritesByUserID(ctx.params.id)
    var favorites = [];
    favoritesFromUser.forEach(obj => {
        favorites.push(obj.activity_id);
    });
    activities.forEach((item) => favorites.includes(item.id)? item["isFavorite"] = true : item["isFavorite"] = false)
    ctx.body = {count,activities};
    return activities
}

const getFavoriteActivities = async (ctx) => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const activities = [].concat(await getAllActivityWithFavorite(ctx));
    const favorites = activities.filter(activity => activity.isFavorite == true);
    ctx.body = favorites;
}

const createActivity = async (ctx) => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const newActivity = await activityService.create(ctx.request.body)
    ctx.body = newActivity;
    ctx.status=201;
}
const count = async (ctx) => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const activities = await activityService.getCreatedActivitiesByUserid(ctx.params.id)
    ctx.body = activities.length;
}
module.exports = function installActivityRoutes(app){
    const activities = router();
    activities.prefix("/activities");
    
    activities.get('/',auth, getActivityPage);
    activities.get('/getFavorites/:id',auth, getFavoriteActivities);
    activities.get('/created/:id',auth, getCreatedActivities);
    activities.get('/:id',auth, getActivityWithFavorite);
    activities.get('/count/:id',auth, count);
    activities.post('/',auth,createActivity);
	app.use(activities.middleware());
}