import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  MapPin, 
  Building2, 
  Phone, 
  KeyRound, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

export default function AdminProfile({ user, onProfileUpdated, onAccountDeleted, token }) {
  const [fullName, setFullName] = useState(user?.fullName || 'હર્ષ બારોટ');
  const [phone, setPhone] = useState(user?.phone || '9825000000');
  const [city, setCity] = useState(user?.city || 'કલોલ, ગાંધીનગર');
  const [businessName, setBusinessName] = useState(user?.businessName || 'બારોટ મોબિલિટી');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('નવો પાસવર્ડ અને કન્ફર્મ પાસવર્ડ સરખા નથી');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName,
        phone,
        city,
        businessName,
        ...(newPassword ? { currentPassword, newPassword } : {})
      };

      const handleDeleteAccount = async () => {
        if (!deletePassword) {
          setError('એકાઉન્ટ ડિલીટ કરવા માટે હાલનો પાસવર્ડ લખો');
          return;
        }
        if (!window.confirm('આ એકાઉન્ટ અને તમામ કાર, ડ્રાઇવર, એન્ટ્રી, પગાર અને ફાઇનાન્સ ડેટા કાયમ માટે ડિલીટ થશે. શું તમે આગળ વધવા માંગો છો?')) {
          return;
        }

        setError('');
        setMessage('');
        setDeleteLoading(true);
        try {
          const res = await fetch('/api/auth/account', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword: deletePassword })
          });
          const data = await res.json();
          if (!res.ok) {
            setError(data.error || 'એકાઉન્ટ ડિલીટ કરવામાં ભૂલ થઈ');
            return;
          }
          onAccountDeleted();
        } catch (err) {
          setError('સર્વર સાથે સંપર્ક થઈ શક્યો નથી.');
        } finally {
          setDeleteLoading(false);
        }
      };

      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'પ્રોફાઇલ અપડેટ કરવામાં ભૂલ થઈ');
        setLoading(false);
        return;
      }

      setMessage(data.message || 'પ્રોફાઇલ સફળતાપૂર્વક અપડેટ થઈ ગઈ!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onProfileUpdated(data.user);
    } catch (err) {
      setError('સર્વર સાથે સંપર્ક થઈ શક્યો નથી.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '850px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="glass-panel admin-profile-hero" style={{
        padding: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95))',
        border: '1px solid rgba(245, 158, 11, 0.25)'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          flexShrink: 0,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f59e0b, #0ea5e9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          color: '#070c18',
          fontSize: '1.6rem',
          boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)'
        }}>
          HB
        </div>

        <div className="admin-profile-hero-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-active">
              <ShieldCheck size={13} /> મુખ્ય એડમિન પ્રોફાઇલ
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>યુઝરનેમ: @{user?.username}</span>
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            {user?.fullName || 'હર્ષ બારોટ'}
          </h2>
          <div className="admin-profile-meta">
            <span>
              <Building2 size={14} color="#f59e0b" /> {user?.businessName || 'બારોટ મોબિલિટી'}
            </span>
            <span>
              <MapPin size={14} color="#10b981" /> {user?.city || 'કલોલ, ગાંધીનગર'}
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div style={{
          padding: '14px 18px',
          borderRadius: '12px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div style={{
          padding: '14px 18px',
          borderRadius: '12px',
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: '#fda4af',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <form onSubmit={handleSubmit}>
          
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
            વ્યક્તિગત અને બિઝનેસ માહિતી
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            <div className="form-group">
              <label className="form-label">પૂરું નામ</label>
              <input 
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(244, 63, 94, 0.35)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fda4af', marginBottom: '10px' }}>
                એકાઉન્ટ ડિલીટ કરો
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#fda4af', marginBottom: '16px' }}>
                આ ક્રિયા કાયમી છે. તમારું એકાઉન્ટ અને તમામ એપ્લિકેશન ડેટા કાયમ માટે ડિલીટ થશે.
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: '1 1 260px', marginBottom: 0 }}>
                  <label className="form-label">હાલનો પાસવર્ડ</label>
                  <input
                    type="password"
                    placeholder="ડિલીટની પુષ્ટિ કરવા પાસવર્ડ"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="form-input"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  style={{ padding: '12px 20px', background: '#be123c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
                >
                  {deleteLoading ? 'ડિલીટ થઈ રહ્યું છે...' : 'એકાઉન્ટ અને ડેટા ડિલીટ કરો'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">મોબાઈલ નંબર</label>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">બિઝનેસ / પેઢીનું નામ</label>
              <input 
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">શહેર અને વિસ્તાર</label>
              <input 
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginTop: '28px', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
            સિક્યોરિટી અને પાસવર્ડ બદલો (Password Change)
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '16px' }}>
            જો પાસવર્ડ બદલવો ન હોય તો નીચેના ખાના ખાલી રહેવા દો.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">હાલનો જૂનો પાસવર્ડ</label>
              <input 
                type="password"
                placeholder="જૂનો પાસવર્ડ"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">નવો પાસવર્ડ</label>
              <input 
                type="password"
                placeholder="નવો પાસવર્ડ લખો"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">નવો પાસવર્ડ કન્ફર્મ કરો</label>
              <input 
                type="password"
                placeholder="ફરીથી નવો પાસવર્ડ લખો"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.95rem' }}
            >
              {loading ? 'અપડેટ થઈ રહ્યું છે...' : 'પ્રોફાઇલ સાચવો (Save Changes)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
