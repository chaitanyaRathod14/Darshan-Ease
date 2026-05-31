import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Star, MapPin, ArrowRight, Train, Plane, Bus, Shield, Clock, Headphones } from 'lucide-react';
import API from '../api';

const TEMPLE_IMAGES = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Tirupati_temple.jpg/320px-Tirupati_temple.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Golden_Temple_of_Amritsar_7.jpg/320px-The_Golden_Temple_of_Amritsar_7.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Vaishno_Devi_Temple.jpg/320px-Vaishno_Devi_Temple.jpg',
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [temples, setTemples] = useState([]);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    API.get('/temples?limit=6').then(res => setTemples(res.data.temples || [])).catch(() => {});
    const timer = setInterval(() => setHeroIdx(i => (i + 1) % 3), 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/temples?search=${search}`);
  };

  const stats = [
    { value: '500+', label: 'Temples Listed' },
    { value: '10L+', label: 'Happy Devotees' },
    { value: '4.9★', label: 'Average Rating' },
    { value: '24/7', label: 'Support' },
  ];

  const features = [
    { Icon: Shield, title: 'Secure Booking', desc: '100% secure payments with instant confirmation and digital receipts.' },
    { Icon: Clock, title: 'Real-time Slots', desc: 'Live slot availability so you never miss your darshan window.' },
    { Icon: Headphones, title: '24/7 Support', desc: 'Round the clock assistance for all your booking needs.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{
        position: 'relative', minHeight: '92vh',
        background: 'linear-gradient(135deg, #1A0A00 0%, #3D1C00 50%, #1A0A00 100%)',
        display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        {/* Decorative */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {['🕉', '🪔', '🌺', '☸️', '🙏'].map((s, i) => (
            <span key={i} style={{
              position: 'absolute', fontSize: `${2 + i}rem`, opacity: 0.04,
              top: `${10 + i * 18}%`, left: `${5 + i * 20}%`,
              animation: `float${i} ${5 + i}s ease-in-out infinite`,
            }}>{s}</span>
          ))}
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(218,165,32,0.15)', border: '1px solid rgba(218,165,32,0.3)', borderRadius: '50px', padding: '0.4rem 1.2rem', color: '#DAA520', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '1px' }}>
              🙏 SACRED JOURNEYS MADE SIMPLE
            </div>
            <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 900, color: '#FFF8DC', lineHeight: 1.15, marginBottom: '1rem' }}>
              Book Your <span style={{ color: '#DAA520' }}>Darshan</span> &<br />Travel with Ease
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem', lineHeight: 1.8 }}>
              Skip the queues. Reserve your sacred slot at India's most revered temples. Also book buses, trains & flights for your pilgrimage.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(218,165,32,0.3)', borderRadius: '60px', padding: '0.5rem 0.5rem 0.5rem 1.5rem' }}>
              <Search size={20} style={{ color: '#DAA520', flexShrink: 0, alignSelf: 'center' }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search temples, cities, deities..."
                style={{ flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: '1rem', outline: 'none' }}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '50px' }}>
                Search <ArrowRight size={16} />
              </button>
            </form>

            {/* Quick links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              {[
                { icon: '🛕', label: 'Temple Darshan', path: '/temples' },
                { icon: '🚌', label: 'Bus Tickets', path: '/transport?type=bus' },
                { icon: '🚂', label: 'Train Tickets', path: '/transport?type=train' },
                { icon: '✈️', label: 'Flight Tickets', path: '/transport?type=flight' },
              ].map(({ icon, label, path }) => (
                <Link key={path} to={path} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.8)', padding: '0.4rem 1rem', borderRadius: '50px',
                  fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
                }}>{icon} {label}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{ width: 2, height: 50, background: 'linear-gradient(to bottom, transparent, #DAA520)', margin: '0 auto', animation: 'scrollAnim 1.5s ease-in-out infinite' }} />
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'linear-gradient(135deg, #B8860B, #DAA520)', padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', textAlign: 'center' }}>
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '2rem', fontWeight: 900, color: '#fff' }}>{value}</div>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Temples */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title">🛕 Popular Temples</h2>
            <p className="section-subtitle">Book your darshan at India's most sacred shrines</p>
          </div>
          {temples.length > 0 ? (
            <div className="grid-3">
              {temples.slice(0, 6).map(temple => (
                <TempleCard key={temple._id} temple={temple} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛕</div>
              <p>No temples found. <Link to="/login" style={{ color: 'var(--gold)' }}>Login as admin</Link> to seed data.</p>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/temples" className="btn btn-primary btn-lg">View All Temples <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* Transport */}
      <section className="section" style={{ background: 'var(--deep)', color: '#fff' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '2.2rem', color: '#DAA520', marginBottom: '0.5rem' }}>🚌 Book Your Journey</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem' }}>Comfortable travel options for your pilgrimage</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {[
              { Icon: Bus, type: 'bus', label: 'Bus', desc: 'AC & Non-AC buses across India', color: '#FF6B00', emoji: '🚌' },
              { Icon: Train, type: 'train', label: 'Train', desc: 'Express trains to pilgrimage sites', color: '#1565C0', emoji: '🚂' },
              { Icon: Plane, type: 'flight', label: 'Flight', desc: 'Fastest way to reach your destination', color: '#2E7D32', emoji: '✈️' },
            ].map(({ type, label, desc, color, emoji }) => (
              <Link key={type} to={`/transport?type=${type}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px', padding: '2rem', textAlign: 'center',
                  transition: 'all 0.3s', cursor: 'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(218,165,32,0.1)'; e.currentTarget.style.borderColor = 'rgba(218,165,32,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{emoji}</div>
                  <h3 style={{ fontFamily: 'Cinzel, serif', color: '#DAA520', marginBottom: '0.5rem' }}>{label}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{desc}</p>
                  <div style={{ marginTop: '1rem', color: '#DAA520', fontSize: '0.85rem', fontWeight: 600 }}>Book Now →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 className="section-title">Why Choose DarshanEase?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {features.map(({ Icon, title, desc }) => (
              <div key={title} style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{
                  width: 70, height: 70, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #B8860B, #DAA520)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem', boxShadow: '0 8px 25px rgba(184,134,11,0.3)',
                }}>
                  <Icon size={30} color="#fff" />
                </div>
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', marginBottom: '0.75rem' }}>{title}</h3>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #1A0A00, #3D1C00)', padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🙏</div>
          <h2 style={{ fontFamily: 'Cinzel, serif', color: '#DAA520', fontSize: '2.2rem', marginBottom: '1rem' }}>
            Begin Your Sacred Journey Today
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', marginBottom: '2rem' }}>
            Join millions of devotees who trust DarshanEase for their pilgrimage plans.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
            <Link to="/temples" className="btn btn-outline btn-lg" style={{ color: '#DAA520', borderColor: '#DAA520' }}>Explore Temples</Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scrollAnim { 0%,100% { opacity: 0; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}

function TempleCard({ temple }) {
  const fallbackImg = `https://picsum.photos/seed/${temple.name}/400/250`;
  return (
    <Link to={`/temples/${temple._id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ cursor: 'pointer' }}>
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#f5f5f5' }}>
          <img
            src={temple.image || fallbackImg}
            alt={temple.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.src = fallbackImg; }}
          />
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
            <span className="badge badge-saffron">🛕 Darshan</span>
          </div>
        </div>
        <div style={{ padding: '1.25rem' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.05rem', marginBottom: '0.4rem', color: 'var(--deep)' }}>{temple.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gray-600)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            <MapPin size={14} style={{ color: 'var(--saffron)' }} />{temple.city}, {temple.state}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--gold)' }}>
              <Star size={14} fill="currentColor" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{temple.rating}</span>
            </div>
            <span style={{ color: 'var(--saffron)', fontWeight: 700, fontSize: '0.9rem' }}>
              From ₹{Math.min(...(temple.slots?.map(s => s.price) || [0]))} →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
