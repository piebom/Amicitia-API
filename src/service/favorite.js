const { getChildLogger } = require('../core/logging');
const favoriteRepository = require('../repository/favorite');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('user-service');
	this.logger.debug(message, meta);
};


const findAll = async () => {
  debugLog(`Fetch all favorites`);
  return favoriteRepository.findAll();
}
const findFavoritesByUserID = async (id)=> {
  debugLog(`Fetch all favorites by user id`,{id});
  return favoriteRepository.findFavoritesByUserID(id);
}
const findFavoriteByUserIDAndActivityID = async (user_id, activity_id) => {
  debugLog(`Fetch all favorites by user id and activity id`);
  return favoriteRepository.findFavoriteByUserIDAndActivityID(parseInt(user_id), parseInt(activity_id));
}

const deleteFavoriteByFavoriteID = async (id) => {
  debugLog(`Delete favorite by favorite id`);
  return favoriteRepository.deleteFavoriteByFavoriteID(id);
}

const create = async (data) => {
  debugLog(`Create favorite`, {data});
  return favoriteRepository.create(data);
}
module.exports = {
  findAll,
  findFavoritesByUserID,
  findFavoriteByUserIDAndActivityID,
  deleteFavoriteByFavoriteID,
  create
};