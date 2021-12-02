const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const Router = require('@koa/router');
const auth = require("../middlewares/tokenAuth");
const getAllActivities = async (ctx) => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const activities = await prisma.activity.findMany();
    ctx.body = activities
}

const getActivityWithFavorite = async (ctx) => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const activities = await prisma.activity.findMany();
    const favoritesFromUser = await prisma.favorite.findMany({
        where: {
            user_id: parseInt(ctx.params.id),
        },
        select: {
            activity_id: true,
        }
    });
    var favorites = [];
    favoritesFromUser.forEach(obj => {
        favorites.push(obj.activity_id);
    });
    activities.forEach((item) => favorites.includes(item.id)? item["isFavorite"] = true : item["isFavorite"] = false)
    ctx.body = activities;
}

const createActivity = async (ctx) => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const newActivity = await prisma.activity.create({
        data: {
            ...ctx.request.body,
        }
    })
    ctx.body = newActivity;
    ctx.status=201;
}
const count = async (ctx) => {
    if (!ctx.state.userAuthenticated){
        ctx.throw("403", "User authentication required");
    }
    const activities = await prisma.activity.findMany({
        where: {
            createdby: parseInt(ctx.params.id)
        }
    });
    ctx.body = activities.length;
}
module.exports = function installActivityRoutes(app){
    const router = new Router({
        prefix: "/activities"
    });
    
    router.get('/',auth, getAllActivities);
    router.get('/:id',auth, getActivityWithFavorite);
    router.get('/count/:id',auth, count);
    router.post('/',auth,createActivity);

	app.use(router.routes()).use(router.allowedMethods());
}