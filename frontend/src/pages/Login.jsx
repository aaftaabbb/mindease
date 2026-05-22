import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-otp`, { phone });
      alert(`Demo OTP: ${res.data.otp}`);
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error sending OTP');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { name, phone, password, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      window.dispatchEvent(new Event('storage'));
      navigate(res.data.user.role === 'admin' ? '/admin' : '/chat');
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration failed');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { phone, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      window.dispatchEvent(new Event('storage'));
      navigate(res.data.user.role === 'admin' ? '/admin' : '/chat');
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
      <div className="glass-panel fade-in" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--primary)' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-input" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
          </form>
        ) : (
          <form onSubmit={otpSent ? handleRegister : handleSendOtp}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required disabled={otpSent} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-input" value={phone} onChange={e => setPhone(e.target.value)} required disabled={otpSent} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required disabled={otpSent} />
            </div>
            {otpSent && (
              <div className="form-group fade-in">
                <label className="form-label">Enter OTP</label>
                <input type="text" className="form-input" value={otp} onChange={e => setOtp(e.target.value)} required />
              </div>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              {otpSent ? 'Register' : 'Send OTP'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => { setIsLogin(!isLogin); setOtpSent(false); }} style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
