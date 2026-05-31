const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Temple = require('../models/Temple');
const { protect, adminOnly } = require('../middleware/auth');

// Create booking
router.post('/', protect, async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, user: req.user._id });

    // Update temple slot availability if temple booking
    if (booking.bookingType === 'temple' && booking.temple) {
      const devoteeCount = booking.devotees ? booking.devotees.length : 1;
      await Temple.updateOne(
        { _id: booking.temple, 'slots.time': booking.slot },
        { $inc: { 'slots.$.booked': devoteeCount } }
      );
    }

    // Simulate payment
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.qrCode = `QR-${booking.bookingId}`;
    await booking.save();

    const populated = await booking.populate(['temple', 'transport']);
    res.status(201).json({ success: true, booking: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get user bookings
router.get('/my', protect, async (req, res) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };
    if (type) query.bookingType = type;
    if (status) query.status = status;
    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('temple', 'name location city image')
      .populate('transport', 'name number from to type')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single booking
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('temple')
      .populate('transport');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Cancel booking
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    if (booking.status === 'cancelled')
      return res.status(400).json({ success: false, message: 'Already cancelled' });
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: get all bookings
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await Booking.countDocuments();
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('temple', 'name city')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
