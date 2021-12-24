const { getChildLogger } = require('../core/logging');
const userRepository = require('../repository/user');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('user-service');
	this.logger.debug(message, meta);
};

const register = ({
  email,
  username,
  password
}) => {
  debugLog('Creating a new user', { username });
  return userRepository.create({
    email,
    username,
    password
  });
};

 const getAll = async () => {
  debugLog('Fetching all users');
  const data = await userRepository.findAll();
  return data;
};
const getByEmail = async (email) => {
  debugLog(`Fetching user with email ${email}`);
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error(`No user with email ${email} exists`, { email });
  }

  return user;
};
const updateTokenByEmail = async (email, token) => {
  debugLog(`Updating user with email ${email}`, token);
  return userRepository.updateTokenByEmail(email, token);
}
const updatePasswordByID = async (id, password) => {
  debugLog(`Updating user password with id ${id}`, password);
  return userRepository.updatePasswordByID(id, password);
}
const getById = async (id) => {
  debugLog(`Fetching user with id ${id}`);
  const user = await userRepository.findById(id);

  if (!user) {
    throw new Error(`No user with id ${id} exists`, { id });
  }

  return user;
};
module.exports = {
  register,
  getAll,
  getById,
  getByEmail,
  updateTokenByEmail,
  updatePasswordByID
};