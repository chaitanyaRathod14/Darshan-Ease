import React, { useState, useEffect } from 'react';
import { Users, Ticket, IndianRupee, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        API.get('/users/admin/stats'),
        API.get('/bookings?limit=10'),
      ]);
      setStats(statsRes.data.stats);
      setBookings(bookingsRes.data.bookings || []);
    } catch (err) {
      toast.error('Failed to load admin data');
    }
    setLoading(false);
  };

  const seedData = async (type) => {
    setSeeding(type);
    try {
      await API.post(`/${type}/seed/data`);
      toast.success(`${type === 'temples' ? 'Temples' : 'Transport'} data seeded successfully!`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Seeding failed. Make sure you are logged in as admin.');
    }
    setSeeding('');
  };

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, Icon: Users, color: '#1565C0' },
    { label: 'Total Bookings', value: stats?.totalBookings || 0, Icon: Ticket, color: 'var(--gold)' },
    { label: 'Confirmed', value: stats?.confirmedBookings || 0, Icon: CheckCircle, color: '#2E7D32' },
    { label: 'Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, Icon: IndianRupee, color: 'var(--saffron)' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '2rem', color: '#FFF8DC', marginBottom: '0.3rem' }}>⚡ Admin Panel</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>DarshanEase Management Dashboard</p>
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
                    <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.6rem', fontWeight: 700, color: 'var(--deep)', lineHeight: 1 }}>{value}</div>
                    <div style={{ color: 'var(--gray-600)', fontSize: '0.82rem', marginTop: '0.2rem' }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Seed Data */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', boxShadow: 'var(--shadow)', marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1rem', color: 'var(--deep)' }}>🌱 Seed Sample Data</h2>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Populate the database with sample temples and transport data to get started.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={() => seedData('temples')} disabled={!!seeding} className="btn btn-primary">
                  <RefreshCw size={16} className={seeding === 'temples' ? 'spinning' : ''} />
                  {seeding === 'temples' ? 'Seeding...' : '🛕 Seed Temples (5)'}
                </button>
                <button onClick={() => seedData('transport')} disabled={!!seeding} className="btn btn-saffron">
                  <RefreshCw size={16} className={seeding === 'transport' ? 'spinning' : ''} />
                  {seeding === 'transport' ? 'Seeding...' : '🚌 Seed Transport (6)'}
                </button>
              </div>
            </div>

            {/* Recent bookings */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', boxShadow: 'var(--shadow)' }}>
              <h2 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1.5rem', color: 'var(--deep)' }}>Recent Bookings</h2>
              {bookings.length === 0 ? (
                <p style={{ color: 'var(--gray-400)', textAlign: 'center', padding: '2rem' }}>No bookings yet</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
                        {['Booking ID', 'User', 'Type', 'Amount', 'Status', 'Date'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--gray-600)', fontWeight: 700, fontFamily: 'Cinzel, serif', fontSize: '0.8rem' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b._id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                          <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--gold)' }}>{b.bookingId}</td>
                          <td style={{ padding: '0.75rem' }}>{b.user?.name || '-'}</td>
                          <td style={{ padding: '0.75rem' }}>{{ temple: '🛕', bus: '🚌', train: '🚂', flight: '✈️' }[b.bookingType] || ''} {b.bookingType}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 700 }}>₹{b.totalAmount}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700,
                              background: { confirmed: '#E8F5E9', cancelled: '#FFEBEE', pending: '#FFF8E1' }[b.status],
                              color: { confirmed: '#2E7D32', cancelled: '#C62828', pending: '#F57F17' }[b.status],
                            }}>{b.status}</span>
                          </td>
                          <td style={{ padding: '0.75rem', color: 'var(--gray-400)' }}>{new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} .spinning{animation:spin 1s linear infinite}`}</style>
    </div>
  );
}
