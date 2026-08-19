import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, BarChart2, Wind, Sparkles, Building, BookOpen, LayoutDashboard, Users, AlertOctagon, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function MobileMenu({ token, userRole, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    onClose();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const userLinks = [
    { to: '/chat', icon: <MessageCircle size={20} />, label: 'Chat', desc: 'Talk to MindEase' },
    { to: '/mood', icon: <BarChart2 size={20} />, label: 'Mood', desc: 'Track your mood' },
    { to: '/journal', icon: <BookOpen size={20} />, label: 'Journal', desc: 'Write freely' },
    { to: '/articles', icon: <BookOpen size={20} />, label: 'Learn', desc: 'Mental health tips' },
    { to: '/breathing', icon: <Wind size={20} />, label: 'Breathe', desc: 'Guided exercises' },
    { to: '/affirmations', icon: <Sparkles size={20} />, label: 'Affirmations', desc: 'Daily positivity' },
    { to: '/clinics', icon: <Building size={20} />, label: 'Clinics', desc: 'Find help nearby' },
  ];

  const adminLinks = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', desc: 'Overview' },
    { to: '/admin/users', icon: <Users size={20} />, label: 'Users', desc: 'Manage users' },
    { to: '/admin/crisis', icon: <AlertOctagon size={20} />, label: 'Crisis', desc: 'Crisis reports' },
  ];

  const links = userRole === 'admin' ? adminLinks : userLinks;

  if (!token) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '56px',
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--surface)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      overflowY: 'auto',
      animation: 'fadeIn 0.2s ease',
      zIndex: 99,
    }}>
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '14px 16px',
            borderRadius: '14px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            background: isActive(link.to) ? 'var(--primary-dim)' : 'transparent',
          }}
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isActive(link.to) ? 'rgba(155,140,255,0.2)' : 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            color: isActive(link.to) ? 'var(--primary)' : 'var(--text-muted)',
            flexShrink: 0,
          }}>
            {link.icon}
          </div>
          <div>
            <div style={{
              fontWeight: 600, fontSize: '0.95rem',
              color: isActive(link.to) ? 'var(--primary)' : 'var(--text)',
            }}>
              {link.label}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {link.desc}
            </div>
          </div>
        </Link>
      ))}

      <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '8px', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          onClick={() => { toggleTheme(); onClose(); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '14px 16px', borderRadius: '14px', width: '100%', textAlign: 'left',
            color: 'var(--text-muted)', transition: 'all 0.2s ease',
          }}
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            flexShrink: 0,
          }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>
              {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Switch theme
            </div>
          </div>
        </button>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            padding: '14px 16px', borderRadius: '14px', width: '100%', textAlign: 'left',
            color: 'var(--crisis)', transition: 'all 0.2s ease',
          }}
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--crisis-dim)', border: '1px solid rgba(255,123,114,0.3)',
            flexShrink: 0,
          }}>
            <LogOut size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Logout</div>
            <div style={{ fontSize: '0.78rem', opacity: 0.7, marginTop: '2px' }}>See you soon</div>
          </div>
        </button>
      </div>
    </div>
  );
}
