const { tables, getKnex } = require('../data/index');
const { getChildLogger } = require('../core/logging');

const findAll =  ({
    limit,
    offset,
  }) => {
    return getKnex()(tables.match)
    .select(getKnex().raw(`matchID, CourtType, Score, concat(a.voornaam,' ', a.naam) as SpelerA, concat(b.voornaam,' ', b.naam) as SpelerB, a.imageURL as imageA, b.imageURL as imageB, date`))
    .join(`${tables.user} as a`, 'SpelerA', '=', 'a.userId')
    .join(`${tables.user} as b`, 'SpelerB', '=', 'b.userId')
    .orderBy('matchID', 'asc')
  };


const findByID = (matchID) => {
  console.log(matchID)
  return getKnex()(tables.match)
  .select(getKnex().raw(`matchID, CourtType, Score,SpelerA,SpelerB,concat(a.voornaam,' ', a.naam) as SpelerAnaam, concat(b.voornaam,' ', b.naam) as SpelerBnaam, a.imageURL as imageA, b.imageURL as imageB, date`))
  .join(`${tables.user} as a`, 'SpelerA', '=', 'a.userId')
  .join(`${tables.user} as b`, 'SpelerB', '=', 'b.userId')
  .where(`${tables.match}.matchID`, matchID)
  .first();
};

const findMatchByPlayers = (SpelerA, SpelerB) => {
  if(SpelerA> 0){
  return getKnex()(tables.match)
  .select(getKnex().raw(`matchID, CourtType, Score,SpelerA,SpelerB,concat(a.voornaam,' ', a.naam) as SpelerAnaam, concat(b.voornaam,' ', b.naam) as SpelerBnaam, a.imageURL as imageA, b.imageURL as imageB, date`))
  .join(`${tables.user} as a`, 'SpelerA', '=', 'a.userId')
  .join(`${tables.user} as b`, 'SpelerB', '=', 'b.userId')
  .where(`${tables.match}.SpelerA`, SpelerA)
  .andWhere(`${tables.match}.SpelerB`, SpelerB)
  .orWhere(`${tables.match}.SpelerA`, SpelerB)
  .andWhere(`${tables.match}.SpelerB`, SpelerA)
  }
  else{
    return getKnex()(tables.match)
    .select(getKnex().raw(`matchID, CourtType, Score,SpelerA,SpelerB,concat(a.voornaam,' ', a.naam) as SpelerAnaam, concat(b.voornaam,' ', b.naam) as SpelerBnaam, a.imageURL as imageA, b.imageURL as imageB, date`))
    .join(`${tables.user} as a`, 'SpelerA', '=', 'a.userId')
    .join(`${tables.user} as b`, 'SpelerB', '=', 'b.userId')
    .where(`${tables.match}.SpelerA`, SpelerB)
    .orWhere(`${tables.match}.SpelerB`, SpelerB)
  }
};



const updateByID = async (matchID, {
  title, description
}) => {
  try {
    await getKnex()(tables.match)
      .update({
        title, description
      })
      .where(`${tables.match}.matchId`, matchID);
    return await findByID(matchID);
  } catch (error) {
    const logger = getChildLogger('match-repo');
    logger.error('Error in updateByID', {
      error,
    });
    throw error;
  }
};

const create = async ({
  CourtType,
  Score,
  SpelerA,
  SpelerB,
  date
}) => {
  try {
    const id = await getKnex()(tables.match)
      .insert({
        CourtType,
        Score,
        SpelerA,
        SpelerB,
        date
      });
    return await findByID(id);
  } catch (error) {
    const logger = getChildLogger('match-repo');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};

const deleteById = async (matchID) => {
  try {
    const rowsAffected = await getKnex()(tables.match)
      .delete()
      .where('matchID', matchID);

    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('match-repo');
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
};
  
  const findCount = async () => {
    const [count] = await getKnex()(tables.match)
      .count();
    return count['count(*)'];
  };

  module.exports = {
    findAll,
    findByID,
    updateByID,
    findMatchByPlayers,
    create,
    deleteById,
    findCount,
  };