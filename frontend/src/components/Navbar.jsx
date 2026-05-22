import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, MessageCircle, BarChart2, Wind, Sparkles, Building, LogOut, LayoutDashboard, Users, AlertOctagon } from 'lucide-react';

export default function Navbar({ token, userRole }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <Heart fill="var(--primary)" /> MindEase
        </Link>

        <div className="nav-links">
          {token && userRole === 'user' && (
            <>
              <Link to="/chat" className={`nav-link ${isActive('/chat')}`}>
                <MessageCircle size={18} /> Chat
              </Link>
              <Link to="/mood" className={`nav-link ${isActive('/mood')}`}>
                <BarChart2 size={18} /> Mood
              </Link>
              <Link to="/breathing" className={`nav-link ${isActive('/breathing')}`}>
                <Wind size={18} /> Breathe
              </Link>
              <Link to="/affirmations" className={`nav-link ${isActive('/affirmations')}`}>
                <Sparkles size={18} /> Affirmations
              </Link>
              <Link to="/clinics" className={`nav-link ${isActive('/clinics')}`}>
                <Building size={18} /> Clinics
              </Link>
            </>
          )}

          {token && userRole === 'admin' && (
            <>
              <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link to="/admin/users" className={`nav-link ${isActive('/admin/users')}`}>
                <Users size={18} /> Users
              </Link>
              <Link to="/admin/crisis" className={`nav-link ${isActive('/admin/crisis')}`}>
                <AlertOctagon size={18} /> Crisis
              </Link>
            </>
          )}

          {token ? (
            <button onClick={handleLogout} className="nav-link">
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
