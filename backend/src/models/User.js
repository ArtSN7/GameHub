import db from '../database/db.js';

// Helper functions to promisify SQLite queries
const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const getQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
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

// Calculate level based on total games played
const calculateLevel = (totalGames) => {
  return Math.floor(Math.sqrt(totalGames / 10)) + 1;
};

// CRUD functions for users
export const createUser = async (telegramId, username, balance = 0.0) => {
  const query = 'INSERT INTO users (telegramId, username, balance) VALUES (?, ?, ?)';
  const params = [telegramId, username, balance];
  const result = await runQuery(query, params);
  return result.lastID;
};

export const getAllUsers = async () => {
  const query = 'SELECT * FROM users';
  return await getQuery(query);
};

export const getUserById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  return await getOneQuery(query, [id]);
};

export const getUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = ?';
  return await getOneQuery(query, [username]);
};

export const getUserByTelegramId = async (telegramId) => {
  const query = 'SELECT * FROM users WHERE telegramId = ?';
  return await getOneQuery(query, [telegramId]);
};

export const updateUserBalance = async (id, balance) => {
  const query = 'UPDATE users SET balance = ? WHERE id = ?';
  await runQuery(query, [balance, id]);
};

export const updateUserProfile = async (id, level, rating, hoursPlayed) => {
  const query = 'UPDATE users SET level = ?, rating = ?, hoursPlayed = ? WHERE id = ?';
  const params = [level, rating, hoursPlayed, id];
  await runQuery(query, params);
};

export const updateUserLevel = async (id, totalGames) => {
  const level = calculateLevel(totalGames);
  const query = 'UPDATE users SET level = ? WHERE id = ?';
  await runQuery(query, [level, id]);
};

export const deleteUser = async (id) => {
  const query = 'DELETE FROM users WHERE id = ?';
  await runQuery(query, [id]);
};

// Get or create a user by telegramId
export const getOrCreateUserByTelegramId = async (telegramId, username) => {
  let user = await getUserByTelegramId(telegramId);
  if (!user) {
    const userId = await createUser(telegramId, username);
    user = await getUserById(userId);
  } else if (user.username !== username) {
    await runQuery('UPDATE users SET username = ? WHERE telegramId = ?', [username, telegramId]);
    user = await getUserByTelegramId(telegramId);
  }
  return user;
};