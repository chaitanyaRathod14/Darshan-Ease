import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1A0A00 0%, #2D1500 100%)',
      color: 'rgba(255,255,255,0.8)',
      padding: '3rem 0 1.5rem',
      borderTop: '2px solid rgba(184,134,11,0.3)',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>🕉</span>
              <div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.3rem', fontWeight: 700, color: '#DAA520' }}>DarshanEase</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(218,165,32,0.6)', letterSpacing: '2px', textTransform: 'uppercase' }}>Sacred Journeys</div>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>
              Your trusted companion for temple darshan bookings and seamless travel across India.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <button key={i} style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(218,165,32,0.15)', border: '1px solid rgba(218,165,32,0.3)',
                  color: '#DAA520', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}><Icon size={15} /></button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'Cinzel, serif', color: '#DAA520', marginBottom: '1rem', fontSize: '0.95rem' }}>Quick Links</h4>
            {[
              { to: '/', label: 'Home' },
              { to: '/temples', label: 'Temple Darshan' },
              { to: '/transport', label: 'Book Travel' },
              { to: '/register', label: 'Create Account' },
              { to: '/login', label: 'Login' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', marginBottom: '0.5rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#DAA520'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >{label}</Link>
            ))}
          </div>

          {/* Popular Temples */}
          <div>
            <h4 style={{ fontFamily: 'Cinzel, serif', color: '#DAA520', marginBottom: '1rem', fontSize: '0.95rem' }}>Popular Temples</h4>
            {['Tirupati Balaji', 'Vaishno Devi', 'Siddhivinayak', 'Golden Temple', 'Meenakshi Amman'].map(t => (
              <div key={t} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', marginBottom: '0.5rem' }}>🛕 {t}</div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'Cinzel, serif', color: '#DAA520', marginBottom: '1rem', fontSize: '0.95rem' }}>Contact Us</h4>
            {[
              { Icon: Phone, text: '+91 1800-DARSHAN' },
              { Icon: Mail, text: 'support@darshanease.com' },
              { Icon: MapPin, text: 'Mumbai, India 400001' },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
                <Icon size={15} style={{ color: '#DAA520', flexShrink: 0 }} />{text}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(218,165,32,0.2)', paddingTop: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
          © {new Date().getFullYear()} DarshanEase. All rights reserved. Made with 🙏 for devotees across India.
        </div>
      </div>
    </footer>
  );
}
