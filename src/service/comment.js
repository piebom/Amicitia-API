const { getChildLogger } = require('../core/logging');
const { verifyPassword, hashPassword } = require('../core/password');
const { generateJWT, verifyJWT } = require('../core/jwt');
const Role = require('../core/roles');
const ServiceError = require('../core/serviceError');
const postRepository = require('../repository/post');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('post-service');
  this.logger.debug(message, meta);
};

const makeExposedpost = ({
  postId,
  title,
  description
}) => ({
  postId,
  title,
  description
});
const create = async ({
  title,
  description,
  author,
}) => {
  debugLog('Creating a new post', { title });
  const post = await postRepository.create({
    title,
    description,
    author,
  });

  return await makeExposedpost(post);
};

const getAll = async (
  limit = 100,
  offset = 0,
) => {
  debugLog('Fetching all posts', { limit, offset });
  const data = await postRepository.findAll({ limit, offset });
  const totalCount = await postRepository.findCount();
  console.log(data)
  return {
    data: data.map(makeExposedpost),
    count: totalCount,
    limit,
    offset,
  };
};

const getById = async (postID) => {
  debugLog(`Fetching post with postID ${postID}`);
  const post = await postRepository.findByID(postID);

  if (!post) {
    throw ServiceError.notFound(`No post with postID ${postID} exists`, { postID });
  }

  return makeExposedpost(post);
};

const updateById = async (postID, { naam, voornaam, email }) => {
  debugLog(`Updating post with postID ${postID}`, {naam, voornaam,email });
  const post = await postRepository.updateByID(postID, {naam, voornaam, email });
  return makeExposedpost(post);
};


const deleteById = async (postID) => {
  debugLog(`Deleting post with postID ${postID}`);
  const deleted = await postRepository.deleteById(postID);

  if (!deleted) {
    throw ServiceError.notFound(`No post with postID ${postID} exists`, { postID });
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
      roles, postId,
    } = await verifyJWT(authToken);

    return {
      postId,
      roles,
      authToken,
    };
  } catch (error) {
    const logger = getChildLogger('post-service');
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