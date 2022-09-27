const { getChildLogger } = require('../core/logging');
const { verifyPassword, hashPassword } = require('../core/password');
const { generateJWT, verifyJWT } = require('../core/jwt');
const Role = require('../core/roles');
const ServiceError = require('../core/serviceError');
const userRepository = require('../repository/user');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('user-service');
  this.logger.debug(message, meta);
};

const makeExposedUser = ({
  userId,
  naam,
  voornaam,
  email,
  roles,
  imageURL
}) => ({
  userId,
  naam,
  voornaam,
  email,
  roles,
  imageURL
});

const makeLoginData = async (user) => {
  const token = await generateJWT(user);

  return {
    user: makeExposedUser(user),
    token,
  };
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw ServiceError.unauthorized('The given email and password do not match');
  }

  const passwordValid = await verifyPassword(password, user.password_hash);

  if (!passwordValid) {
    throw ServiceError.unauthorized('The given email and password do not match');
  }

  return await makeLoginData(user);
};

const register = async ({
  naam,
  voornaam,
  email,
  password,
}) => {
  debugLog('Creating a new user', { voornaam, naam });
  const passwordHash = await hashPassword(password);

  const user = await userRepository.create({
    naam,
    voornaam,
    email,
    passwordHash,
    roles: [Role.USER],
  });

  return await makeLoginData(user);
};


const getAll = async (
  userID,
) => {
  debugLog('Fetching all users');
  const data = await userRepository.findAll({ userID});
  return {
    data: data.map(makeExposedUser),
  };
};

const getById = async (userID) => {
  debugLog(`Fetching user with userID ${userID}`);
  const user = await userRepository.findByID(userID);

  if (!user) {
    throw ServiceError.notFound(`No user with userID ${userID} exists`, { userID });
  }

  return makeExposedUser(user);
};

const updateById = async (userID, { naam, voornaam, email }) => {
  debugLog(`Updating user with userID ${userID}`, {naam, voornaam,email });
  const user = await userRepository.updateByID(userID, {naam, voornaam, email });
  console.log(user);
  return makeExposedUser(user);
};


const deleteById = async (userID) => {
  debugLog(`Deleting user with userID ${userID}`);
  const deleted = await userRepository.deleteById(userID);

  if (!deleted) {
    throw ServiceError.notFound(`No user with userID ${userID} exists`, { userID });
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
      roles, userId,
    } = await verifyJWT(authToken);

    return {
      userId,
      roles,
      authToken,
    };
  } catch (error) {
    const logger = getChildLogger('user-service');
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
  login,
  register,
  getAll,
  getById,
  updateById,
  deleteById,
  checkAndParseSession,
  checkRole,
};