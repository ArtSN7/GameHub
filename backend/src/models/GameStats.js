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

// Initialize game stats for a user
export const initializeGameStats = async (userId) => {
  const query = 'INSERT INTO game_stats (userId) VALUES (?)';
  const result = await runQuery(query, [userId]);
  return result.lastID;
};

// Get game stats for a user
export const getGameStatsByUserId = async (userId) => {
  const query = 'SELECT * FROM game_stats WHERE userId = ?';
  return await getOneQuery(query, [userId]);
};

// Update game stats (e.g., after a game is played)
export const updateGameStats = async (userId, gameType, played, won, totalWin) => {
  const stats = await getGameStatsByUserId(userId);
  if (!stats) {
    throw new Error('Game stats not found for user');
  }

  let query = '';
  const params = [];
  switch (gameType) {
    case 'blackjack':
      query = `
        UPDATE game_stats 
        SET blackjackGamesPlayed = ?, blackjackWins = ?, blackjackTotalWin = ?
        WHERE userId = ?
      `;
      params.push(stats.blackjackGamesPlayed + (played || 0));
      params.push(stats.blackjackWins + (won || 0));
      params.push(stats.blackjackTotalWin + (totalWin || 0));
      break;
    case 'slots':
      query = `
        UPDATE game_stats 
        SET slotsPlayed = ?, slotsWins = ?, slotsTotalWin = ?
        WHERE userId = ?
      `;
      params.push(stats.slotsPlayed + (played || 0));
      params.push(stats.slotsWins + (won || 0));
      params.push(stats.slotsTotalWin + (totalWin || 0));
      break;
    case 'texasHoldem':
      query = `
        UPDATE game_stats 
        SET texasHoldemPlayed = ?, texasHoldemWins = ?, texasHoldemTotalWin = ?
        WHERE userId = ?
      `;
      params.push(stats.texasHoldemPlayed + (played || 0));
      params.push(stats.texasHoldemWins + (won || 0));
      params.push(stats.texasHoldemTotalWin + (totalWin || 0));
      break;
    case 'scratchCard':
      query = `
        UPDATE game_stats 
        SET scratchCardPlayed = ?, scratchCardWins = ?, scratchCardTotalWin = ?
        WHERE userId = ?
      `;
      params.push(stats.scratchCardPlayed + (played || 0));
      params.push(stats.scratchCardWins + (won || 0));
      params.push(stats.scratchCardTotalWin + (totalWin || 0));
      break;
    default:
      throw new Error('Invalid game type');
  }
  params.push(userId);
  await runQuery(query, params);
};