const { tables, getKnex } = require('../data/index');
const { getChildLogger } = require('../core/logging');

const findAll =  ({
    limit,
    offset,
  }) => {
    return  getKnex()(tables.comment)
      .select()
      .limit(limit)
      .offset(offset);
  };


const findByID = (commentID) => {
  return  getKnex()(tables.comment)
    .where(`${tables.comment}.commentID`, commentID)
    .first();
};


const updateByID = async (commentID, {
  description
}) => {
  try {
    const id = await getKnex()(tables.comment)
      .update({
        description,
      })
      .where(`${tables.comment}.commentID`, commentID);
    return await findByID(id);
  } catch (error) {
    const logger = getChildLogger('comment-repo');
    logger.error('Error in updateByID', {
      error,
    });
    throw error;
  }
};

const create = async ({
  description,
  author,
  post,
}) => {
  try {
    const id = await getKnex()(tables.comment)
      .insert({
        description,
        author,
        post,
      });
    return await findByID(id);
  } catch (error) {
    const logger = getChildLogger('comment-repo');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};

const deleteById = async (commentID) => {
  try {
    const rowsAffected = await getKnex()(tables.comment)
      .delete()
      .where('commentID', commentID);

    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('comment-repo');
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
};
  
  const findCount = async () => {
    const [count] = await getKnex()(tables.comment)
      .count();
    return count['count(*)'];
  };

  module.exports = {
    findAll,
    findByID,
    updateByID,
    create,
    deleteById,
    findCount,
  };