import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowLeft, MapPin, Calendar, Clock, Users } from 'lucide-react';
import API from '../api';

export default function BookingConfirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/bookings/${id}`).then(res => { setBooking(res.data.booking); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" style={{ marginTop: '5rem' }} />;
  if (!booking) return <div style={{ textAlign: 'center', padding: '5rem' }}>Booking not found</div>;

  const isTemple = booking.bookingType === 'temple';
  const statusColors = { confirmed: '#2E7D32', cancelled: '#C62828', pending: '#B8860B' };

  return (
    <div style={{ background: 'linear-gradient(135deg, #FDF6E3, #FFF8DC)', minHeight: '80vh', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: 640 }}>
        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #B8860B, #DAA520)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem', boxShadow: '0 10px 30px rgba(184,134,11,0.3)',
          }}>
            <CheckCircle size={40} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'Cinzel, serif', color: 'var(--deep)', marginBottom: '0.3rem' }}>Booking Confirmed!</h1>
          <p style={{ color: 'var(--gray-600)' }}>Your sacred journey is booked. May it be blessed! 🙏</p>
        </div>

        {/* Ticket */}
        <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
          {/* Ticket header */}
          <div style={{ background: 'linear-gradient(135deg, #1A0A00, #3D1C00)', padding: '1.75rem', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', color: '#DAA520' }}>
                  {isTemple ? '🛕 Darshan Ticket' : `${({ bus: '🚌', train: '🚂', flight: '✈️' }[booking.bookingType])} Travel Ticket`}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  Booking ID: <span style={{ color: '#DAA520', fontWeight: 700 }}>{booking.bookingId}</span>
                </div>
              </div>
              <span style={{
                background: `${statusColors[booking.status]}30`, border: `1px solid ${statusColors[booking.status]}`,
                color: booking.status === 'confirmed' ? '#81C784' : '#EF9A9A',
                padding: '0.4rem 1rem', borderRadius: '50px', fontWeight: 700, fontSize: '0.85rem',
              }}>
                {booking.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Dashed divider */}
          <div style={{ borderTop: '2px dashed var(--gray-200)', margin: '0 1.5rem' }} />

          {/* Details */}
          <div style={{ padding: '1.75rem' }}>
            {isTemple ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <InfoItem icon={<span>🛕</span>} label="Temple" value={booking.temple?.name} />
                  <InfoItem icon={<MapPin size={16} />} label="Location" value={`${booking.temple?.city}, ${booking.temple?.state}`} />
                  <InfoItem icon={<Calendar size={16} />} label="Visit Date" value={booking.visitDate ? new Date(booking.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'} />
                  <InfoItem icon={<Clock size={16} />} label="Time Slot" value={booking.slot} />
                  <InfoItem icon={<span>🙏</span>} label="Pooja Type" value={booking.poojaType} />
                  <InfoItem icon={<Users size={16} />} label="Devotees" value={booking.devotees?.length || 1} />
                </div>
                {booking.devotees?.length > 0 && (
                  <div style={{ background: 'var(--cream)', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Devotee Details</div>
                    {booking.devotees.map((d, i) => (
                      <div key={i} style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: '0.2rem' }}>
                        {i + 1}. {d.name}, {d.age} yrs, {d.gender}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <InfoItem icon={<span>🚏</span>} label="From" value={booking.from} />
                  <InfoItem icon={<span>🏁</span>} label="To" value={booking.to} />
                  <InfoItem icon={<Calendar size={16} />} label="Travel Date" value={booking.travelDate ? new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'} />
                  <InfoItem icon={<span>🎫</span>} label="Class" value={booking.class} />
                  <InfoItem icon={<Users size={16} />} label="Passengers" value={booking.passengers?.length || 1} />
                </div>
                {booking.passengers?.length > 0 && (
                  <div style={{ background: 'var(--cream)', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Passenger Details</div>
                    {booking.passengers.map((p, i) => (
                      <div key={i} style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: '0.2rem' }}>
                        {i + 1}. {p.name}, {p.age} yrs — Seat: {p.seatNumber || 'TBA'}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Payment */}
            <div style={{ background: 'var(--gold-pale)', borderRadius: 10, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>Payment Status</div>
                <div style={{ fontWeight: 700, color: 'var(--success)' }}>✓ {booking.paymentStatus?.toUpperCase()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>Total Amount</div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.5rem', color: 'var(--gold)', fontWeight: 900 }}>₹{booking.totalAmount}</div>
              </div>
            </div>
          </div>

          {/* QR placeholder */}
          {booking.qrCode && (
            <div style={{ borderTop: '2px dashed var(--gray-200)', margin: '0 1.5rem', padding: '1.5rem 0', textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, background: 'var(--cream)', borderRadius: 8, margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--gray-400)' }}>QR Code</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>{booking.qrCode}</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <Link to="/bookings" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
            <ArrowLeft size={16} />My Bookings
          </Link>
          <Link to={isTemple ? '/temples' : '/transport'} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            Book Another
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
      <div style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '0.1rem' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
        <div style={{ fontWeight: 600, color: 'var(--deep)', fontSize: '0.9rem' }}>{value || '-'}</div>
      </div>
    </div>
  );
}
