import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

console.log('Starting server...');
console.log('Current directory:', __dirname);
console.log('Looking for dist folder at:', path.join(__dirname, 'dist'));

app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filepath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filepath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    }
  }
}));

app.get('*', (req, res) => {
  console.log('Request received:', req.url);
  const filePath = path.join(__dirname, 'dist', 'index.html');
  if (!filePath) {
    console.error('dist/index.html not found');
    res.status(500).send('Server error: index.html missing');
    return;
  }
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Server error');
    }
  });
});

app.get('/health', (req, res) => {
  console.log('Health check received');
  res.status(200).send('OK');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
}).on('error', (err) => {
  console.error('Server error:', err.message);
});


// https://localhost:3000/