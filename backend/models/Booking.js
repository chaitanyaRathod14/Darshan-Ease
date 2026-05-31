const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, default: () => 'BK' + uuidv4().slice(0, 8).toUpperCase(), unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingType: { type: String, enum: ['temple', 'bus', 'train', 'flight'], required: true },

  // Temple booking fields
  temple: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple' },
  visitDate: { type: Date },
  slot: { type: String },
  poojaType: { type: String },
  devotees: [{ name: String, age: Number, gender: String }],

  // Transport booking fields
  transport: { type: mongoose.Schema.Types.ObjectId, ref: 'Transport' },
  from: { type: String },
  to: { type: String },
  travelDate: { type: Date },
  passengers: [{ name: String, age: Number, gender: String, seatNumber: String }],
  class: { type: String },

  // Common fields
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, default: '' },
  status: { type: String, enum: ['confirmed', 'cancelled', 'pending', 'completed'], default: 'pending' },
  qrCode: { type: String, default: '' },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
