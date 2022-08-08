const Joi = require('joi');
const Router = require('@koa/router');
const postService = require('../service/post');
const Role = require('../core/roles');
const { requireAuthentication, makeRequireRole } = require('../core/auth');

const validate = require('./_validation');

const create = async (ctx) => {
  const session = await postService.create(ctx.request.body);
  ctx.body = session;
};
create.validationScheme = {
  body: {
    title: Joi.string().max(255),
    description: Joi.string().max(255),
    author: Joi.number().integer().positive(),
  },
};

const getAllposts = async (ctx) => {
  const posts = await postService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = posts;
};
getAllposts.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

const getpostById = async (ctx) => {
  const post = await postService.getById(ctx.params.postID);
  ctx.body = post;
};
getpostById.validationScheme = {
  params: {
    postID: Joi.number().integer().positive(),
  },
};

const updatepostById = async (ctx) => {
  const post = await postService.updateById(ctx.params.postID, ctx.request.body);
  ctx.body = post;
};
updatepostById.validationScheme = {
  params: {
    postID: Joi.string().uuid(),
  },
  body: {
    naam: Joi.string().max(255),
    voornaam: Joi.string().max(255),
    email: Joi.string().email(),
  },
};

const deletepostById = async (ctx) => {
  await postService.deleteById(ctx.params.postID);
  ctx.status = 204;
};
deletepostById.validationScheme = {
  params: {
    postID: Joi.string().uuid(),
  },
};

module.exports = function installPostRouter(app) {
  const router = new Router({
    prefix: '/posts',
  });

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get('/', requireAuthentication, requireAdmin, validate(getAllposts.validationScheme), getAllposts);
  router.post('/', validate(create.validationScheme), create);
  router.get('/:postID', requireAuthentication, validate(getpostById.validationScheme), getpostById);
  router.put('/:postID', requireAuthentication, validate(updatepostById.validationScheme), updatepostById);
  router.delete('/:postID', requireAuthentication, validate(deletepostById.validationScheme), deletepostById);

  app.use(router.routes()).use(router.allowedMethods());
};