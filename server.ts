import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
// @ts-ignore
import healthHandler from './api/health.js';
// @ts-ignore
import busArrivalHandler from './api/bus-arrival.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Mount Serverless / API handlers
app.all('/api/health', async (req, res) => {
  try {
    await healthHandler(req, res);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', message: err?.message || String(err) });
  }
});

app.all('/api/bus-arrival', async (req, res) => {
  try {
    await busArrivalHandler(req, res);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal Server Error', message: err?.message || String(err) });
  }
});

async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SBS Transit Gateway running on http://0.0.0.0:${PORT}`);
  });
}

start();
