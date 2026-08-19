import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, MessageCircle, BarChart2, Wind, Sparkles, Building, BookOpen, LogOut, LayoutDashboard, Users, AlertOctagon, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ token, userRole }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';
  const close = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container nav-container">

        <Link to="/" className="nav-logo" onClick={close}>
          <Heart size={20} fill="var(--primary)" color="var(--primary)" />
          Mind<span>Ease</span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {token && userRole === 'user' && (
            <>
              <Link to="/chat"         className={`nav-link ${isActive('/chat')}`}         onClick={close}><MessageCircle size={16}/> Chat</Link>
              <Link to="/mood"         className={`nav-link ${isActive('/mood')}`}         onClick={close}><BarChart2 size={16}/> Mood</Link>
              <Link to="/journal"      className={`nav-link ${isActive('/journal')}`}      onClick={close}><BookOpen size={16}/> Journal</Link>
              <Link to="/articles"     className={`nav-link ${isActive('/articles')}`}     onClick={close}><BookOpen size={16}/> Learn</Link>
              <Link to="/breathing"    className={`nav-link ${isActive('/breathing')}`}    onClick={close}><Wind size={16}/> Breathe</Link>
              <Link to="/affirmations" className={`nav-link ${isActive('/affirmations')}`} onClick={close}><Sparkles size={16}/> Affirmations</Link>
              <Link to="/clinics"      className={`nav-link ${isActive('/clinics')}`}      onClick={close}><Building size={16}/> Clinics</Link>
            </>
          )}

          {token && userRole === 'admin' && (
            <>
              <Link to="/admin"        className={`nav-link ${isActive('/admin')}`}        onClick={close}><LayoutDashboard size={16}/> Dashboard</Link>
              <Link to="/admin/users"  className={`nav-link ${isActive('/admin/users')}`}  onClick={close}><Users size={16}/> Users</Link>
              <Link to="/admin/crisis" className={`nav-link ${isActive('/admin/crisis')}`} onClick={close}><AlertOctagon size={16}/> Crisis</Link>
            </>
          )}

          {token ? (
            <button onClick={() => { handleLogout(); close(); }} className="nav-link" style={{ marginLeft: '8px' }}>
              <LogOut size={16}/> Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ marginLeft: '8px', padding: '9px 22px', fontSize: '0.88rem' }} onClick={close}>
              Get Started
            </Link>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={toggleTheme} style={{
            width: '36px', height: '36px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--surface-2)', border: '1px solid var(--glass-border)',
            color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.25s',
          }} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            {menuOpen ? <X size={20} color="var(--text-soft)" /> : <Menu size={20} color="var(--text-soft)" />}
          </button>
        </div>

      </div>
    </nav>
  );
}