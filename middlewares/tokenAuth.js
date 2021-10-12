const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAuth(ctx, next) {
    ctx.state.userAuthenticated = false; // Request is not authenticated by default
    if ("authorization" in ctx.request.headers) {
      const authorizationHeader = ctx.request.headers.authorization;
      if (!authorizationHeader.startsWith("Bearer ")) {
        ctx.throw(
          400,
          'Invalid authorization Header. Should start with "Bearer"'
        );
      }
      const tokenn = authorizationHeader.substring(7, authorizationHeader.length); //Retrieve the token from the "Bearer {token}" format
      const accessToken = await prisma.accesstoken
      .findUnique({
          where: {
              token: tokenn,
          },
      })
      if (!accessToken) {
        ctx.throw(400, "Invalid access token");
      }
      // Update the Koa context
      ctx.state.userAuthenticated = true;
      ctx.state.user = accessToken.user;
    }
    return next();
  }
  module.exports = checkAuth;