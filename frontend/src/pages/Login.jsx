import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, Phone, Lock, User, ArrowRight, Loader, ChevronLeft } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-otp`, { phone });
      alert(`Demo OTP: ${res.data.otp}`);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error sending OTP');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { name, phone, password, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      window.dispatchEvent(new Event('storage'));
      navigate(res.data.user.role === 'admin' ? '/admin' : '/chat');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    } finally { setLoading(false); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { phone, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      window.dispatchEvent(new Event('storage'));
      navigate(res.data.user.role === 'admin' ? '/admin' : '/chat');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'fixed', top: '-10%', left: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(155,140,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-10%', right: '-10%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(94,207,170,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="fade-in" style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'var(--primary-dim)',
            border: '1px solid rgba(155,140,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Heart size={26} fill="var(--primary)" color="var(--primary)" />
          </div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.8rem', fontWeight: 600,
            color: 'var(--text)', letterSpacing: '-0.01em',
          }}>
            Mind<span style={{ color: 'var(--primary)' }}>Ease</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
            Your mental wellness companion
          </p>
        </div>

        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 32px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}>

          <div style={{
            display: 'flex',
            background: 'var(--surface-2)',
            borderRadius: '50px',
            padding: '4px',
            marginBottom: '32px',
          }}>
            {['Login', 'Register'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setIsLogin(tab === 'Login'); setOtpSent(false); setError(''); }}
                style={{
                  flex: 1, padding: '9px', borderRadius: '50px',
                  fontSize: '0.9rem', fontWeight: 600,
                  transition: 'all 0.25s ease',
                  background: (isLogin && tab === 'Login') || (!isLogin && tab === 'Register')
                    ? 'linear-gradient(135deg, var(--primary), #7b6de0)'
                    : 'transparent',
                  color: (isLogin && tab === 'Login') || (!isLogin && tab === 'Register')
                    ? 'white' : 'var(--text-muted)',
                  boxShadow: (isLogin && tab === 'Login') || (!isLogin && tab === 'Register')
                    ? '0 4px 12px var(--primary-glow)' : 'none',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {error && (
            <div className="fade-in" style={{
              background: 'var(--crisis-dim)',
              border: '1px solid rgba(255,123,114,0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px',
              color: 'var(--crisis)',
              fontSize: '0.88rem',
              marginBottom: '20px',
            }}>
              ⚠️ {error}
            </div>
          )}

          {!isLogin && otpSent && (
            <div className="fade-in" style={{ marginBottom: '24px' }}>
              <button
                onClick={() => setOtpSent(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}
              >
                <ChevronLeft size={15} /> Back
              </button>
              <div style={{
                background: 'var(--secondary-dim)',
                border: '1px solid rgba(94,207,170,0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                color: 'var(--secondary)',
                fontSize: '0.88rem',
              }}>
                OTP sent to {phone}
              </div>
            </div>
          )}

          {isLogin && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <InputField icon={<Phone size={16} />} label="Phone Number" type="text"
                value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter your phone number" />
              <InputField icon={<Lock size={16} />} label="Password" type="password"
                value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
              <SubmitBtn loading={loading} label="Sign In" />
            </form>
          )}

          {!isLogin && !otpSent && (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <InputField icon={<User size={16} />} label="Full Name" type="text"
                value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
              <InputField icon={<Phone size={16} />} label="Phone Number" type="text"
                value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter phone number" />
              <InputField icon={<Lock size={16} />} label="Password" type="password"
                value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" />
              <SubmitBtn loading={loading} label="Send OTP" />
            </form>
          )}

          {!isLogin && otpSent && (
            <form onSubmit={handleRegister} className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-soft)' }}>
                  Enter OTP
                </label>
                <input
                  type="text" maxLength={6}
                  value={otp} onChange={e => setOtp(e.target.value)}
                  placeholder="••••••"
                  style={{
                    width: '100%', padding: '16px',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text)', fontSize: '1.4rem',
                    letterSpacing: '0.4em', textAlign: 'center',
                    fontFamily: 'monospace',
                    outline: 'none',
                  }}
                  required
                />
              </div>
              <SubmitBtn loading={loading} label="Create Account" />
            </form>
          )}

        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '24px', lineHeight: 1.6 }}>
          🔒 Your data is private and secure.
        </p>

      </div>
    </div>
  );
}

function InputField({ icon, label, type, value, onChange, placeholder, disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-soft)' }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: 'var(--surface-2)',
        border: `1px solid ${focused ? 'var(--primary)' : 'var(--glass-border)'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '0 14px',
        boxShadow: focused ? '0 0 0 3px var(--primary-dim)' : 'none',
        transition: 'all 0.25s ease',
        opacity: disabled ? 0.5 : 1,
      }}>
        <span style={{ color: focused ? 'var(--primary)' : 'var(--text-muted)', flexShrink: 0, transition: 'color 0.25s' }}>
          {icon}
        </span>
        <input
          type={type} value={value} onChange={onChange}
          placeholder={placeholder} disabled={disabled} required
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            flex: 1, padding: '13px 0',
            background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--text)', fontSize: '0.95rem', fontFamily: 'inherit',
          }}
        />
      </div>
    </div>
  );
}

function SubmitBtn({ loading, label }) {
  return (
    <button
      type="submit" disabled={loading}
      style={{
        width: '100%', padding: '14px',
        background: loading ? 'var(--surface-3)' : 'linear-gradient(135deg, var(--primary), #7b6de0)',
        border: 'none', borderRadius: '50px',
        color: 'white', fontSize: '0.97rem', fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.25s ease',
        boxShadow: loading ? 'none' : '0 4px 20px var(--primary-glow)',
        marginTop: '4px',
      }}
    >
      {loading
        ? <><Loader size={17} style={{ animation: 'spin 1s linear infinite' }} /> Please wait...</>
        : <>{label} <ArrowRight size={16} /></>
      }
    </button>
  );
}