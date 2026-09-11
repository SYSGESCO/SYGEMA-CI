import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Ensure server storage directory exists
  const DATA_DIR = path.join(process.cwd(), 'server_data');
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const DB_FILE = path.join(DATA_DIR, 'sygema_db.json');

  app.use(express.json({ limit: '50mb' }));

  // API: Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API: Get persistent database
  app.get('/api/data', (req, res) => {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const data = JSON.parse(raw);
        return res.json({ success: true, data, source: 'server_disk' });
      }
      return res.json({ success: true, data: null, source: 'empty' });
    } catch (error) {
      console.error('Error reading server data:', error);
      return res.status(500).json({ success: false, error: 'Failed to read server data' });
    }
  });

  // API: Save persistent database
  app.post('/api/data', (req, res) => {
    try {
      const payload = req.body;
      if (!payload || !payload.data) {
        return res.status(400).json({ success: false, error: 'Invalid payload: data object missing' });
      }

      // Write atomically using temporary file
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(payload.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);

      return res.json({
        success: true,
        savedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving server data:', error);
      return res.status(500).json({ success: false, error: 'Failed to save server data' });
    }
  });

  // API: Server Time endpoint (guaranteed sync for clocks)
  app.get('/api/time', (req, res) => {
    const now = new Date();
    res.json({
      timestamp: now.getTime(),
      iso: now.toISOString(),
      timezone: 'UTC',
    });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SYGEMA CI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
