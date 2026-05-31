import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Clock, Users, Star, ArrowRight } from 'lucide-react';
import API from '../api';

const TYPE_ICONS = { bus: '🚌', train: '🚂', flight: '✈️' };
const TYPE_LABELS = { bus: 'Bus', train: 'Train', flight: 'Flight' };

export default function Transport() {
  const [params] = useSearchParams();
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(params.get('type') || 'all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => { fetchTransport(); }, [type, from, to]);

  const fetchTransport = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (type !== 'all') q.append('type', type);
      if (from) q.append('from', from);
      if (to) q.append('to', to);
      const res = await API.get(`/transport/search?${q}`);
      setTransports(res.data.transports || []);
    } catch { setTransports([]); }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '2.5rem', color: '#FFF8DC', marginBottom: '0.5rem' }}>🚌 Travel Booking</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Bus, Train & Flight tickets for your pilgrimage</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Type filter */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['all', 'bus', 'train', 'flight'].map(t => (
            <button key={t} onClick={() => setType(t)} style={{
              padding: '0.6rem 1.5rem', borderRadius: '50px', border: '2px solid',
              borderColor: type === t ? 'var(--gold)' : 'var(--gray-200)',
              background: type === t ? 'var(--gold)' : '#fff',
              color: type === t ? '#fff' : 'var(--gray-800)',
              fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
            }}>
              {t === 'all' ? '🌐 All' : `${TYPE_ICONS[t]} ${TYPE_LABELS[t]}`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <input value={from} onChange={e => setFrom(e.target.value)} placeholder="From city..." className="form-input" />
          </div>
          <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
            <input value={to} onChange={e => setTo(e.target.value)} placeholder="To city..." className="form-input" />
          </div>
          <button onClick={fetchTransport} className="btn btn-primary"><Search size={16} />Search</button>
        </div>

        {loading ? <div className="spinner" /> : (
          transports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--gray-400)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚌</div>
              <h3>No transport found</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {transports.map(t => <TransportCard key={t._id} transport={t} />)}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function TransportCard({ transport: t }) {
  return (
    <Link to={`/transport/${t._id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#fff', borderRadius: 14, padding: '1.5rem',
        boxShadow: 'var(--shadow)', transition: 'all 0.3s',
        border: '1px solid var(--gray-200)', cursor: 'pointer',
        display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center',
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'none'; }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ fontSize: '2.5rem' }}>{TYPE_ICONS[t.type]}</div>
          <div>
            <div style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--deep)' }}>{t.name}</div>
            <div style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>#{t.number} • {t.operator}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{t.from}</div>
            <div style={{ color: 'var(--gray-600)', fontSize: '0.82rem' }}>{t.departureTime}</div>
          </div>
          <div style={{ textAlign: 'center', color: 'var(--gray-400)' }}>
            <div style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>{t.duration}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ height: 1, width: 50, background: 'var(--gray-200)' }} />
              <ArrowRight size={12} />
              <div style={{ height: 1, width: 50, background: 'var(--gray-200)' }} />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{t.to}</div>
            <div style={{ color: 'var(--gray-600)', fontSize: '0.82rem' }}>{t.arrivalTime}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right', borderLeft: '1px solid var(--gray-100)', paddingLeft: '1rem' }}>
          <div style={{ fontFamily: 'Cinzel, serif', color: 'var(--saffron)', fontSize: '1.4rem', fontWeight: 900 }}>₹{t.price}</div>
          <div style={{ color: 'var(--gray-400)', fontSize: '0.75rem' }}>onwards</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--gray-600)', fontSize: '0.78rem', marginTop: '0.3rem', justifyContent: 'flex-end' }}>
            <Users size={12} />{t.availableSeats} seats
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--gold)', fontSize: '0.78rem', justifyContent: 'flex-end' }}>
            <Star size={11} fill="currentColor" />{t.rating}
          </div>
        </div>
      </div>
    </Link>
  );
}
