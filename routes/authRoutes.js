import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadSingle } from '../middlewares/upload.js';

const router = express.Router();

// register (optional profilePicture)
router.post('/register', uploadSingle('profilePicture'), register);
router.post('/login', login);
router.post('/logout', protect, logout);

export default router;
