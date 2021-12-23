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
      const token = authorizationHeader.substring(7, authorizationHeader.length); //Retrieve the token from the "Bearer {token}" format
      const user = await prisma.user
      .findUnique({
          where: {
              token: token,
          },
      })
      if (!user) {
         throw new Error("Not authenticated")
      }
      // Update the Koa context
      ctx.state.userAuthenticated = true;
      ctx.state.user = user;
    }
    return next();
  }
  module.exports = checkAuth;