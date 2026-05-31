# 🕉 DarshanEase — Temple Darshan & Travel Booking App

Full-stack web app for booking temple darshan slots and travel tickets (Bus / Train / Flight) across India.

---

## ⚡ Quick Start (3 Steps)

### Step 1 — Make sure MongoDB is running
- Local: MongoDB on port 27017 (default)
- Cloud: Update `backend/.env` → set your Atlas `MONGO_URI`

### Step 2 — Install & Seed

**Windows:** Double-click `start.bat`

**Mac / Linux:**
```bash
chmod +x start.sh && ./start.sh
```

**Manual:**
```bash
npm install
cd backend && npm install && npm run seed && cd ..
cd frontend && npm install && cd ..
npm run dev
```

### Step 3 — Open Browser
- Frontend → http://localhost:3000
- API Health → http://localhost:5000/api/health

---

## 🔑 Login Credentials (after seed)

| Role  | Email             | Password |
|-------|-------------------|----------|
| Admin | admin@darshan.com | admin123 |
| User  | user@darshan.com  | user123  |

---

## 🗂 Structure
```
darshanease/
├── backend/         Node.js + Express + MongoDB
│   ├── models/      User, Temple, Booking, Transport
│   ├── routes/      auth, temples, bookings, transport, users
│   ├── seed.js      Run once to populate DB
│   ├── server.js
│   └── .env
├── frontend/        React 18
│   └── src/
│       ├── pages/   Home, Temples, Transport, Dashboard...
│       ├── components/
│       └── context/
├── start.bat        Windows quick start
├── start.sh         Mac/Linux quick start
└── package.json
```

---

## ✨ Features
- Temple listing & search (city, state, deity)
- Darshan slot booking with devotee details
- Bus / Train / Flight search & booking
- Booking confirmation with QR code
- Dashboard, My Bookings, Cancel booking
- Admin panel with stats & seed data
- JWT authentication

## 🔧 Stack: React 18 · Node.js · Express · MongoDB · JWT
