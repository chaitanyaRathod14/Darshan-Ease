import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Star, Users, Wifi, Wind, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const TYPE_ICONS = { bus: '🚌', train: '🚂', flight: '✈️' };

export default function TransportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transport, setTransport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [travelDate, setTravelDate] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: 'Male' }]);
  const [booking, setBooking] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    API.get(`/transport/${id}`).then(res => { setTransport(res.data.transport); setLoading(false); }).catch(() => { toast.error('Not found'); navigate('/transport'); });
  }, [id]);

  const addPassenger = () => setPassengers([...passengers, { name: '', age: '', gender: 'Male' }]);
  const removePassenger = (i) => passengers.length > 1 && setPassengers(passengers.filter((_, idx) => idx !== i));
  const updatePassenger = (i, field, val) => { const p = [...passengers]; p[i][field] = val; setPassengers(p); };

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    if (!travelDate || !selectedClass) { toast.error('Select date and class'); return; }
    if (passengers.some(p => !p.name || !p.age)) { toast.error('Fill all passenger details'); return; }
    setBooking(true);
    try {
      const total = selectedClass.price * passengers.length;
      const res = await API.post('/bookings', {
        bookingType: transport.type, transport: transport._id,
        from: transport.from, to: transport.to, travelDate,
        class: selectedClass.name,
        passengers: passengers.map((p, i) => ({ ...p, age: parseInt(p.age), seatNumber: `${selectedClass.name[0]}${i + 1}` })),
        totalAmount: total, paymentMethod: 'Online',
      });
      toast.success('Booking confirmed! 🎉');
      navigate(`/booking/${res.data.booking._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
    setBooking(false);
  };

  if (loading) return <div className="spinner" style={{ marginTop: '5rem' }} />;
  if (!transport) return null;

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', marginBottom: '1rem', fontWeight: 600 }}>
            <ChevronLeft size={18} />Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '3rem' }}>{TYPE_ICONS[transport.type]}</span>
            <div>
              <h1 style={{ fontFamily: 'Cinzel, serif', color: '#FFF8DC', fontSize: '1.8rem' }}>{transport.name} <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400, fontSize: '1.2rem' }}>#{transport.number}</span></h1>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', marginTop: '0.3rem' }}>
                {transport.from} → {transport.to} • {transport.departureTime} - {transport.arrivalTime} ({transport.duration})
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
          {/* Left */}
          <div>
            {/* Details */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', boxShadow: 'var(--shadow)', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1.25rem' }}>Journey Details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                {[
                  { label: 'Departure', value: transport.departureTime, sub: transport.from },
                  { label: 'Duration', value: transport.duration, sub: 'Travel Time' },
                  { label: 'Arrival', value: transport.arrivalTime, sub: transport.to },
                ].map(({ label, value, sub }) => (
                  <div key={label} style={{ padding: '1rem', background: 'var(--cream)', borderRadius: 10 }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginBottom: '0.3rem' }}>{label}</div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--deep)' }}>{value}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--gray-600)' }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            {transport.amenities?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', boxShadow: 'var(--shadow)', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1rem' }}>Amenities</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {transport.amenities.map(a => (
                    <span key={a} style={{ background: 'var(--gold-pale)', color: 'var(--brown)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600 }}>✓ {a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Classes */}
            {transport.classes?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', boxShadow: 'var(--shadow)' }}>
                <h2 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1rem' }}>Available Classes</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {transport.classes.map(cls => (
                    <div key={cls.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: 10, background: 'var(--cream)' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{cls.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--gray-400)' }}>{cls.available} seats available</div>
                      </div>
                      <div style={{ fontFamily: 'Cinzel, serif', color: 'var(--saffron)', fontWeight: 900, fontSize: '1.2rem' }}>₹{cls.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking panel */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', boxShadow: 'var(--shadow-lg)', position: 'sticky', top: '5rem' }}>
            <h2 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1.5rem' }}>Book Ticket</h2>

            {step === 1 && (
              <>
                <div className="form-group">
                  <label className="form-label">Travel Date</label>
                  <input type="date" min={minDate} value={travelDate} onChange={e => setTravelDate(e.target.value)} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Select Class</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {(transport.classes?.length > 0 ? transport.classes : [{ name: 'General', price: transport.price, available: transport.availableSeats }]).map(cls => {
                      const isSel = selectedClass?.name === cls.name;
                      return (
                        <div key={cls.name} onClick={() => setSelectedClass(cls)} style={{
                          border: `2px solid ${isSel ? 'var(--gold)' : 'var(--gray-200)'}`,
                          background: isSel ? 'var(--gold-pale)' : '#fff', borderRadius: 10,
                          padding: '0.75rem 1rem', cursor: 'pointer', transition: 'all 0.2s',
                          display: 'flex', justifyContent: 'space-between',
                        }}>
                          <div style={{ fontWeight: 700, color: isSel ? 'var(--gold)' : 'var(--deep)' }}>{cls.name}</div>
                          <div style={{ fontWeight: 700, color: 'var(--saffron)' }}>₹{cls.price}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <button onClick={() => {
                  if (!user) { navigate('/login'); return; }
                  if (!travelDate || !selectedClass) { toast.error('Select date and class'); return; }
                  setStep(2);
                }} className="btn btn-primary" style={{ width: '100%' }}>Continue</button>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1rem' }}>Passenger Details</h3>
                  <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>← Back</button>
                </div>
                {passengers.map((p, i) => (
                  <div key={i} style={{ border: '1px solid var(--gray-200)', borderRadius: 10, padding: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gray-600)' }}>Passenger {i + 1}</span>
                      {passengers.length > 1 && <button onClick={() => removePassenger(i)} style={{ background: 'none', border: 'none', color: '#C62828', cursor: 'pointer' }}><Minus size={16} /></button>}
                    </div>
                    <input placeholder="Full Name" value={p.name} onChange={e => updatePassenger(i, 'name', e.target.value)} className="form-input" style={{ marginBottom: '0.5rem' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input placeholder="Age" type="number" value={p.age} onChange={e => updatePassenger(i, 'age', e.target.value)} className="form-input" />
                      <select value={p.gender} onChange={e => updatePassenger(i, 'gender', e.target.value)} className="form-input">
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                  </div>
                ))}
                <button onClick={addPassenger} style={{ background: 'none', border: '1px dashed var(--gold)', color: 'var(--gold)', borderRadius: 10, padding: '0.6rem', width: '100%', cursor: 'pointer', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <Plus size={16} />Add Passenger
                </button>
                <div style={{ background: 'var(--gold-pale)', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>Total ({passengers.length} pax)</span>
                    <span style={{ color: 'var(--gold)' }}>₹{(selectedClass?.price || 0) * passengers.length}</span>
                  </div>
                </div>
                <button onClick={handleBook} disabled={booking} className="btn btn-saffron" style={{ width: '100%' }}>
                  {booking ? 'Processing...' : '🎫 Confirm Booking'}
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
