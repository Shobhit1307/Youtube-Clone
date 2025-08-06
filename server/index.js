import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import apiAuth from './routes/authRoutes.js';
import apiVideo from './routes/videoRoutes.js';
import apiChannel from './routes/channelRoutes.js';
import apiComments from './routes/commentRoutes.js';
import { connectDB } from './config/db.js';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());

app.use(express.json());
await connectDB(process.env.MONGO_URI);

// Streaming endpoint — must be before API routes
app.get('/uploads/videos/:filename', (req, res) => {
  const filePath = path.join(__dirname, '/uploads/videos', req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).send('Video not found');

  const stat = fs.statSync(filePath);
  const total = stat.size;
  const range = req.headers.range;
  if (!range) return res.status(416).send('Requires Range header');

  const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
  const start = parseInt(startStr, 10);
  const end = endStr ? parseInt(endStr, 10) : total - 1;
  if (start >= total) return res.status(416).send('Range start out of bounds');

  const chunkSize = end - start + 1;
  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${total}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'video/mp4',
  });
  fs.createReadStream(filePath, { start, end }).pipe(res);
});

// // API Route mounts
app.use('/api/auth', apiAuth);
app.use('/api/videos', apiVideo);
app.use('/api/channels', apiChannel);
app.use('/api/videos/:videoId/comments', apiComments);

// Catch-all fallback — named wildcard is required in Express 5
app.all('/*splat', (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
