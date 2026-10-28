import React, { useState } from 'react';
import { Lock, MapPin, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminAuth({ onLoginSuccess }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const isReset = mode === 'reset';
      const isRegister = mode === 'register';
      const endpoint = isReset ? '/api/auth/forgot-password' : isRegister ? '/api/auth/register' : '/api/auth/login';
      const payload = isReset
        ? { username, securityAnswer, newPassword, confirmPassword }
        : isRegister
          ? { username, fullName, phone, password, confirmPassword }
          : { username, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || (isReset ? 'પાસવર્ડ રીસેટ થઈ શક્યો નથી' : isRegister ? 'રજીસ્ટ્રેશન થઈ શક્યું નથી' : 'ખોટો યુઝરનેમ અથવા પાસવર્ડ'));
        setLoading(false);
        return;
      }

      if (isReset) {
        setMode('login');
        setPassword('');
        setSecurityAnswer('');
        setNewPassword('');
        setConfirmPassword('');
        setError(data.message || 'પાસવર્ડ બદલાઈ ગયો છે. હવે નવા પાસવર્ડથી લોગીન કરો.');
        setLoading(false);
        return;
      }

      if (isRegister) {
        setMode('login');
        setPassword('');
        setError('રજીસ્ટ્રેશન સફળ થયું છે. હવે લોગીન કરો.');
        setLoading(false);
        return;
      }

      localStorage.setItem('barot_mobility_token', data.token);
      localStorage.setItem('barot_mobility_user', JSON.stringify(data.user));
      onLoginSuccess(data.user, data.token);
    } catch (err) {
      setError('સર્વર સાથે સંપર્ક થઈ શક્યો નથી. કૃપા કરીને તપાસો.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at 50% 25%, rgba(245, 158, 11, 0.08), transparent 65%), #050811'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '430px',
        padding: '38px 32px',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        borderRadius: '20px'
      }}>
        {/* Brand Emblem */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '76px',
            height: '76px',
            margin: '0 auto 16px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #f59e0b, #0ea5e9)',
            padding: '2.5px',
            boxShadow: '0 8px 30px rgba(245, 158, 11, 0.25)'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: '#070c18',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img src="/logo.svg" alt="Barot Mobility" style={{ width: '58px', height: '58px' }} />
            </div>
          </div>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>
            BAROT <span style={{ color: '#f59e0b' }}>MOBILITY</span>
          </h1>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '3px' }}>
            Fleet &amp; Wealth Management
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#64748b', fontSize: '0.82rem', marginTop: '6px' }}>
            <MapPin size={13} color="#10b981" /> કલોલ, ગાંધીનગર (ગુજરાત)
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            padding: '12px 14px',
            borderRadius: '10px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fda4af',
            fontSize: '0.86rem',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Authentication and recovery form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">એડમિન યુઝરનેમ (Username)</label>
            <input
              type="text"
              required
              autoFocus
              placeholder="યુઝરનેમ દાખલ કરો"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />
          </div>

          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">પૂરું નામ</label>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">મોબાઈલ નંબર</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" />
              </div>
            </>
          )}

          {mode === 'login' || mode === 'register' ? (
            <>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">પાસવર્ડ (Password)</label>
                <input
                  type="password"
                  required
                  placeholder="પાસવર્ડ દાખલ કરો"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
              </div>
              {mode === 'register' && (
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">પાસવર્ડ ફરીથી લખો</label>
                  <input type="password" required minLength="8" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-input" />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">સુરક્ષા જવાબ</label>
                <input
                  type="text"
                  required
                  placeholder="તમારો સુરક્ષા જવાબ લખો"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">નવો પાસવર્ડ</label>
                <input
                  type="password"
                  required
                  minLength="8"
                  placeholder="ઓછામાં ઓછા ૮ અક્ષર"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">નવો પાસવર્ડ ફરીથી લખો</label>
                <input type="password" required minLength="8" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-input" />
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '13px', fontSize: '0.98rem', fontWeight: 700 }}
          >
            {loading ? 'ચકાસણી ચાલુ છે...' : mode === 'login' ? 'સુરક્ષિત પ્રવેશ કરો' : mode === 'register' ? 'રજીસ્ટર કરો' : 'પાસવર્ડ બદલો'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'reset' : 'login');
            setSecurityAnswer('');
            setNewPassword('');
            setConfirmPassword('');
            setError('');
          }}
          style={{
            display: 'block',
            width: '100%',
            marginTop: '14px',
            padding: '8px',
            background: 'transparent',
            border: 'none',
            color: '#38bdf8',
            cursor: 'pointer',
            fontSize: '0.82rem'
          }}
        >
          {mode === 'login' ? 'પાસવર્ડ ભૂલી ગયા છો?' : 'લોગીન પર પાછા જાઓ'}
        </button>

        {mode === 'login' && (
          <button type="button" onClick={() => { setMode('register'); setError(''); }} style={{ display: 'block', width: '100%', marginTop: '4px', padding: '8px', background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.82rem' }}>
            નવું એડમિન રજીસ્ટર કરો
          </button>
        )}

        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <ShieldCheck size={14} color="#10b981" /> માત્ર હર્ષ બારોટ માટે અધિકૃત એક્સેસ
        </div>
      </div>
    </div>
  );
}
