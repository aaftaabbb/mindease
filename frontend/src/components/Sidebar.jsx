import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, BarChart2, Wind, Sparkles, Building, BookOpen, LayoutDashboard, Users, AlertOctagon, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar({ token, userRole }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const userLinks = [
    { to: '/chat', icon: <MessageCircle size={20} />, label: 'Chat' },
    { to: '/mood', icon: <BarChart2 size={20} />, label: 'Mood' },
    { to: '/journal', icon: <BookOpen size={20} />, label: 'Journal' },
    { to: '/articles', icon: <BookOpen size={20} />, label: 'Learn' },
    { to: '/breathing', icon: <Wind size={20} />, label: 'Breathe' },
    { to: '/affirmations', icon: <Sparkles size={20} />, label: 'Affirmations' },
    { to: '/clinics', icon: <Building size={20} />, label: 'Clinics' },
  ];

  const adminLinks = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { to: '/admin/crisis', icon: <AlertOctagon size={20} />, label: 'Crisis' },
  ];

  const links = userRole === 'admin' ? adminLinks : userLinks;

  if (!token) return null;

  return (
    <aside style={{
      width: '220px',
      height: 'calc(100vh - 56px)',
      position: 'fixed',
      top: '56px',
      left: 0,
      background: 'var(--surface)',
      borderRight: '1px solid var(--glass-border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 12px',
      zIndex: 90,
      overflowY: 'auto',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 16px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: isActive(link.to) ? 'var(--primary)' : 'var(--text-muted)',
              background: isActive(link.to) ? 'var(--primary-dim)' : 'transparent',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              if (!isActive(link.to)) {
                e.currentTarget.style.background = 'var(--glass-bg)';
                e.currentTarget.style.color = 'var(--text)';
              }
            }}
            onMouseLeave={e => {
              if (!isActive(link.to)) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
              }
            }}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </div>

      <div style={{
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '11px 16px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 500,
            color: 'var(--text-muted)', transition: 'all 0.2s ease', width: '100%', textAlign: 'left',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--glass-bg)'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '11px 16px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 500,
            color: 'var(--text-muted)', transition: 'all 0.2s ease', width: '100%', textAlign: 'left',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--crisis-dim)'; e.currentTarget.style.color = 'var(--crisis)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
