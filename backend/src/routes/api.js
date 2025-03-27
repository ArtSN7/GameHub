import express from 'express';
import { AppError } from '../errors/AppError.js';

export class AppError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
      this.name = 'ApiError';
    }
  }

const router = express.Router();

router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from the backend API!' });
});

router.post('/data', (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return next(new AppError('Name is required', 400));
  }
  res.json({ message: `Hello, ${name}!` });
});

router.get('/health', (req, res) => {
  console.log('Health check received');
  res.status(200).send('OK');
});

// Route to simulate an error
router.get('/error', (req, res, next) => {
  throw new AppError('Simulated error', 500);
});

export default router;