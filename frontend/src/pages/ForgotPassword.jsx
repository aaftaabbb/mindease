import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Brain, Phone, Lock, ArrowRight, Loader, ChevronLeft, Eye, EyeOff, Check, X, Shield, RotateCcw } from 'lucide-react';

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const navigate = useNavigate();

  const phoneClean = phone.replace(/\s/g, '');
  const isPhoneValid = /^\d{10}$/.test(phoneClean);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!isPhoneValid) return;
    setLoading(true); setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { phone: phoneClean });
      setSuccess('OTP sent to your phone');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error sending OTP');
    } finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        phone: phoneClean, otp, newPassword
      });
      setSuccess('Password reset successful!');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.msg || 'Reset failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
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
            <Brain size={26} strokeWidth={2} color="var(--primary)" />
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '2rem', fontWeight: 700,
            color: 'var(--text)', letterSpacing: '-0.02em', fontStyle: 'italic',
          }}>
            Mind<span style={{ color: 'var(--primary)' }}>Ease</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
            Reset your password
          </p>
        </div>

        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 32px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}>

          <Link to="/login" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: 'var(--text-muted)', fontSize: '0.85rem',
            marginBottom: '24px', textDecoration: 'none',
          }}>
            <ChevronLeft size={15} /> Back to Login
          </Link>

          {/* Step indicators */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{
                flex: 1, height: '4px', borderRadius: '2px',
                background: s <= step ? 'var(--primary)' : 'var(--surface-3)',
                transition: 'background 0.3s',
              }} />
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

          {success && step !== 3 && (
            <div className="fade-in" style={{
              background: 'var(--secondary-dim)',
              border: '1px solid rgba(94,207,170,0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px',
              color: 'var(--secondary)',
              fontSize: '0.88rem',
              marginBottom: '20px',
            }}>
              ✅ {success}
            </div>
          )}

          {/* Step 1: Enter phone */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '4px' }}>
                Enter your registered phone number. We'll send an OTP to verify it's you.
              </p>
              <PhoneInput
                value={phone} onChange={v => setPhone(v)}
                onBlur={() => setPhoneTouched(true)}
                valid={isPhoneValid}
                touched={phoneTouched}
              />
              <SubmitBtn loading={loading} label="Send OTP" />
            </form>
          )}

          {/* Step 2: Enter OTP + New Password */}
          {step === 2 && (
            <form onSubmit={handleReset} className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
                    fontFamily: 'monospace', outline: 'none',
                    transition: 'border-color 0.25s',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-soft)' }}>
                  New Password
                </label>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0 14px',
                  transition: 'all 0.25s ease',
                }}>
                  <Lock size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters" required minLength={6}
                    style={{
                      flex: 1, padding: '13px 0',
                      background: 'transparent', border: 'none', outline: 'none',
                      color: 'var(--text)', fontSize: '0.95rem', fontFamily: 'inherit',
                    }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0, display: 'flex', padding: 0 }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <SubmitBtn loading={loading} label="Reset Password" />
            </form>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="fade-in" style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'var(--secondary-dim)',
                border: '2px solid rgba(94,207,170,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <Check size={32} color="var(--secondary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text)' }}>Password Reset!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
                Your password has been updated successfully.
              </p>
              <button onClick={() => navigate('/login')}
                style={{
                  width: '100%', padding: '14px',
                  background: 'linear-gradient(135deg, var(--primary), #7b6de0)',
                  border: 'none', borderRadius: '50px',
                  color: 'white', fontSize: '0.97rem', fontWeight: 600,
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 20px var(--primary-glow)',
                }}
              >
                Go to Login <ArrowRight size={16} />
              </button>
            </div>
          )}

        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '20px',
        }}>
          <Shield size={12} /> Your data is private and secure.
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
          placeholder="98765 43210" maxLength={11} required
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

function SubmitBtn({ loading, label }) {
  return (
    <button type="submit" disabled={loading}
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
