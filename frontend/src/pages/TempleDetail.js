import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Star, Users, ChevronLeft, Plus, Minus, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function TempleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [visitDate, setVisitDate] = useState('');
  const [devotees, setDevotees] = useState([{ name: '', age: '', gender: 'Male' }]);
  const [booking, setBooking] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    API.get(`/temples/${id}`).then(res => { setTemple(res.data.temple); setLoading(false); }).catch(() => { toast.error('Temple not found'); navigate('/temples'); });
  }, [id]);

  const addDevotee = () => setDevotees([...devotees, { name: '', age: '', gender: 'Male' }]);
  const removeDevotee = (i) => devotees.length > 1 && setDevotees(devotees.filter((_, idx) => idx !== i));
  const updateDevotee = (i, field, val) => {
    const d = [...devotees];
    d[i][field] = val;
    setDevotees(d);
  };

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedSlot || !visitDate) { toast.error('Please select a slot and date'); return; }
    if (devotees.some(d => !d.name || !d.age)) { toast.error('Fill all devotee details'); return; }
    setBooking(true);
    try {
      const total = selectedSlot.price * devotees.length;
      const res = await API.post('/bookings', {
        bookingType: 'temple', temple: temple._id,
        visitDate, slot: selectedSlot.time,
        poojaType: selectedSlot.poojaType,
        devotees: devotees.map(d => ({ name: d.name, age: parseInt(d.age), gender: d.gender })),
        totalAmount: total,
        paymentMethod: 'Online',
      });
      toast.success('Booking confirmed! 🙏');
      navigate(`/booking/${res.data.booking._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
    setBooking(false);
  };

  if (loading) return <div className="spinner" style={{ marginTop: '5rem' }} />;
  if (!temple) return null;

  const fallbackImg = `https://picsum.photos/seed/${temple._id}/800/400`;
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div>
      {/* Header */}
      <div style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
        <img src={temple.image || fallbackImg} alt={temple.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = fallbackImg; }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(26,10,0,0.9))' }} />
        <div className="container" style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', width: '100%' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', marginBottom: '0.75rem', fontWeight: 600 }}>
            <ChevronLeft size={18} />Back
          </button>
          <h1 style={{ fontFamily: 'Cinzel, serif', color: '#FFF8DC', fontSize: '2rem', marginBottom: '0.4rem' }}>{temple.name}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14} />{temple.city}, {temple.state}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Star size={14} fill="#DAA520" color="#DAA520" />{temple.rating} ({temple.totalReviews?.toLocaleString()} reviews)</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} />{temple.openTime} - {temple.closeTime}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
          {/* Left */}
          <div>
            <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', boxShadow: 'var(--shadow)', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1rem', color: 'var(--deep)' }}>About</h2>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8 }}>{temple.description}</p>
              {temple.dresscode && (
                <div style={{ marginTop: '1rem', background: 'var(--gold-pale)', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                  👔 <strong>Dress Code:</strong> {temple.dresscode}
                </div>
              )}
            </div>

            {temple.facilities?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', boxShadow: 'var(--shadow)', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1rem', color: 'var(--deep)' }}>Facilities</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {temple.facilities.map(f => (
                    <span key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--gold-pale)', color: 'var(--brown)', padding: '0.4rem 0.9rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600 }}>
                      <CheckCircle size={13} />  {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking panel */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', boxShadow: 'var(--shadow-lg)', position: 'sticky', top: '5rem' }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1.5rem', color: 'var(--deep)' }}>Book Darshan</h2>

            {step === 1 && (
              <>
                <div className="form-group">
                  <label className="form-label">Visit Date</label>
                  <input type="date" min={minDate} value={visitDate} onChange={e => setVisitDate(e.target.value)} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Time Slot & Pooja Type</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {temple.slots?.map((slot, i) => {
                      const available = slot.capacity - slot.booked;
                      const isSelected = selectedSlot?.time === slot.time;
                      return (
                        <div key={i} onClick={() => available > 0 && setSelectedSlot(slot)} style={{
                          border: `2px solid ${isSelected ? 'var(--gold)' : 'var(--gray-200)'}`,
                          borderRadius: 10, padding: '0.75rem 1rem',
                          cursor: available > 0 ? 'pointer' : 'not-allowed',
                          background: isSelected ? 'var(--gold-pale)' : available === 0 ? 'var(--gray-100)' : '#fff',
                          opacity: available === 0 ? 0.5 : 1, transition: 'all 0.2s',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? 'var(--gold)' : 'var(--deep)' }}>{slot.time}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>{slot.poojaType}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 700, color: 'var(--saffron)' }}>{slot.price === 0 ? 'Free' : `₹${slot.price}`}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{available} left</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button onClick={() => {
                  if (!user) { navigate('/login'); return; }
                  if (!selectedSlot || !visitDate) { toast.error('Select date and slot'); return; }
                  setStep(2);
                }} className="btn btn-primary" style={{ width: '100%' }}>
                  Continue to Devotee Details
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1rem' }}>Devotee Details</h3>
                  <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>← Back</button>
                </div>

                {devotees.map((d, i) => (
                  <div key={i} style={{ border: '1px solid var(--gray-200)', borderRadius: 10, padding: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gray-600)' }}>Devotee {i + 1}</span>
                      {devotees.length > 1 && (
                        <button onClick={() => removeDevotee(i)} style={{ background: 'none', border: 'none', color: '#C62828', cursor: 'pointer' }}><Minus size={16} /></button>
                      )}
                    </div>
                    <input placeholder="Full Name" value={d.name} onChange={e => updateDevotee(i, 'name', e.target.value)} className="form-input" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input placeholder="Age" type="number" value={d.age} onChange={e => updateDevotee(i, 'age', e.target.value)} className="form-input" />
                      <select value={d.gender} onChange={e => updateDevotee(i, 'gender', e.target.value)} className="form-input">
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                  </div>
                ))}
                <button onClick={addDevotee} style={{ background: 'none', border: '1px dashed var(--gold)', color: 'var(--gold)', borderRadius: 10, padding: '0.6rem', width: '100%', cursor: 'pointer', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <Plus size={16} />Add Devotee
                </button>

                <div style={{ background: 'var(--gold-pale)', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                    <span>{selectedSlot?.poojaType} × {devotees.length}</span>
                    <span>₹{selectedSlot?.price === 0 ? 0 : (selectedSlot?.price || 0) * devotees.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid rgba(184,134,11,0.3)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--gold)' }}>₹{(selectedSlot?.price || 0) * devotees.length}</span>
                  </div>
                </div>

                <button onClick={handleBook} disabled={booking} className="btn btn-saffron" style={{ width: '100%' }}>
                  {booking ? 'Processing...' : '🙏 Confirm Booking'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){.container > div[style*="grid-template-columns"]{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}
