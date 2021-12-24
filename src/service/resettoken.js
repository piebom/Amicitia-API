const { getChildLogger } = require('../core/logging');
const resettokenRepository = require('../repository/resettoken');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('user-service');
	this.logger.debug(message, meta);
};

const findResetTokenByToken = async (token) => {
  debugLog('Fetch reset token by token');
  return resettokenRepository.findResetTokenByToken(token);
}
const findResetTokenByUserID = async (id) => {
  debugLog('Fetch reset token by userid');
  return resettokenRepository.findResetTokenByUserID(id);
}

const deleteTokenByTokenID = async (id) => {
  debugLog('delete token by token id');
  return resettokenRepository.deleteTokenByTokenID(id);
}

const create = async (data) => {
  debugLog('create token', {data});
  return resettokenRepository.create(data);
}
module.exports = {
  findResetTokenByUserID,
  findResetTokenByToken,
  deleteTokenByTokenID,
  create,
};