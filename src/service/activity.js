const { debuglog } = require('util');
const { getChildLogger } = require('../core/logging');
const activityRepository = require('../repository/activity');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('user-service');
	this.logger.debug(message, meta);
};

const create = (data) => {
  debugLog('Creating a new activity', { data });
  return activityRepository.create(data);
};
const countCreatedActivities = async (id) => {
  debugLog('Count created activities');
  return activityRepository.countCreatedActivities();
}
const getCreatedActivitiesByUserid = (id) => {
  debugLog('Get created activities by user ID');
  return activityRepository.getCreatedActivitiesByUserid(id);
}

const getAll = async ({limit, offset}) => {
  debugLog('Get all activities with limit and offset', {limit,offset});
  return activityRepository.getAll({limit, offset});
}
const findAll = async () => {
  debugLog('Get all activities');
  return activityRepository.findAll();
}



const countAll = async () => {
  debugLog('Get the count of all activities');
  return activityRepository.getAll();
}
module.exports = {
  findAll,
  getAll,
  countAll,
  getCreatedActivitiesByUserid,
  create,
  countCreatedActivities,
};