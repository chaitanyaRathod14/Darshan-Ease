const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  class: { type: String, default: 'general' },
  isBooked: { type: Boolean, default: false },
  price: { type: Number, required: true },
});

const transportSchema = new mongoose.Schema({
  type: { type: String, enum: ['bus', 'train', 'flight'], required: true },
  name: { type: String, required: true },
  number: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  seats: [seatSchema],
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  amenities: [{ type: String }],
  operator: { type: String, default: '' },
  rating: { type: Number, default: 4.0 },
  isActive: { type: Boolean, default: true },
  classes: [{
    name: String,
    price: Number,
    available: Number,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Transport', transportSchema);
