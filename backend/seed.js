/**
 * DarshanEase - Database Seed Script
 * Run: node seed.js
 * Creates admin user + sample temples + transport data
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/darshanease';

// ── Inline schemas (avoids import issues) ──────────────────────────────────
const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, phone: String,
  password: String, role: { type: String, default: 'user' },
}, { timestamps: true });

const slotSchema = new mongoose.Schema({
  time: String, capacity: Number, booked: { type: Number, default: 0 },
  price: Number, poojaType: String,
});
const templeSchema = new mongoose.Schema({
  name: String, location: String, state: String, city: String,
  description: String, image: String, deity: String,
  openTime: String, closeTime: String, slots: [slotSchema],
  facilities: [String], dresscode: String,
  rating: Number, totalReviews: Number, isActive: { type: Boolean, default: true }, tags: [String],
}, { timestamps: true });

const transportSchema = new mongoose.Schema({
  type: String, name: String, number: String, from: String, to: String,
  departureTime: String, arrivalTime: String, duration: String,
  price: Number, totalSeats: Number, availableSeats: Number,
  amenities: [String], operator: String, rating: Number,
  isActive: { type: Boolean, default: true },
  classes: [{ name: String, price: Number, available: Number }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Temple = mongoose.model('Temple', templeSchema);
const Transport = mongoose.model('Transport', transportSchema);

// ── Data ───────────────────────────────────────────────────────────────────
const temples = [
  {
    name: 'Tirupati Balaji Temple', location: 'Tirumala, Tirupati', state: 'Andhra Pradesh',
    city: 'Tirupati', deity: 'Lord Venkateswara',
    description: 'One of the most visited religious sites in the world, Tirumala Tirupati Devasthanams is dedicated to Lord Venkateswara. Millions of devotees visit this sacred temple every year seeking blessings.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Tirupati_temple.jpg/640px-Tirupati_temple.jpg',
    openTime: '02:30 AM', closeTime: '11:30 PM', rating: 4.9, totalReviews: 50000,
    facilities: ['Prasadam', 'Accommodation', 'Cloak Room', 'Medical', 'Wheelchair', 'Online Booking'],
    dresscode: 'Traditional attire mandatory. Dhoti/Kurta for men, Saree/Churidar for women.',
    tags: ['popular', 'vishnu', 'south-india'],
    slots: [
      { time: '06:00 AM', capacity: 500, price: 300, poojaType: 'Special Entry Darshan' },
      { time: '09:00 AM', capacity: 1000, price: 150, poojaType: 'General Darshan' },
      { time: '12:00 PM', capacity: 800, price: 150, poojaType: 'General Darshan' },
      { time: '03:00 PM', capacity: 600, price: 200, poojaType: 'Seeghra Darshan' },
      { time: '06:00 PM', capacity: 400, price: 300, poojaType: 'Special Entry Darshan' },
    ],
  },
  {
    name: 'Vaishno Devi Temple', location: 'Katra, Reasi', state: 'Jammu & Kashmir',
    city: 'Katra', deity: 'Goddess Vaishno Devi',
    description: 'A sacred Hindu temple dedicated to Goddess Vaishno Devi, located in the Trikuta Mountains. The temple is one of the most visited pilgrimages in India, drawing millions annually.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Vaishno_Devi_Temple.jpg/640px-Vaishno_Devi_Temple.jpg',
    openTime: '05:00 AM', closeTime: '10:00 PM', rating: 4.8, totalReviews: 35000,
    facilities: ['Langar', 'Helicopter Service', 'Medical', 'Cloak Room', 'Battery Car'],
    tags: ['popular', 'devi', 'north-india'],
    slots: [
      { time: '05:00 AM', capacity: 300, price: 0, poojaType: 'Free Darshan' },
      { time: '08:00 AM', capacity: 500, price: 200, poojaType: 'Priority Darshan' },
      { time: '11:00 AM', capacity: 400, price: 200, poojaType: 'Priority Darshan' },
      { time: '02:00 PM', capacity: 300, price: 0, poojaType: 'Free Darshan' },
      { time: '05:00 PM', capacity: 400, price: 200, poojaType: 'Priority Darshan' },
    ],
  },
  {
    name: 'Siddhivinayak Temple', location: 'Prabhadevi, Mumbai', state: 'Maharashtra',
    city: 'Mumbai', deity: 'Lord Ganesha',
    description: 'One of the most famous Ganesha temples in Mumbai and India. Built in 1801, the temple is known for its golden dome and intricate wooden carvings. It attracts celebrities and common people alike.',
    openTime: '05:30 AM', closeTime: '09:50 PM', rating: 4.7, totalReviews: 28000,
    facilities: ['Prasadam', 'Medical', 'CCTV Surveillance', 'Online Booking', 'Parking'],
    tags: ['ganesha', 'west-india', 'popular', 'mumbai'],
    slots: [
      { time: '05:30 AM', capacity: 200, price: 0, poojaType: 'Morning Darshan' },
      { time: '09:00 AM', capacity: 300, price: 250, poojaType: 'VIP Darshan' },
      { time: '12:00 PM', capacity: 400, price: 0, poojaType: 'General Darshan' },
      { time: '03:00 PM', capacity: 300, price: 0, poojaType: 'General Darshan' },
      { time: '06:00 PM', capacity: 350, price: 250, poojaType: 'Evening VIP Darshan' },
    ],
  },
  {
    name: 'Sri Harmandir Sahib (Golden Temple)', location: 'Amritsar', state: 'Punjab',
    city: 'Amritsar', deity: 'Sri Guru Granth Sahib',
    description: 'The holiest shrine in Sikhism, beautifully plated in gold. The temple is a symbol of brotherhood and equality. The langar (community kitchen) serves free meals to over 100,000 people every day.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Golden_Temple_of_Amritsar_7.jpg/640px-The_Golden_Temple_of_Amritsar_7.jpg',
    openTime: '04:00 AM', closeTime: '11:00 PM', rating: 4.9, totalReviews: 45000,
    facilities: ['Langar (Free Food)', 'Sarovar Bath', 'Cloak Room', 'Library', 'Museum'],
    tags: ['sikh', 'north-india', 'popular', 'free'],
    slots: [
      { time: '04:00 AM', capacity: 1000, price: 0, poojaType: 'Morning Darshan' },
      { time: '08:00 AM', capacity: 2000, price: 0, poojaType: 'Free Darshan' },
      { time: '12:00 PM', capacity: 2000, price: 0, poojaType: 'Free Darshan' },
      { time: '04:00 PM', capacity: 1500, price: 0, poojaType: 'Free Darshan' },
      { time: '07:00 PM', capacity: 1000, price: 0, poojaType: 'Evening Darshan' },
    ],
  },
  {
    name: 'Meenakshi Amman Temple', location: 'Madurai', state: 'Tamil Nadu',
    city: 'Madurai', deity: 'Goddess Meenakshi',
    description: 'A historic Hindu temple on the southern bank of Vaigai River dedicated to Goddess Meenakshi. Famous for its magnificent gopurams adorned with thousands of colorful sculptures.',
    openTime: '05:00 AM', closeTime: '09:30 PM', rating: 4.8, totalReviews: 30000,
    facilities: ['Prasadam', 'Audio Guide', 'Wheelchair', 'Cloak Room', 'Elephant Rides'],
    dresscode: 'Traditional South Indian attire preferred.',
    tags: ['south-india', 'devi', 'historic', 'tamil-nadu'],
    slots: [
      { time: '05:00 AM', capacity: 400, price: 0, poojaType: 'Morning Darshan' },
      { time: '09:00 AM', capacity: 500, price: 100, poojaType: 'Special Darshan' },
      { time: '12:00 PM', capacity: 600, price: 0, poojaType: 'General Darshan' },
      { time: '04:00 PM', capacity: 500, price: 0, poojaType: 'General Darshan' },
      { time: '07:00 PM', capacity: 400, price: 100, poojaType: 'Evening Aarti' },
    ],
  },
  {
    name: 'Kashi Vishwanath Temple', location: 'Varanasi', state: 'Uttar Pradesh',
    city: 'Varanasi', deity: 'Lord Shiva',
    description: 'One of the most famous Hindu temples dedicated to Lord Shiva, located on the western bank of the holy river Ganga. One of the twelve Jyotirlingas, it is among the most sacred temples in Hinduism.',
    openTime: '03:00 AM', closeTime: '11:00 PM', rating: 4.8, totalReviews: 40000,
    facilities: ['Prasadam', 'Ganga Aarti', 'Boat Rides', 'Cloak Room', 'Medical'],
    dresscode: 'Traditional attire required. Non-Hindus may not be allowed inside the main sanctum.',
    tags: ['shiva', 'north-india', 'jyotirlinga', 'popular'],
    slots: [
      { time: '03:00 AM', capacity: 300, price: 0, poojaType: 'Mangala Aarti' },
      { time: '07:00 AM', capacity: 800, price: 0, poojaType: 'Morning Darshan' },
      { time: '11:00 AM', capacity: 600, price: 300, poojaType: 'VIP Darshan' },
      { time: '04:00 PM', capacity: 700, price: 0, poojaType: 'General Darshan' },
      { time: '07:00 PM', capacity: 500, price: 0, poojaType: 'Sandhya Aarti' },
    ],
  },
  {
    name: 'Somnath Temple', location: 'Prabhas Patan, Veraval', state: 'Gujarat',
    city: 'Veraval', deity: 'Lord Shiva',
    description: 'The Somnath Temple is the first among the twelve Jyotirlingas of Lord Shiva. Located on the western coast of Gujarat, this ancient temple has been destroyed and rebuilt multiple times throughout history.',
    openTime: '06:00 AM', closeTime: '09:30 PM', rating: 4.7, totalReviews: 22000,
    facilities: ['Prasadam', 'Museum', 'Audio Visual Show', 'Cloak Room', 'Parking'],
    tags: ['shiva', 'west-india', 'jyotirlinga', 'gujarat'],
    slots: [
      { time: '07:00 AM', capacity: 500, price: 0, poojaType: 'Morning Darshan' },
      { time: '10:00 AM', capacity: 400, price: 200, poojaType: 'Special Pooja' },
      { time: '01:00 PM', capacity: 300, price: 0, poojaType: 'General Darshan' },
      { time: '06:00 PM', capacity: 600, price: 0, poojaType: 'Evening Aarti' },
    ],
  },
  {
    name: 'ISKCON Temple Bangalore', location: 'Rajajinagar, Bangalore', state: 'Karnataka',
    city: 'Bangalore', deity: 'Radha Krishna',
    description: 'One of the largest ISKCON temples in the world, dedicated to Radha and Krishna. The temple complex includes a meditation hall, Vedic learning center, multimedia theater and prasadam restaurant.',
    openTime: '07:15 AM', closeTime: '08:30 PM', rating: 4.6, totalReviews: 18000,
    facilities: ['Prasadam Restaurant', 'Bookstore', 'Multimedia Show', 'Gift Shop', 'Parking'],
    tags: ['krishna', 'south-india', 'iskcon', 'bangalore'],
    slots: [
      { time: '07:15 AM', capacity: 400, price: 0, poojaType: 'Morning Darshan' },
      { time: '10:00 AM', capacity: 600, price: 150, poojaType: 'Special Entry' },
      { time: '01:00 PM', capacity: 500, price: 0, poojaType: 'General Darshan' },
      { time: '05:00 PM', capacity: 700, price: 0, poojaType: 'Evening Darshan' },
    ],
  },
];

const transports = [
  {
    type: 'bus', name: 'APSRTC Super Luxury', number: 'AP-3456',
    from: 'Hyderabad', to: 'Tirupati',
    departureTime: '06:00 AM', arrivalTime: '12:00 PM', duration: '6h',
    price: 650, totalSeats: 40, availableSeats: 28,
    amenities: ['AC', 'WiFi', 'Charging Port', 'Water Bottle', 'Blanket'],
    operator: 'APSRTC', rating: 4.2,
    classes: [{ name: 'Sleeper', price: 850, available: 10 }, { name: 'Seater', price: 650, available: 18 }],
  },
  {
    type: 'bus', name: 'VRL Travels Volvo', number: 'VRL-789',
    from: 'Bangalore', to: 'Mumbai',
    departureTime: '09:00 PM', arrivalTime: '08:00 AM', duration: '11h',
    price: 1200, totalSeats: 36, availableSeats: 12,
    amenities: ['AC', 'Blanket', 'Pillow', 'Charging Port', 'Entertainment System'],
    operator: 'VRL Travels', rating: 4.4,
    classes: [{ name: 'Sleeper', price: 1200, available: 12 }],
  },
  {
    type: 'bus', name: 'MSRTC Shivneri', number: 'MS-4521',
    from: 'Mumbai', to: 'Pune',
    departureTime: '07:00 AM', arrivalTime: '10:30 AM', duration: '3h 30m',
    price: 350, totalSeats: 45, availableSeats: 30,
    amenities: ['AC', 'Reclining Seats', 'Charging Port'],
    operator: 'MSRTC', rating: 4.1,
    classes: [{ name: 'Seater', price: 350, available: 30 }],
  },
  {
    type: 'train', name: 'Tirupati Express', number: '12567',
    from: 'Chennai', to: 'Tirupati',
    departureTime: '07:30 AM', arrivalTime: '10:45 AM', duration: '3h 15m',
    price: 220, totalSeats: 200, availableSeats: 85,
    amenities: ['Pantry Car', 'Blanket', 'Bedroll', 'Charging Points'],
    operator: 'Indian Railways', rating: 4.0,
    classes: [
      { name: '2A', price: 720, available: 20 },
      { name: '3A', price: 480, available: 35 },
      { name: 'Sleeper', price: 220, available: 30 },
    ],
  },
  {
    type: 'train', name: 'Rajdhani Express', number: '12951',
    from: 'Mumbai', to: 'Delhi',
    departureTime: '04:55 PM', arrivalTime: '08:35 AM', duration: '15h 40m',
    price: 1350, totalSeats: 300, availableSeats: 120,
    amenities: ['Meals Included', 'Bedroll', 'AC', 'Charging', 'Pantry'],
    operator: 'Indian Railways', rating: 4.5,
    classes: [
      { name: '1A', price: 4200, available: 10 },
      { name: '2A', price: 2400, available: 30 },
      { name: '3A', price: 1350, available: 80 },
    ],
  },
  {
    type: 'train', name: 'Shatabdi Express', number: '12001',
    from: 'Delhi', to: 'Amritsar',
    departureTime: '07:20 AM', arrivalTime: '01:15 PM', duration: '5h 55m',
    price: 780, totalSeats: 250, availableSeats: 100,
    amenities: ['Meals Included', 'AC', 'Charging', 'WiFi'],
    operator: 'Indian Railways', rating: 4.3,
    classes: [
      { name: 'CC', price: 780, available: 70 },
      { name: 'EC', price: 1560, available: 30 },
    ],
  },
  {
    type: 'train', name: 'Kashi Vishwanath Express', number: '15113',
    from: 'Delhi', to: 'Varanasi',
    departureTime: '06:45 AM', arrivalTime: '07:30 PM', duration: '12h 45m',
    price: 480, totalSeats: 400, availableSeats: 160,
    amenities: ['Pantry Car', 'Bedroll', 'AC'],
    operator: 'Indian Railways', rating: 3.9,
    classes: [
      { name: '2A', price: 1450, available: 30 },
      { name: '3A', price: 850, available: 60 },
      { name: 'Sleeper', price: 480, available: 70 },
    ],
  },
  {
    type: 'flight', name: 'IndiGo', number: '6E-453',
    from: 'Delhi', to: 'Tirupati',
    departureTime: '08:15 AM', arrivalTime: '11:30 AM', duration: '3h 15m',
    price: 3200, totalSeats: 180, availableSeats: 45,
    amenities: ['Meal Available', 'Entertainment', 'USB Charging'],
    operator: 'IndiGo Airlines', rating: 4.1,
    classes: [{ name: 'Economy', price: 3200, available: 35 }, { name: 'Business', price: 8500, available: 10 }],
  },
  {
    type: 'flight', name: 'Air India', number: 'AI-202',
    from: 'Mumbai', to: 'Amritsar',
    departureTime: '06:45 AM', arrivalTime: '09:15 AM', duration: '2h 30m',
    price: 4500, totalSeats: 200, availableSeats: 67,
    amenities: ['Meal Included', 'Entertainment', 'WiFi', 'Extra Legroom'],
    operator: 'Air India', rating: 3.9,
    classes: [{ name: 'Economy', price: 4500, available: 57 }, { name: 'Business', price: 12000, available: 10 }],
  },
  {
    type: 'flight', name: 'SpiceJet', number: 'SG-112',
    from: 'Bangalore', to: 'Varanasi',
    departureTime: '10:30 AM', arrivalTime: '01:45 PM', duration: '3h 15m',
    price: 3800, totalSeats: 186, availableSeats: 52,
    amenities: ['Meal Available', 'USB Charging'],
    operator: 'SpiceJet', rating: 3.8,
    classes: [{ name: 'Economy', price: 3800, available: 45 }, { name: 'SpiceBiz', price: 9200, available: 7 }],
  },
  {
    type: 'flight', name: 'Vistara', number: 'UK-975',
    from: 'Delhi', to: 'Madurai',
    departureTime: '09:00 AM', arrivalTime: '12:30 PM', duration: '3h 30m',
    price: 5200, totalSeats: 168, availableSeats: 38,
    amenities: ['Meal Included', 'Entertainment', 'WiFi', 'Premium Service'],
    operator: 'Vistara Airlines', rating: 4.5,
    classes: [
      { name: 'Economy', price: 5200, available: 28 },
      { name: 'Premium Economy', price: 8500, available: 7 },
      { name: 'Business', price: 18000, available: 3 },
    ],
  },
];

// ── Seed function ──────────────────────────────────────────────────────────
async function seed() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    await Promise.all([User.deleteMany({}), Temple.deleteMany({}), Transport.deleteMany({})]);
    console.log('🗑  Cleared existing data');

    // Create admin user
    const hashedPw = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Admin User', email: 'admin@darshan.com',
      phone: '9999999999', password: hashedPw, role: 'admin',
    });
    console.log('👤 Admin user created  →  admin@darshan.com / admin123');

    // Create demo user
    const userPw = await bcrypt.hash('user123', 12);
    await User.create({
      name: 'Demo User', email: 'user@darshan.com',
      phone: '8888888888', password: userPw, role: 'user',
    });
    console.log('👤 Demo user created   →  user@darshan.com / user123');

    // Seed temples
    const createdTemples = await Temple.insertMany(temples);
    console.log(`🛕 Seeded ${createdTemples.length} temples`);

    // Seed transport
    const createdTransport = await Transport.insertMany(transports);
    console.log(`🚌 Seeded ${createdTransport.length} transport records`);

    console.log('\n✅ Seed complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Admin Login  →  admin@darshan.com  /  admin123');
    console.log('  User Login   →  user@darshan.com   /  user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
