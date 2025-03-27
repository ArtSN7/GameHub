import db from '../database/db.js';

const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const getOneQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Initialize bonuses for a user
export const initializeBonuses = async (userId) => {
  const query = 'INSERT INTO bonuses (userId) VALUES (?)';
  const result = await runQuery(query, [userId]);
  return result.lastID;
};

// Get bonuses for a user
export const getBonusesByUserId = async (userId) => {
  const query = 'SELECT * FROM bonuses WHERE userId = ?';
  return await getOneQuery(query, [userId]);
};

// Update bonuses (e.g., after collecting a bonus)
export const updateBonuses = async (userId, bonusType, promoCode = null) => {
  const bonuses = await getBonusesByUserId(userId);
  if (!bonuses) {
    throw new Error('Bonuses not found for user');
  }

  let query = '';
  const params = [];
  switch (bonusType) {
    case 'daily':
      query = 'UPDATE bonuses SET dailyBonusCollected = ? WHERE userId = ?';
      params.push(bonuses.dailyBonusCollected + 1);
      break;
    case 'weekly':
      query = 'UPDATE bonuses SET weeklyBonusCollected = ? WHERE userId = ?';
      params.push(bonuses.weeklyBonusCollected + 1);
      break;
    case 'special':
      query = 'UPDATE bonuses SET specialBonusesCollected = ? WHERE userId = ?';
      params.push(bonuses.specialBonusesCollected + 1);
      break;
    case 'promoCode':
      query = 'UPDATE bonuses SET promoCodeUsed = ? WHERE userId = ?';
      params.push(promoCode);
      break;
    default:
      throw new Error('Invalid bonus type');
  }
  params.push(userId);
  await runQuery(query, params);
};