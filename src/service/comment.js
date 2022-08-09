const { getChildLogger } = require('../core/logging');
const { verifyPassword, hashPassword } = require('../core/password');
const { generateJWT, verifyJWT } = require('../core/jwt');
const Role = require('../core/roles');
const ServiceError = require('../core/serviceError');
const commentRepository = require('../repository/comment');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('comment-service');
  this.logger.debug(message, meta);
};

const makeExposedcomment = ({
  commentId,
  description,
  author,
}) => ({
  commentId,
  description,
  author,
});
const create = async ({
  description,
  author,
}) => {
  debugLog('Creating a new comment', { description });
  const comment = await commentRepository.create({
    description,
    author,
  });

  return await makeExposedcomment(comment);
};

const getAll = async (
  limit = 100,
  offset = 0,
) => {
  debugLog('Fetching all comments', { limit, offset });
  const data = await commentRepository.findAll({ limit, offset });
  const totalCount = await commentRepository.findCount();
  return {
    data: data.map(makeExposedcomment),
    count: totalCount,
    limit,
    offset,
  };
};

const getById = async (commentID) => {
  debugLog(`Fetching comment with commentID ${commentID}`);
  const comment = await commentRepository.findByID(commentID);

  if (!comment) {
    throw ServiceError.notFound(`No comment with commentID ${commentID} exists`, { commentID });
  }

  return makeExposedcomment(comment);
};

const updateById = async (commentID, { description }) => {
  debugLog(`Updating comment with commentID ${commentID}`, {description });
  const comment = await commentRepository.updateByID(commentID, {description });
  return makeExposedcomment(comment);
};


const deleteById = async (commentID) => {
  debugLog(`Deleting comment with commentID ${commentID}`);
  const deleted = await commentRepository.deleteById(commentID);

  if (!deleted) {
    throw ServiceError.notFound(`No comment with commentID ${commentID} exists`, { commentID });
  }
};

const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substr(7);
  try {
    const {
      roles, commentId,
    } = await verifyJWT(authToken);

    return {
      commentId,
      roles,
      authToken,
    };
  } catch (error) {
    const logger = getChildLogger('comment-service');
    logger.error(error.message, { error });
    throw ServiceError.unauthorized(error.message);
  }
};

const checkRole = (role, roles) => {
  const hasPermission = roles.includes(role);

  if (!hasPermission) {
    throw ServiceError.forbidden('You are not allowed to view this part of the application');
  }
};

module.exports = {
  getAll,
  getById,
  updateById,
  create,
  deleteById,
  checkAndParseSession,
  checkRole,
};