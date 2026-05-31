const express = require('express');
const router = express.Router();
const Transport = require('../models/Transport');
const { protect, adminOnly } = require('../middleware/auth');

// Search transport
router.get('/search', async (req, res) => {
  try {
    const { from, to, type, date, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    if (from) query.from = new RegExp(from, 'i');
    if (to) query.to = new RegExp(to, 'i');
    if (type) query.type = type;
    const total = await Transport.countDocuments(query);
    const transports = await Transport.find(query).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, total, transports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const query = { isActive: true };
    if (type) query.type = type;
    const transports = await Transport.find(query);
    res.json({ success: true, transports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single
router.get('/:id', async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id);
    if (!transport) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, transport });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const transport = await Transport.create(req.body);
    res.status(201).json({ success: true, transport });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Seed transport data
router.post('/seed/data', protect, adminOnly, async (req, res) => {
  try {
    const sampleTransport = [
      {
        type: 'bus', name: 'APSRTC Super Luxury', number: 'AP3456',
        from: 'Hyderabad', to: 'Tirupati',
        departureTime: '06:00 AM', arrivalTime: '12:00 PM', duration: '6h',
        price: 650, totalSeats: 40, availableSeats: 28,
        amenities: ['AC', 'WiFi', 'Charging Port', 'Water Bottle'],
        operator: 'APSRTC', rating: 4.2,
        classes: [{ name: 'Sleeper', price: 850, available: 10 }, { name: 'Seater', price: 650, available: 18 }]
      },
      {
        type: 'train', name: 'Tirupati Express', number: '12567',
        from: 'Chennai', to: 'Tirupati',
        departureTime: '07:30 AM', arrivalTime: '10:45 AM', duration: '3h 15m',
        price: 220, totalSeats: 200, availableSeats: 85,
        amenities: ['Pantry Car', 'Blanket', 'Bedroll'],
        operator: 'Indian Railways', rating: 4.0,
        classes: [{ name: '2A', price: 720, available: 20 }, { name: '3A', price: 480, available: 35 }, { name: 'Sleeper', price: 220, available: 30 }]
      },
      {
        type: 'flight', name: 'IndiGo', number: '6E-453',
        from: 'Delhi', to: 'Tirupati',
        departureTime: '08:15 AM', arrivalTime: '11:30 AM', duration: '3h 15m',
        price: 3200, totalSeats: 180, availableSeats: 45,
        amenities: ['Meal Available', 'Entertainment', 'USB Charging'],
        operator: 'IndiGo Airlines', rating: 4.1,
        classes: [{ name: 'Economy', price: 3200, available: 35 }, { name: 'Business', price: 8500, available: 10 }]
      },
      {
        type: 'bus', name: 'VRL Travels Volvo', number: 'VRL-789',
        from: 'Bangalore', to: 'Mumbai',
        departureTime: '09:00 PM', arrivalTime: '08:00 AM', duration: '11h',
        price: 1200, totalSeats: 36, availableSeats: 12,
        amenities: ['AC', 'Blanket', 'Pillow', 'Charging Port', 'Entertainment'],
        operator: 'VRL Travels', rating: 4.4,
        classes: [{ name: 'Sleeper', price: 1200, available: 12 }]
      },
      {
        type: 'train', name: 'Rajdhani Express', number: '12951',
        from: 'Mumbai', to: 'Delhi',
        departureTime: '04:55 PM', arrivalTime: '08:35 AM', duration: '15h 40m',
        price: 1350, totalSeats: 300, availableSeats: 120,
        amenities: ['Meals Included', 'Bedroll', 'AC', 'Charging'],
        operator: 'Indian Railways', rating: 4.5,
        classes: [{ name: '1A', price: 4200, available: 10 }, { name: '2A', price: 2400, available: 30 }, { name: '3A', price: 1350, available: 80 }]
      },
      {
        type: 'flight', name: 'Air India', number: 'AI-202',
        from: 'Mumbai', to: 'Amritsar',
        departureTime: '06:45 AM', arrivalTime: '09:15 AM', duration: '2h 30m',
        price: 4500, totalSeats: 200, availableSeats: 67,
        amenities: ['Meal Included', 'Entertainment', 'WiFi'],
        operator: 'Air India', rating: 3.9,
        classes: [{ name: 'Economy', price: 4500, available: 57 }, { name: 'Business', price: 12000, available: 10 }]
      },
    ];
    await Transport.deleteMany({});
    const transports = await Transport.insertMany(sampleTransport);
    res.json({ success: true, message: `${transports.length} transports seeded` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
