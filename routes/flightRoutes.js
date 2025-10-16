import express from 'express';
import { createFlight, getFlights, getFlightById, updateFlight, deleteFlight } from '../controllers/flightController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { uploadSingle } from '../middlewares/upload.js';

const router = express.Router();

router.get('/', getFlights);
router.get('/:id', getFlightById);

// Admin protected create/update/delete
router.post('/', protect, authorize('admin'), uploadSingle('image'), createFlight);
router.put('/:id', protect, authorize('admin'), uploadSingle('image'), updateFlight);
router.delete('/:id', protect, authorize('admin'), deleteFlight);

export default router;
