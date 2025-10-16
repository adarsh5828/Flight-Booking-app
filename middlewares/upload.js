import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, '..', UPLOAD_DIR);
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const fileFilter = (allowedExt = ['.png', '.jpg', '.jpeg', '.svg']) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExt.includes(ext)) {
    return cb(new Error('Invalid file type'), false);
  }
  cb(null, true);
};

export const uploadSingle = (fieldName, allowedExt) =>
  multer({ storage, fileFilter: fileFilter(allowedExt), limits: { fileSize: 5 * 1024 * 1024 } }).single(fieldName);

export const uploadMultiple = (fieldName, maxCount = 5, allowedExt) =>
  multer({ storage, fileFilter: fileFilter(allowedExt), limits: { fileSize: 5 * 1024 * 1024 } }).array(fieldName, maxCount);
