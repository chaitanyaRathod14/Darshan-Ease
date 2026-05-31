import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard, Ticket, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setDropdownOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 1000,
      background: scrolled ? 'rgba(26,10,0,0.97)' : 'rgba(26,10,0,0.95)',
      backdropFilter: 'blur(12px)',
      boxShadow: scrolled ? '0 4px 30px rgba(184,134,11,0.3)' : 'none',
      transition: 'all 0.3s ease',
      borderBottom: '1px solid rgba(184,134,11,0.2)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.8rem' }}>🕉</span>
          <div>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.3rem', fontWeight: 700, color: '#DAA520', lineHeight: 1 }}>DarshanEase</div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(218,165,32,0.7)', letterSpacing: '2px', textTransform: 'uppercase' }}>Sacred Journeys</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
          {[
            { path: '/', label: 'Home' },
            { path: '/temples', label: '🛕 Temples' },
            { path: '/transport', label: '🚌 Travel' },
          ].map(({ path, label }) => (
            <Link key={path} to={path} style={{
              color: isActive(path) ? '#DAA520' : 'rgba(255,255,255,0.8)',
              fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '50px',
              fontSize: '0.95rem', transition: 'all 0.2s',
              background: isActive(path) ? 'rgba(218,165,32,0.15)' : 'transparent',
            }}>{label}</Link>
          ))}
        </div>

        {/* Auth section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="desktop-nav">
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'rgba(218,165,32,0.15)', border: '1px solid rgba(218,165,32,0.3)',
                  color: '#DAA520', borderRadius: '50px', padding: '0.5rem 1rem',
                  fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                }}
              >
                <User size={16} />{user.name.split(' ')[0]}<ChevronDown size={14} />
              </button>
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0,
                  background: '#1A0A00', border: '1px solid rgba(218,165,32,0.2)',
                  borderRadius: '12px', minWidth: '180px', overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                }}>
                  {[
                    { path: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
                    { path: '/bookings', label: 'My Bookings', Icon: Ticket },
                    { path: '/profile', label: 'Profile', Icon: User },
                    ...(isAdmin ? [{ path: '/admin', label: 'Admin Panel', Icon: LayoutDashboard }] : []),
                  ].map(({ path, label, Icon }) => (
                    <Link key={path} to={path} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.75rem 1.25rem', color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(218,165,32,0.1)'; e.currentTarget.style.color = '#DAA520'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                    >
                      <Icon size={16} />{label}
                    </Link>
                  ))}
                  <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 1.25rem', color: '#ff6b6b',
                    fontSize: '0.9rem', fontWeight: 500, background: 'transparent',
                    border: 'none', width: '100%', cursor: 'pointer',
                    borderTop: '1px solid rgba(218,165,32,0.1)',
                  }}>
                    <LogOut size={16} />Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" style={{
                color: 'rgba(255,255,255,0.8)', fontWeight: 600, padding: '0.5rem 1rem',
                borderRadius: '50px', fontSize: '0.95rem',
              }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: '#DAA520', display: 'none' }} className="mobile-toggle">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: '#1A0A00', padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(218,165,32,0.2)',
        }}>
          {[
            { path: '/', label: 'Home' },
            { path: '/temples', label: '🛕 Temples' },
            { path: '/transport', label: '🚌 Travel' },
          ].map(({ path, label }) => (
            <Link key={path} to={path} style={{
              display: 'block', padding: '0.75rem 0', color: isActive(path) ? '#DAA520' : 'rgba(255,255,255,0.8)',
              fontWeight: 600, borderBottom: '1px solid rgba(218,165,32,0.1)',
            }}>{label}</Link>
          ))}
          {user ? (
            <>
              <Link to="/dashboard" style={{ display: 'block', padding: '0.75rem 0', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Dashboard</Link>
              <Link to="/bookings" style={{ display: 'block', padding: '0.75rem 0', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>My Bookings</Link>
              <Link to="/profile" style={{ display: 'block', padding: '0.75rem 0', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Profile</Link>
              {isAdmin && <Link to="/admin" style={{ display: 'block', padding: '0.75rem 0', color: '#DAA520', fontWeight: 600 }}>Admin Panel</Link>}
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ff6b6b', fontWeight: 600, padding: '0.75rem 0', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
