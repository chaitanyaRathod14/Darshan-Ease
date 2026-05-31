import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, CheckCircle, XCircle, MapPin, Calendar, ArrowRight } from 'lucide-react';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/users/dashboard').then(res => {
      setStats(res.data.stats);
      setRecentBookings(res.data.recentBookings || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Bookings', value: stats?.totalBookings || 0, Icon: Ticket, color: 'var(--gold)' },
    { label: 'Confirmed', value: stats?.confirmedBookings || 0, Icon: CheckCircle, color: 'var(--success)' },
    { label: 'Temple Visits', value: stats?.templeBookings || 0, Icon: () => <span style={{ fontSize: '1.2rem' }}>🛕</span>, color: 'var(--saffron)' },
    { label: 'Travel Bookings', value: stats?.transportBookings || 0, Icon: () => <span style={{ fontSize: '1.2rem' }}>🚌</span>, color: 'var(--info)' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '2rem', color: '#FFF8DC', marginBottom: '0.3rem' }}>
            Namaste, {user?.name?.split(' ')[0]} 🙏
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Welcome to your DarshanEase dashboard</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {loading ? <div className="spinner" /> : (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {statCards.map(({ label, value, Icon, color }) => (
                <div key={label} style={{ background: '#fff', borderRadius: 14, padding: '1.5rem', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 50, height: 50, borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--deep)', lineHeight: 1 }}>{value}</div>
                    <div style={{ color: 'var(--gray-600)', fontSize: '0.82rem', marginTop: '0.2rem' }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
              {[
                { to: '/temples', icon: '🛕', label: 'Book Darshan', desc: 'Find & book temple slots', color: '#FF6B00' },
                { to: '/transport?type=bus', icon: '🚌', label: 'Book Bus', desc: 'Travel to your destination', color: '#B8860B' },
                { to: '/transport?type=train', icon: '🚂', label: 'Book Train', desc: 'Express trains to temples', color: '#1565C0' },
                { to: '/transport?type=flight', icon: '✈️', label: 'Book Flight', desc: 'Fastest pilgrimage travel', color: '#2E7D32' },
              ].map(({ to, icon, label, desc, color }) => (
                <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', borderRadius: 14, padding: '1.5rem', boxShadow: 'var(--shadow)', textAlign: 'center', transition: 'all 0.3s', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</div>
                    <div style={{ fontWeight: 700, color: 'var(--deep)', marginBottom: '0.25rem' }}>{label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>{desc}</div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent bookings */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', boxShadow: 'var(--shadow)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--deep)' }}>Recent Bookings</h2>
                <Link to="/bookings" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>View All <ArrowRight size={16} /></Link>
              </div>
              {recentBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--gray-400)' }}>
                  <Ticket size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                  <p>No bookings yet</p>
                  <Link to="/temples" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Book Your First Darshan</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {recentBookings.map(b => <BookingRow key={b._id} booking={b} />)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BookingRow({ booking: b }) {
  const statusColors = { confirmed: 'var(--success)', cancelled: 'var(--danger)', pending: 'var(--gold)' };
  return (
    <Link to={`/booking/${b._id}`} style={{ textDecoration: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: 10, border: '1px solid var(--gray-200)', transition: 'all 0.2s', cursor: 'pointer' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--cream)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
      >
        <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>
          {{ temple: '🛕', bus: '🚌', train: '🚂', flight: '✈️' }[b.bookingType] || '🎫'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: 'var(--deep)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {b.temple?.name || `${b.from} → ${b.to}`}
          </div>
          <div style={{ color: 'var(--gray-400)', fontSize: '0.78rem' }}>{b.bookingId}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontWeight: 700, color: 'var(--saffron)', fontSize: '0.9rem' }}>₹{b.totalAmount}</div>
          <span className="badge" style={{ background: `${statusColors[b.status]}20`, color: statusColors[b.status], fontSize: '0.72rem' }}>{b.status}</span>
        </div>
      </div>
    </Link>
  );
}
