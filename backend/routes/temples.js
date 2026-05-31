const express = require('express');
const router = express.Router();
const Temple = require('../models/Temple');
const { protect, adminOnly } = require('../middleware/auth');

// Get all temples
router.get('/', async (req, res) => {
  try {
    const { city, state, search, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    if (city) query.city = new RegExp(city, 'i');
    if (state) query.state = new RegExp(state, 'i');
    if (search) query.$or = [
      { name: new RegExp(search, 'i') },
      { deity: new RegExp(search, 'i') },
      { city: new RegExp(search, 'i') },
    ];
    const total = await Temple.countDocuments(query);
    const temples = await Temple.find(query).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, total, page: Number(page), temples });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get single temple
router.get('/:id', async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });
    res.json({ success: true, temple });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create temple (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const temple = await Temple.create(req.body);
    res.status(201).json({ success: true, temple });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update temple (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const temple = await Temple.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });
    res.json({ success: true, temple });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete temple (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Temple.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Temple deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Seed sample temples
router.post('/seed/data', protect, adminOnly, async (req, res) => {
  try {
    const sampleTemples = [
      {
        name: 'Tirupati Balaji Temple', location: 'Tirumala, Tirupati', state: 'Andhra Pradesh',
        city: 'Tirupati', deity: 'Lord Venkateswara', description: 'One of the most visited temples in the world, dedicated to Lord Venkateswara.',
        openTime: '02:30 AM', closeTime: '11:30 PM', rating: 4.9, totalReviews: 50000,
        facilities: ['Prasadam', 'Accommodation', 'Cloak Room', 'Medical', 'Wheelchair'],
        dresscode: 'Traditional attire mandatory. Dhoti for men, saree/churidar for women.',
        tags: ['popular', 'vishnu', 'south-india'],
        slots: [
          { time: '06:00 AM', capacity: 500, price: 300, poojaType: 'Special Entry Darshan' },
          { time: '09:00 AM', capacity: 1000, price: 150, poojaType: 'General Darshan' },
          { time: '12:00 PM', capacity: 800, price: 150, poojaType: 'General Darshan' },
          { time: '03:00 PM', capacity: 600, price: 200, poojaType: 'Seeghra Darshan' },
          { time: '06:00 PM', capacity: 400, price: 300, poojaType: 'Special Entry Darshan' },
        ]
      },
      {
        name: 'Vaishno Devi Temple', location: 'Katra, Reasi', state: 'Jammu & Kashmir',
        city: 'Katra', deity: 'Goddess Vaishno Devi', description: 'A sacred Hindu temple dedicated to Goddess Vaishno Devi, located in the Trikuta Mountains.',
        openTime: '05:00 AM', closeTime: '10:00 PM', rating: 4.8, totalReviews: 35000,
        facilities: ['Langar', 'Helicopter Service', 'Medical', 'Cloak Room'],
        tags: ['popular', 'devi', 'north-india'],
        slots: [
          { time: '05:00 AM', capacity: 300, price: 0, poojaType: 'Free Darshan' },
          { time: '08:00 AM', capacity: 500, price: 200, poojaType: 'Priority Darshan' },
          { time: '11:00 AM', capacity: 400, price: 200, poojaType: 'Priority Darshan' },
          { time: '02:00 PM', capacity: 300, price: 0, poojaType: 'Free Darshan' },
        ]
      },
      {
        name: 'Siddhivinayak Temple', location: 'Prabhadevi, Mumbai', state: 'Maharashtra',
        city: 'Mumbai', deity: 'Lord Ganesha', description: 'Famous Ganesha temple in Mumbai, one of the richest temples in India.',
        openTime: '05:30 AM', closeTime: '09:50 PM', rating: 4.7, totalReviews: 28000,
        facilities: ['Prasadam', 'Medical', 'CCTV Surveillance', 'Online Booking'],
        tags: ['ganesha', 'west-india', 'popular'],
        slots: [
          { time: '05:30 AM', capacity: 200, price: 0, poojaType: 'Morning Darshan' },
          { time: '09:00 AM', capacity: 300, price: 250, poojaType: 'VIP Darshan' },
          { time: '12:00 PM', capacity: 400, price: 0, poojaType: 'General Darshan' },
          { time: '06:00 PM', capacity: 350, price: 250, poojaType: 'Evening VIP Darshan' },
        ]
      },
      {
        name: 'Golden Temple', location: 'Amritsar', state: 'Punjab',
        city: 'Amritsar', deity: 'Sri Harmandir Sahib', description: 'The holiest shrine in Sikhism, known as Harmandir Sahib, the Golden Temple is a symbol of brotherhood and equality.',
        openTime: '04:00 AM', closeTime: '11:00 PM', rating: 4.9, totalReviews: 45000,
        facilities: ['Langar (Free Food)', 'Sarovar Bath', 'Cloak Room', 'Library'],
        tags: ['sikh', 'north-india', 'popular', 'free'],
        slots: [
          { time: '04:00 AM', capacity: 1000, price: 0, poojaType: 'Free Darshan' },
          { time: '08:00 AM', capacity: 2000, price: 0, poojaType: 'Free Darshan' },
          { time: '12:00 PM', capacity: 2000, price: 0, poojaType: 'Free Darshan' },
          { time: '06:00 PM', capacity: 1500, price: 0, poojaType: 'Evening Darshan' },
        ]
      },
      {
        name: 'Meenakshi Amman Temple', location: 'Madurai', state: 'Tamil Nadu',
        city: 'Madurai', deity: 'Goddess Meenakshi', description: 'A historic Hindu temple on the southern bank of Vaigai River in Madurai, dedicated to Goddess Meenakshi.',
        openTime: '05:00 AM', closeTime: '09:30 PM', rating: 4.8, totalReviews: 30000,
        facilities: ['Prasadam', 'Audio Guide', 'Wheelchair', 'Cloak Room'],
        dresscode: 'Traditional South Indian attire preferred.',
        tags: ['south-india', 'devi', 'historic'],
        slots: [
          { time: '05:00 AM', capacity: 400, price: 0, poojaType: 'Free Darshan' },
          { time: '09:00 AM', capacity: 500, price: 100, poojaType: 'Special Darshan' },
          { time: '05:00 PM', capacity: 600, price: 100, poojaType: 'Evening Aarti' },
        ]
      },
    ];
    await Temple.deleteMany({});
    const temples = await Temple.insertMany(sampleTemples);
    res.json({ success: true, message: `${temples.length} temples seeded`, temples });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
