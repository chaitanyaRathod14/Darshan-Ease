import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api';

const TYPE_ICONS = { temple: '🛕', bus: '🚌', train: '🚂', flight: '✈️' };
const STATUS_COLORS = { confirmed: '#2E7D32', cancelled: '#C62828', pending: '#B8860B', completed: '#1565C0' };

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => { fetchBookings(); }, [filter, typeFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (filter !== 'all') q.append('status', filter);
      if (typeFilter !== 'all') q.append('type', typeFilter);
      const res = await API.get(`/bookings/my?${q}`);
      setBookings(res.data.bookings || []);
    } catch { setBookings([]); }
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(id);
    try {
      await API.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled. Refund initiated.');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
    setCancelling(null);
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '2rem', color: '#FFF8DC', marginBottom: '0.3rem' }}>🎫 My Bookings</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Manage all your darshan and travel bookings</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['all', 'confirmed', 'pending', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '0.5rem 1.25rem', borderRadius: '50px', border: '2px solid',
              borderColor: filter === f ? 'var(--gold)' : 'var(--gray-200)',
              background: filter === f ? 'var(--gold)' : '#fff',
              color: filter === f ? '#fff' : 'var(--gray-800)',
              fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', textTransform: 'capitalize',
            }}>{f === 'all' ? 'All' : f}</button>
          ))}
          <div style={{ width: 1, background: 'var(--gray-200)' }} />
          {['all', 'temple', 'bus', 'train', 'flight'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={{
              padding: '0.5rem 1.25rem', borderRadius: '50px', border: '2px solid',
              borderColor: typeFilter === t ? 'var(--saffron)' : 'var(--gray-200)',
              background: typeFilter === t ? 'var(--saffron)' : '#fff',
              color: typeFilter === t ? '#fff' : 'var(--gray-800)',
              fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
            }}>{t === 'all' ? '🌐 All Types' : `${TYPE_ICONS[t]} ${t}`}</button>
          ))}
        </div>

        {loading ? <div className="spinner" /> : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--gray-400)' }}>
            <Ticket size={50} style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <h3>No bookings found</h3>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              <Link to="/temples" className="btn btn-primary btn-sm">Book Darshan</Link>
              <Link to="/transport" className="btn btn-outline btn-sm">Book Travel</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map(b => (
              <div key={b._id} style={{ background: '#fff', borderRadius: 14, padding: '1.5rem', boxShadow: 'var(--shadow)', border: '1px solid var(--gray-200)', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>{TYPE_ICONS[b.bookingType] || '🎫'}</div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, color: 'var(--deep)', marginBottom: '0.25rem' }}>
                    {b.temple?.name || `${b.from} → ${b.to}`}
                  </div>
                  <div style={{ color: 'var(--gray-400)', fontSize: '0.8rem', marginBottom: '0.3rem' }}>ID: {b.bookingId}</div>
                  {b.visitDate && <div style={{ fontSize: '0.82rem', color: 'var(--gray-600)' }}>📅 {new Date(b.visitDate).toLocaleDateString('en-IN')}</div>}
                  {b.travelDate && <div style={{ fontSize: '0.82rem', color: 'var(--gray-600)' }}>📅 {new Date(b.travelDate).toLocaleDateString('en-IN')}</div>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.2rem', color: 'var(--saffron)', fontWeight: 900 }}>₹{b.totalAmount}</div>
                  <span style={{
                    padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700,
                    background: `${STATUS_COLORS[b.status]}20`, color: STATUS_COLORS[b.status],
                  }}>{b.status}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/booking/${b._id}`} className="btn btn-outline btn-sm" style={{ fontSize: '0.78rem', padding: '0.35rem 0.85rem' }}>View</Link>
                    {b.status !== 'cancelled' && b.status !== 'completed' && (
                      <button onClick={() => handleCancel(b._id)} disabled={cancelling === b._id} style={{
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.35rem 0.85rem', borderRadius: '50px', border: '2px solid #C62828',
                        background: 'transparent', color: '#C62828', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem',
                      }}>
                        <XCircle size={13} />{cancelling === b._id ? '...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
