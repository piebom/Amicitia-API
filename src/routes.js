const Router = require('@koa/router');
const installActivityRoutes = require("./routes/activities")
const installFavoriteRoutes = require("./routes/favorites")
const installUserRoutes = require("./routes/users")
const installResetTokenRoutes = require("./routes/resettoken")

var cors = require('cors')

module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });
  installActivityRoutes(router);
  installFavoriteRoutes(router);
  installUserRoutes(router);
  installResetTokenRoutes(router);
	app.use(router.routes()).use(router.allowedMethods());
};