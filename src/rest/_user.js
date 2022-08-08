const Joi = require('joi');
const Router = require('@koa/router');

const userService = require('../service/user');
const Role = require('../core/roles');
const { requireAuthentication, makeRequireRole } = require('../core/auth');

const validate = require('./_validation');

const login = async (ctx) => {
  const { email, password } = ctx.request.body;
  const session = await userService.login(email, password);
  ctx.body = session;
};
login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

const register = async (ctx) => {
  const session = await userService.register(ctx.request.body);
  ctx.body = session;
};
register.validationScheme = {
  body: {
    voornaam: Joi.string().max(255),
    naam: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(30),
  },
};

const getAllUsers = async (ctx) => {
  const users = await userService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = users;
};
getAllUsers.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

const getUserById = async (ctx) => {
  const user = await userService.getById(ctx.params.userID);
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    userID: Joi.number().integer().positive(),
  },
};

const updateUserById = async (ctx) => {
  const user = await userService.updateById(ctx.params.userID, ctx.request.body);
  ctx.body = user;
};
updateUserById.validationScheme = {
  params: {
    userID: Joi.string().uuid(),
  },
  body: {
    naam: Joi.string().max(255),
    voornaam: Joi.string().max(255),
    email: Joi.string().email(),
  },
};

const deleteUserById = async (ctx) => {
  await userService.deleteById(ctx.params.userID);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    userID: Joi.string().uuid(),
  },
};

module.exports = function installUsersRoutes(app) {
  const router = new Router({
    prefix: '/users',
  });


  router.post('/login', validate(login.validationScheme), login);
  router.post('/register', validate(register.validationScheme), register);

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get('/', requireAuthentication, requireAdmin, validate(getAllUsers.validationScheme), getAllUsers);
  router.get('/:userID', requireAuthentication, validate(getUserById.validationScheme), getUserById);
  router.put('/:userID', requireAuthentication, validate(updateUserById.validationScheme), updateUserById);
  router.delete('/:userID', requireAuthentication, validate(deleteUserById.validationScheme), deleteUserById);

  app.use(router.routes()).use(router.allowedMethods());
};