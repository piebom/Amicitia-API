const { tables, getKnex } = require('../data/index');
const { getChildLogger } = require('../core/logging');

const findAll =  ({
    limit,
    offset,
  }) => {
    return  getKnex()(tables.post)
      .select()
      .limit(limit)
      .offset(offset);
  };


const findByID = (postID) => {
  return  getKnex()(tables.post)
    .where(`${tables.post}.postId`, postID)
    .first();
};


const updateByID = async (postID, {
  title, description
}) => {
  try {
    await getKnex()(tables.post)
      .update({
        title, description
      })
      .where(`${tables.post}.postId`, postID);
    return await findByID(postID);
  } catch (error) {
    const logger = getChildLogger('post-repo');
    logger.error('Error in updateByID', {
      error,
    });
    throw error;
  }
};

const create = async ({
  title,
  description,
  author,
}) => {
  try {
    const id = await getKnex()(tables.post)
      .insert({
        title,
        description,
        author,
      });
    return await findByID(id);
  } catch (error) {
    const logger = getChildLogger('post-repo');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};

const deleteById = async (postID) => {
  try {
    const rowsAffected = await getKnex()(tables.post)
      .delete()
      .where('postID', postID);

    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('post-repo');
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
};
  
  const findCount = async () => {
    const [count] = await getKnex()(tables.post)
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