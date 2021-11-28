const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const Router = require('@koa/router');

const getAllActivities = async (ctx) => {
    const activities = await prisma.activity.findMany();
    ctx.body = activities
}

const getActivityWithFavorite = async (ctx) => {
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
    const newActivity = await prisma.activity.create({
        data: {
            ...ctx.request.body,
        }
    })
    ctx.body = newActivity;
    ctx.status=201;
}

module.exports = function installActivityRoutes(app){
    const router = new Router({
        prefix: "/activities"
    });
    router.get('/', getAllActivities);
    router.get('/:id', getActivityWithFavorite);
    router.post('/',createActivity);

	app.use(router.routes()).use(router.allowedMethods());
}