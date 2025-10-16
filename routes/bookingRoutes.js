import express from 'express';
import { createBooking, getBooking, requestCancellation, adminCancelBooking, listUserBookings,getAllBookings } from '../controllers/bookingController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/profile', protect, listUserBookings);
router.get("/", protect, getAllBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, requestCancellation); // user requests cancellation
router.put('/:id/admin-cancel', protect, authorize('admin'), adminCancelBooking); // admin processes cancellation

export default router;
