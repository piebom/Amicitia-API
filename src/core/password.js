const bcrypt = require('bcrypt');

module.exports.hashPassword = async (password) => {
  const passwordHash = await bcrypt.hash(password,5);

  return passwordHash;
};

module.exports.verifyPassword = async (password, passwordHash) => {
  const valid = await bcrypt.compare( password,passwordHash );

  return valid;
};