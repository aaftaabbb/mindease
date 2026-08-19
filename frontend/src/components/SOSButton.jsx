import { useState } from 'react';
import { AlertTriangle, Phone, X, Heart } from 'lucide-react';

const helplines = [
  { name: 'iCall TISS', phone: '9152987821', desc: 'Emotional support helpline' },
  { name: 'Vandrevala Foundation', phone: '18602662345', desc: '24/7 mental health helpline' },
  { name: 'NIMHANS', phone: '08046110007', desc: 'National Institute of Mental Health' },
  { name: 'AASRA', phone: '9820466726', desc: 'Suicide prevention helpline' },
  { name: 'iCall', phone: '9152987821', desc: 'Counseling services' },
];

export default function SOSButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Emergency SOS"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff4444, #cc0000)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9999,
          boxShadow: '0 4px 24px rgba(255,68,68,0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          animation: 'pulseSOS 2s infinite',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 32px rgba(255,68,68,0.6)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(255,68,68,0.4)';
        }}
      >
        <AlertTriangle size={24} color="white" />
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="modal-content fade-in"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '420px',
              width: '90%',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--crisis-dim)',
              border: '1px solid rgba(255,123,114,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Heart size={28} fill="var(--crisis)" color="var(--crisis)" />
            </div>

            <h2 style={{
              fontSize: '1.3rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '8px',
            }}>
              You are not alone
            </h2>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              marginBottom: '24px',
              lineHeight: 1.6,
            }}>
              If you or someone you know needs immediate help, please reach out to one of these helplines.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '20px',
              textAlign: 'left',
            }}>
              {helplines.map(h => (
                <a
                  key={h.phone}
                  href={`tel:${h.phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--glass-border)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--crisis)';
                    e.currentTarget.style.background = 'var(--crisis-dim)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.background = 'var(--surface-2)';
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--crisis-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Phone size={16} color="var(--crisis)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem' }}>
                      {h.name}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {h.desc}
                    </div>
                  </div>
                  <div style={{
                    fontWeight: 700,
                    color: 'var(--crisis)',
                    fontSize: '0.85rem',
                    fontFamily: 'monospace',
                  }}>
                    {h.phone}
                  </div>
                </a>
              ))}
            </div>

            <button
              onClick={() => setOpen(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'transparent',
                border: '1px solid var(--glass-border)',
                borderRadius: '50px',
                color: 'var(--text-muted)',
                fontWeight: 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <X size={16} /> Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulseSOS {
          0%, 100% { box-shadow: 0 4px 24px rgba(255,68,68,0.4); }
          50% { box-shadow: 0 4px 32px rgba(255,68,68,0.7); }
        }
      `}</style>
    </>
  );
}
