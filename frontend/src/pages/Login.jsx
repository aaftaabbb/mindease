import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, Phone, Lock, User, ArrowRight, Loader, ChevronLeft, Mail, Eye, EyeOff, Check, X, Shield } from 'lucide-react';

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: 'Weak', color: '#ff7b72', tips: 'Use uppercase, numbers & symbols' };
  if (score <= 2) return { score, label: 'Fair', color: '#f5c97a', tips: 'Add more character types' };
  if (score <= 3) return { score, label: 'Good', color: '#9b8cff', tips: 'Almost there!' };
  return { score, label: 'Strong', color: '#5ecfaa', tips: '' };
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const navigate = useNavigate();

  const phoneClean = phone.replace(/\s/g, '');
  const isPhoneValid = /^\d{10}$/.test(phoneClean);
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!isPhoneValid) return;
    setLoading(true); setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-otp`, { phone: phoneClean });
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error sending OTP');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name, phone: phoneClean, email, password, otp
      });
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
    if (!isPhoneValid) { setError('Enter valid 10-digit phone'); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { phone: phoneClean, password });
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
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <X size={16} /> {error}
            </div>
          )}

          {!isLogin && otpSent && (
            <div className="fade-in" style={{ marginBottom: '24px' }}>
              <button
                onClick={() => setOtpSent(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
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
                OTP sent to {formatPhone(phone)}
              </div>
            </div>
          )}

          {isLogin && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <PhoneInput
                value={phone} onChange={v => setPhone(v)}
                onBlur={() => setPhoneTouched(true)}
                valid={isPhoneValid}
                touched={phoneTouched}
              />
              <PasswordInput
                value={password} onChange={v => setPassword(v)}
                show={showPassword} toggleShow={() => setShowPassword(!showPassword)}
                placeholder="Enter your password"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-6px' }}>
                <Link to="/forgot-password" style={{
                  color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 500,
                  textDecoration: 'none', transition: 'opacity 0.2s',
                }}>
                  Forgot Password?
                </Link>
              </div>
              <SubmitBtn loading={loading} label="Sign In" />
            </form>
          )}

          {!isLogin && !otpSent && (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <TextInput icon={<User size={16} />} label="Full Name"
                value={name} onChange={v => setName(v)} placeholder="Your name" />
              <PhoneInput
                value={phone} onChange={v => setPhone(v)}
                onBlur={() => setPhoneTouched(true)}
                valid={isPhoneValid}
                touched={phoneTouched}
              />
              <TextInput icon={<Mail size={16} />} label="Email (for booking notifications)" type="email"
                value={email} onChange={v => setEmail(v)} placeholder="your@email.com" />
              <div>
                <PasswordInput
                  value={password} onChange={v => setPassword(v)}
                  show={showPassword} toggleShow={() => setShowPassword(!showPassword)}
                  placeholder="Create a password"
                />
                {password.length > 0 && (
                  <PasswordStrength strength={strength} />
                )}
              </div>
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
                  value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  style={{
                    width: '100%', padding: '16px',
                    background: 'var(--surface-2)',
                    border: `1px solid ${otp.length === 6 ? 'var(--secondary)' : 'var(--glass-border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text)', fontSize: '1.4rem',
                    letterSpacing: '0.4em', textAlign: 'center',
                    fontFamily: 'monospace',
                    outline: 'none',
                    transition: 'border-color 0.25s',
                  }}
                  required
                />
              </div>
              <SubmitBtn loading={loading} label="Create Account" />
            </form>
          )}

        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '20px',
        }}>
          <Shield size={12} /> Your data is private and secure. End-to-end encrypted.
        </div>

      </div>
    </div>
  );
}

function PhoneInput({ value, onChange, onBlur, valid, touched }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-soft)' }}>
        Phone Number
      </label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: 'var(--surface-2)',
        border: `1px solid ${touched && !valid ? 'var(--crisis)' : focused ? 'var(--primary)' : 'var(--glass-border)'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '0 14px',
        boxShadow: focused ? '0 0 0 3px var(--primary-dim)' : 'none',
        transition: 'all 0.25s ease',
      }}>
        <span style={{ color: focused ? 'var(--primary)' : 'var(--text-muted)', flexShrink: 0, transition: 'color 0.25s', display: 'flex', alignItems: 'center' }}>
          <Phone size={16} />
        </span>
        <input
          type="text" inputMode="numeric"
          value={value}
          onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
          onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); onBlur?.(); }}
          placeholder="98765 43210"
          maxLength={11}
          required
          style={{
            flex: 1, padding: '13px 0',
            background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--text)', fontSize: '0.95rem', fontFamily: 'inherit',
          }}
        />
        {touched && (
          <span style={{ flexShrink: 0 }}>
            {valid ? <Check size={16} color="var(--secondary)" /> : <X size={16} color="var(--crisis)" />}
          </span>
        )}
      </div>
      {touched && !valid && (
        <p className="fade-in" style={{ margin: '6px 0 0', fontSize: '0.78rem', color: 'var(--crisis)' }}>
          Enter valid 10-digit phone number
        </p>
      )}
    </div>
  );
}

function PasswordInput({ value, onChange, show, toggleShow, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-soft)' }}>
        Password
      </label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: 'var(--surface-2)',
        border: `1px solid ${focused ? 'var(--primary)' : 'var(--glass-border)'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '0 14px',
        boxShadow: focused ? '0 0 0 3px var(--primary-dim)' : 'none',
        transition: 'all 0.25s ease',
      }}>
        <span style={{ color: focused ? 'var(--primary)' : 'var(--text-muted)', flexShrink: 0, transition: 'color 0.25s', display: 'flex', alignItems: 'center' }}>
          <Lock size={16} />
        </span>
        <input
          type={show ? 'text' : 'password'}
          value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          required minLength={6}
          style={{
            flex: 1, padding: '13px 0',
            background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--text)', fontSize: '0.95rem', fontFamily: 'inherit',
          }}
        />
        <button type="button" onClick={toggleShow}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0, display: 'flex', alignItems: 'center', padding: 0 }}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

function TextInput({ icon, label, type = 'text', value, onChange, placeholder }) {
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
      }}>
        <span style={{ color: focused ? 'var(--primary)' : 'var(--text-muted)', flexShrink: 0, transition: 'color 0.25s', display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} required
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

function PasswordStrength({ strength }) {
  const segments = 5;
  return (
    <div className="fade-in" style={{ marginTop: '10px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
        {Array.from({ length: segments }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: i < strength.score ? strength.color : 'var(--surface-3)',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: strength.color, fontWeight: 600 }}>
          {strength.label}
        </span>
        {strength.tips && (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {strength.tips}
          </span>
        )}
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
