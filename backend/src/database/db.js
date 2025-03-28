import sqlite3 from 'sqlite3';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the SQLite database file
const dbPath = resolve(__dirname, './gamehob.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Enable foreign key support
db.run('PRAGMA foreign_keys = ON;');

// Create tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telegramId TEXT UNIQUE,
      username TEXT NOT NULL UNIQUE,
      balance REAL NOT NULL DEFAULT 5000.0,
      level INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Game stats table
  db.run(`
    CREATE TABLE IF NOT EXISTS game_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      blackjackGamesPlayed INTEGER DEFAULT 0,
      blackjackWins INTEGER DEFAULT 0,
      blackjackTotalWin REAL DEFAULT 0.0,
      slotsPlayed INTEGER DEFAULT 0,
      slotsWins INTEGER DEFAULT 0,
      slotsTotalWin REAL DEFAULT 0.0,
      texasHoldemPlayed INTEGER DEFAULT 0,
      texasHoldemWins INTEGER DEFAULT 0,
      texasHoldemTotalWin REAL DEFAULT 0.0,
      scratchCardPlayed INTEGER DEFAULT 0,
      scratchCardWins INTEGER DEFAULT 0,
      scratchCardTotalWin REAL DEFAULT 0.0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating game_stats table:', err.message);
    } else {
      console.log('Game_stats table created or already exists');
    }
  });

  // Bonuses table
  db.run(`
    CREATE TABLE IF NOT EXISTS bonuses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      dailyBonusCollected INTEGER DEFAULT 0,
      weeklyBonusCollected INTEGER DEFAULT 0,
      specialBonusesCollected INTEGER DEFAULT 0,
      promoCodeUsed TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating bonuses table:', err.message);
    } else {
      console.log('Bonuses table created or already exists');
    }
  });
});

// Export the database connection
export default db;