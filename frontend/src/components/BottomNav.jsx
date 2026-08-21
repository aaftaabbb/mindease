import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, BarChart2, BookOpen, Wind, Building } from 'lucide-react';

export default function BottomNav({ token }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const tabs = [
    { to: '/chat', icon: <MessageCircle size={20} />, label: 'Chat' },
    { to: '/mood', icon: <BarChart2 size={20} />, label: 'Mood' },
    { to: '/journal', icon: <BookOpen size={20} />, label: 'Journal' },
    { to: '/breathing', icon: <Wind size={20} />, label: 'Breathe' },
    { to: '/clinics', icon: <Building size={20} />, label: 'Clinics' },
  ];

  return (
    <nav className="bottom-nav" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '64px',
      background: 'var(--surface)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--glass-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 8px',
      zIndex: 100,
    }}>
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          to={token ? tab.to : '/login'}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            padding: '8px 12px',
            borderRadius: '12px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            minWidth: '56px',
          }}
        >
          <div style={{
            color: isActive(tab.to) ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'color 0.2s',
          }}>
            {tab.icon}
          </div>
          <span style={{
            fontSize: '0.65rem',
            fontWeight: isActive(tab.to) ? 600 : 500,
            color: isActive(tab.to) ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'color 0.2s',
          }}>
            {tab.label}
          </span>
          {isActive(tab.to) && (
            <div style={{
              position: 'absolute',
              bottom: '6px',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'var(--primary)',
            }} />
          )}
        </Link>
      ))}
    </nav>
  );
}
