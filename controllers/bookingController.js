import Booking from '../models/Booking.js';
import Flight from '../models/Flight.js';
import mongoose from 'mongoose';

// Create booking (atomic seat decrement)
// controllers/bookingController.js
export const createBooking = async (req, res) => {
  try {
    const { flightId, passengers, seatNumbers } = req.body;

    if (!flightId || !passengers || !seatNumbers) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const booking = await Booking.create({
      user: req.user.id, // extracted from auth middleware
      flight: flightId,
      passengers,
      seatNumbers,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    let bookings;

    if (req.user.role === "admin") {
      // Admin gets all bookings
      bookings = await Booking.find()
        .populate("user", "name email")
        .populate("flight");
    } else {
      // Normal user gets only their bookings
      bookings = await Booking.find({ user: req.user.id })
        .populate("flight")
        .populate("user", "name email");
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get booking by id (owner or admin)
export const getBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('flight').populate('user', 'name email');
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Forbidden' });
  res.json({ booking });
};

// list user's bookings
export const listUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('flight');
  res.json({ count: bookings.length, bookings });
};

// user requests cancellation
export const requestCancellation = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (booking.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not owner' });
  if (booking.status !== 'booked') return res.status(400).json({ message: 'Cannot request cancellation' });
  booking.status = 'cancel_requested';
  booking.cancellationRequestedAt = new Date();
  await booking.save();
  res.json({ booking });
};

// admin cancels and marks refunded (increments seats)
export const adminCancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (booking.status === 'cancelled' || booking.status === 'refunded') return res.status(400).json({ message: 'Already cancelled/refunded' });

  // increment seats
  const flight = await Flight.findByIdAndUpdate(booking.flight, { $inc: { availableSeats: booking.seatsBooked } }, { new: true });
  booking.status = 'cancelled';
  await booking.save();

  // mark refunded (logical)
  booking.status = 'refunded';
  await booking.save();

  res.json({ booking, flight });
};
