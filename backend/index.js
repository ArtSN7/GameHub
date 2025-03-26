import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000; // Use a different port than the frontend

app.use(cors()); // Allow frontend to make requests
app.use(express.json());

// API Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend API!' });
});

app.post('/api/data', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  res.json({ message: `Hello, ${name}!` });
});

app.get('/health', (req, res) => {
  console.log('Health check received');
  res.status(200).send('OK');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server running on port ${port}`);
}).on('error', (err) => {
  console.error('Server error:', err.message);
  process.exit(1);
});