import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filepath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.get('*', (req, res) => {
  console.log('Request received:', req.url); // Debug incoming requests
  const filePath = path.join(__dirname, 'dist', 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port http://localhost:${port}`);
});