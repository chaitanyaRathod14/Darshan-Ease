const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');

// Get all users (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get user dashboard stats
router.get('/dashboard', protect, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments({ user: req.user._id });
    const confirmedBookings = await Booking.countDocuments({ user: req.user._id, status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ user: req.user._id, status: 'cancelled' });
    const templeBookings = await Booking.countDocuments({ user: req.user._id, bookingType: 'temple' });
    const transportBookings = await Booking.countDocuments({ user: req.user._id, bookingType: { $ne: 'temple' } });

    const recentBookings = await Booking.find({ user: req.user._id })
      .populate('temple', 'name city image')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: { totalBookings, confirmedBookings, cancelledBookings, templeBookings, transportBookings },
      recentBookings,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin dashboard stats
router.get('/admin/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    res.json({
      success: true,
      stats: {
        totalUsers, totalBookings, confirmedBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
