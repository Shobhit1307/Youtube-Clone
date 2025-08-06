import multer from 'multer';
import path from 'path';
import fs from 'fs';

const dir = path.resolve('uploads/videos');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

export const uploadVideo = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) =>
      cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
  }),
  limits: { fileSize: 500 * 1024 * 1024 } // 500 MB max
}).single('videoFile');
