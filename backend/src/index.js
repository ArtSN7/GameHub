import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();
const port =  5000;

// Allow multiple origins
const allowedOrigins = [
  'https://web-production-3cb88.up.railway.app',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json());

// Mount the API routes
app.use('/api', apiRoutes);


// Error-handling middleware (must be after all routes)
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server running on port ${port}`);
}).on('error', (err) => {
  console.error('Server error:', err.message);
  process.exit(1);
});