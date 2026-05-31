const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  time: { type: String, required: true },
  capacity: { type: Number, required: true },
  booked: { type: Number, default: 0 },
  price: { type: Number, required: true },
  poojaType: { type: String, required: true },
});

const templeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  images: [{ type: String }],
  deity: { type: String, required: true },
  openTime: { type: String, default: '06:00 AM' },
  closeTime: { type: String, default: '09:00 PM' },
  slots: [slotSchema],
  facilities: [{ type: String }],
  dresscode: { type: String, default: '' },
  rating: { type: Number, default: 4.0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Temple', templeSchema);
