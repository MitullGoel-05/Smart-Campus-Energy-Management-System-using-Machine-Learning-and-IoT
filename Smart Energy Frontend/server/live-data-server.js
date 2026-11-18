import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.LIVE_DATA_PORT || 3001;
const CSV_SOURCE = process.env.LIVE_DATA_PATH || 'C\\\\Users\\\\DELL\\\\Desktop\\\\SmartEnergy\\\\live_data.csv';

app.use(cors());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/live_data.csv', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  fs.access(CSV_SOURCE, fs.constants.R_OK, (err) => {
    if (err) {
      res.status(404).send('CSV not found or not readable');
      return;
    }
    res.sendFile(path.resolve(CSV_SOURCE));
  });
});

app.listen(PORT, () => {
  console.log(`[live-data-server] Serving ${CSV_SOURCE} on http://localhost:${PORT}/live_data.csv`);
});
