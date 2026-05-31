import React, { useState } from 'react';
import { User, Phone, Mail, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put('/auth/profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
    setSaving(false);
  };

  const handleChangePw = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('Password must be 6+ characters'); return; }
    setChangingPw(true);
    try {
      await API.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
    setChangingPw(false);
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '2rem', color: '#FFF8DC', marginBottom: '0.3rem' }}>👤 My Profile</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Manage your account settings</p>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 700 }}>
        {/* Avatar */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', boxShadow: 'var(--shadow)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #B8860B, #DAA520)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontFamily: 'Cinzel, serif', color: '#fff', fontWeight: 900,
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--deep)' }}>{user?.name}</h2>
            <div style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginTop: '0.2rem' }}>{user?.email}</div>
            <span className="badge badge-gold" style={{ marginTop: '0.5rem' }}>{user?.role === 'admin' ? '⚡ Admin' : '✨ Member'}</span>
          </div>
        </div>

        {/* Edit Profile */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', boxShadow: 'var(--shadow)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} style={{ color: 'var(--gold)' }} />Edit Profile
          </h3>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Email (cannot change)</label>
              <input value={user?.email} disabled className="form-input" style={{ opacity: 0.6 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="form-input" />
            </div>
            <button type="submit" disabled={saving} className="btn btn-primary">
              <Save size={16} />{saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '1.75rem', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ fontFamily: 'Cinzel, serif', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} style={{ color: 'var(--gold)' }} />Change Password
          </h3>
          <form onSubmit={handleChangePw}>
            {[
              { key: 'currentPassword', label: 'Current Password' },
              { key: 'newPassword', label: 'New Password' },
              { key: 'confirm', label: 'Confirm New Password' },
            ].map(({ key, label }) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input type="password" value={pwForm[key]} onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })} className="form-input" placeholder="••••••••" />
              </div>
            ))}
            <button type="submit" disabled={changingPw} className="btn btn-outline">
              <Lock size={16} />{changingPw ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
