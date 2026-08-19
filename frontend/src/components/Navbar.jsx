import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import MobileMenu from './MobileMenu';

export default function Navbar({ token, userRole }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar" style={{ height: '56px' }}>
      <div className="container nav-container">

        <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <Heart size={20} fill="var(--primary)" color="var(--primary)" />
          Mind<span>Ease</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{
              width: '38px', height: '38px', borderRadius: '10px',
              display: 'none', alignItems: 'center', justifyContent: 'center',
              background: menuOpen ? 'var(--primary-dim)' : 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: menuOpen ? 'var(--primary)' : 'var(--text-soft)',
              transition: 'all 0.2s ease',
            }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </div>

      {menuOpen && <MobileMenu token={token} userRole={userRole} onClose={() => setMenuOpen(false)} />}
    </nav>
  );
}
