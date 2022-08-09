const Joi = require('joi');
const Router = require('@koa/router');
const commentService = require('../service/comment');
const Role = require('../core/roles');
const { requireAuthentication, makeRequireRole } = require('../core/auth');

const validate = require('./_validation');

const create = async (ctx) => {
  const session = await commentService.create(ctx.request.body);
  ctx.body = session;
};
create.validationScheme = {
  body: {
    description: Joi.string().max(255),
    author: Joi.number().integer().positive(),
  },
};

const getAllcomments = async (ctx) => {
  const comments = await commentService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = comments;
};
getAllcomments.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

const getcommentById = async (ctx) => {
  const comment = await commentService.getById(ctx.params.commentID);
  ctx.body = comment;
};
getcommentById.validationScheme = {
  params: {
    commentID: Joi.number().integer().positive(),
  },
};

const updatecommentById = async (ctx) => {
  const comment = await commentService.updateById(ctx.params.commentID, ctx.request.body);
  ctx.body = comment;
};
updatecommentById.validationScheme = {
  params: {
    commentID: Joi.number().integer().positive(),
  },
  body: {
    description: Joi.string().max(255),
  },
};

const deletecommentById = async (ctx) => {
  await commentService.deleteById(ctx.params.commentID);
  ctx.status = 204;
};
deletecommentById.validationScheme = {
  params: {
    commentID: Joi.number().integer().positive(),
  },
};

module.exports = function installCommentRouter(app) {
  const router = new Router({
    prefix: '/comments',
  });


  router.get('/', requireAuthentication, validate(getAllcomments.validationScheme), getAllcomments);
  router.post('/',requireAuthentication, validate(create.validationScheme), create);
  router.get('/:commentID', requireAuthentication, validate(getcommentById.validationScheme), getcommentById);
  router.put('/:commentID', requireAuthentication, validate(updatecommentById.validationScheme), updatecommentById);
  router.delete('/:commentID', requireAuthentication, validate(deletecommentById.validationScheme), deletecommentById);

  app.use(router.routes()).use(router.allowedMethods());
};