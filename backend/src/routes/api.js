import express from 'express';
import asyncHandler from 'express-async-handler';
import { AppError } from '../errors/AppError.js';
import { createUser, getAllUsers, getUserById, getUserByUsername, getUserByTelegramId, updateUserBalance, updateUserProfile, updateUserLevel, deleteUser } from '../models/User.js';
import { initializeGameStats, getGameStatsByUserId, updateGameStats } from '../models/GameStats.js';
import { initializeBonuses, getBonusesByUserId, updateBonuses } from '../models/Bonus.js';

const router = express.Router();

// Sync Telegram user
router.post('/sync_user', asyncHandler(async (req, res) => {
  const { telegramId, username } = req.body;
  if (!telegramId || !username) {
    throw new AppError('telegramId and username are required', 400);
  }
  let user = await getUserByTelegramId(telegramId);
  if (!user) {
    const userId = await createUser(telegramId, username);
    await initializeGameStats(userId);
    await initializeBonuses(userId);
    user = await getUserById(userId);
  }
  const stats = await getGameStatsByUserId(user.id);
  const bonuses = await getBonusesByUserId(user.id);

  // Compute total_wins and total_games
  const total_wins = (stats.blackjackWins || 0) + (stats.slotsWins || 0) + (stats.texasHoldemWins || 0) + (stats.scratchCardWins || 0);
  const total_games = (stats.blackjackGamesPlayed || 0) + (stats.slotsPlayed || 0) + (stats.texasHoldemPlayed || 0) + (stats.scratchCardPlayed || 0);

  res.json({ ...user, stats, bonuses, total_wins, total_games });
}));

// User routes
router.post('/users', asyncHandler(async (req, res) => {
  const { username, balance } = req.body;
  if (!username) {
    throw new AppError('Username is required', 400);
  }
  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    throw new AppError('Username already exists', 400);
  }
  const userId = await createUser(null, username, balance || 5000.0);
  await initializeGameStats(userId);
  await initializeBonuses(userId);
  const user = await getUserById(userId);
  res.status(201).json(user);
}));

router.get('/users', asyncHandler(async (req, res) => {
  const users = await getAllUsers();
  if (!users.length) {
    throw new AppError('No users found', 404);
  }
  res.json(users);
}));

router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  const stats = await getGameStatsByUserId(user.id);
  const bonuses = await getBonusesByUserId(user.id);

  // Compute total_wins and total_games
  const total_wins = (stats.blackjackWins || 0) + (stats.slotsWins || 0) + (stats.texasHoldemWins || 0) + (stats.scratchCardWins || 0);
  const total_games = (stats.blackjackGamesPlayed || 0) + (stats.slotsPlayed || 0) + (stats.texasHoldemPlayed || 0) + (stats.scratchCardPlayed || 0);

  res.json({ ...user, stats, bonuses, total_wins, total_games });
}));

router.put('/users/:id/balance', asyncHandler(async (req, res) => {
  const { balance } = req.body;
  if (typeof balance !== 'number') {
    throw new AppError('Balance must be a number', 400);
  }
  const user = await getUserById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  await updateUserBalance(req.params.id, balance);
  const updatedUser = await getUserById(req.params.id);
  res.json(updatedUser);
}));

router.put('/users/:id/profile', asyncHandler(async (req, res) => {
  const { level, rating, hoursPlayed } = req.body;
  const user = await getUserById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  if (typeof level !== 'number' || typeof rating !== 'number' || typeof hoursPlayed !== 'number') {
    throw new AppError('level, rating, and hoursPlayed must be numbers', 400);
  }
  await updateUserProfile(req.params.id, level, rating, hoursPlayed);
  const updatedUser = await getUserById(req.params.id);
  res.json(updatedUser);
}));

router.delete('/users/:id', asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  await deleteUser(req.params.id);
  res.status(204).send();
}));

// Game stats routes
router.post('/users/:id/game', asyncHandler(async (req, res) => {
  const { gameType, played, won, totalWin } = req.body;
  const user = await getUserById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  if (!['blackjack', 'slots', 'texasHoldem', 'scratchCard'].includes(gameType)) {
    throw new AppError('Invalid game type', 400);
  }
  if (typeof played !== 'number' || typeof won !== 'number' || typeof totalWin !== 'number') {
    throw new AppError('played, won, and totalWin must be numbers', 400);
  }
  await updateGameStats(user.id, gameType, played, won, totalWin);
  const stats = await getGameStatsByUserId(user.id);

  // Compute total_games and update level
  const total_games = (stats.blackjackGamesPlayed || 0) + (stats.slotsPlayed || 0) + (stats.texasHoldemPlayed || 0) + (stats.scratchCardPlayed || 0);
  await updateUserLevel(user.id, total_games);

  // Fetch updated user data
  const updatedUser = await getUserById(user.id);
  res.json({ ...updatedUser, stats });
}));

// Bonus routes
router.post('/users/:id/bonus', asyncHandler(async (req, res) => {
  const { bonusType, promoCode } = req.body;
  const user = await getUserById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  if (!['daily', 'weekly', 'special', 'promoCode'].includes(bonusType)) {
    throw new AppError('Invalid bonus type', 400);
  }
  if (bonusType === 'promoCode' && !promoCode) {
    throw new AppError('Promo code is required', 400);
  }
  await updateBonuses(user.id, bonusType, promoCode);
  const bonuses = await getBonusesByUserId(user.id);
  res.json(bonuses);
}));

export default router;