import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadSingle } from '../middlewares/upload.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, uploadSingle('profilePicture'), updateProfile);

export default router;
