import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  passportNumber: { type: String, required: true }
});

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    flight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight",
      required: true
    },
    passengers: {
      type: [passengerSchema],
      required: true
    },
    seatNumbers: {
      type: [String],
      required: true
    },
    status: {
      type: String,
      enum: ["booked", "cancelled"],
      default: "booked"
    },
    bookingDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);