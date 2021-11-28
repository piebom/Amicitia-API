const Router = require('@koa/router');
const installActivityRoutes = require("./routes/activities")
const installFavoriteRoutes = require("./routes/favorites")
var cors = require('cors')

module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });
  installActivityRoutes(router);
  installFavoriteRoutes(router);
	app.use(router.routes()).use(router.allowedMethods());
};