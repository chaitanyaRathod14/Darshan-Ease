import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Star, Filter, X } from 'lucide-react';
import API from '../api';

const STATES = ['All States', 'Andhra Pradesh', 'Jammu & Kashmir', 'Maharashtra', 'Punjab', 'Tamil Nadu', 'Uttar Pradesh', 'Rajasthan', 'Karnataka', 'Gujarat'];

export default function Temples() {
  const [params] = useSearchParams();
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('search') || '');
  const [state, setState] = useState('All States');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchTemples();
  }, [search, state, page]);

  const fetchTemples = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit: 9 });
      if (search) q.append('search', search);
      if (state !== 'All States') q.append('state', state);
      const res = await API.get(`/temples?${q}`);
      setTemples(res.data.temples || []);
      setTotal(res.data.total || 0);
    } catch { setTemples([]); }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '2.5rem', color: '#FFF8DC', marginBottom: '0.5rem' }}>🛕 Temple Darshan</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem' }}>Book your sacred darshan at India's most revered temples</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)' }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search temples, deities, cities..."
              className="form-input"
              style={{ paddingLeft: '2.75rem' }}
            />
            {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>}
          </div>
          <select value={state} onChange={e => { setState(e.target.value); setPage(1); }} className="form-input" style={{ width: 'auto', minWidth: 160 }}>
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
          <div style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>{total} temples found</div>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : temples.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--gray-400)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛕</div>
            <h3>No temples found</h3>
            <p style={{ marginTop: '0.5rem' }}>Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid-3">
            {temples.map(temple => <TempleCard key={temple._id} temple={temple} />)}
          </div>
        )}

        {/* Pagination */}
        {total > 9 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
            {Array.from({ length: Math.ceil(total / 9) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{
                width: 40, height: 40, borderRadius: '50%', border: '2px solid',
                borderColor: page === p ? 'var(--gold)' : 'var(--gray-200)',
                background: page === p ? 'var(--gold)' : 'transparent',
                color: page === p ? '#fff' : 'var(--gray-800)',
                fontWeight: 700, cursor: 'pointer',
              }}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TempleCard({ temple }) {
  const fallbackImg = `https://picsum.photos/seed/${temple._id}/400/250`;
  return (
    <Link to={`/temples/${temple._id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
          <img
            src={temple.image || fallbackImg}
            alt={temple.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
            onError={e => { e.target.src = fallbackImg; }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
          <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
            <span className="badge badge-gold">⭐ {temple.rating}</span>
          </div>
        </div>
        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.05rem', color: 'var(--deep)', marginBottom: '0.5rem' }}>{temple.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gray-600)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <MapPin size={13} style={{ color: 'var(--saffron)', flexShrink: 0 }} />{temple.city}, {temple.state}
          </div>
          <div style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginBottom: '1rem' }}>🙏 {temple.deity}</div>
          <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            {(temple.facilities || []).slice(0, 3).map(f => (
              <span key={f} style={{ background: 'var(--gold-pale)', color: 'var(--brown)', fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '50px', fontWeight: 600 }}>{f}</span>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>{(temple.slots || []).length} slots available</span>
            <span style={{ color: 'var(--saffron)', fontWeight: 700, fontSize: '0.9rem' }}>
              {temple.slots?.some(s => s.price === 0) ? 'Free Entry' : `From ₹${Math.min(...(temple.slots?.map(s => s.price) || [0]))}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
