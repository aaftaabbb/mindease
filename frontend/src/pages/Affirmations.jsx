import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Heart, Trash2 } from 'lucide-react';

const affirmations = [
  "I am capable of achieving great things.",
  "My feelings are valid and matter.",
  "I am doing my best, and that is enough.",
  "I choose to be kind to myself today.",
  "I am stronger than my challenges.",
  "I give myself permission to rest.",
  "Every day is a fresh start.",
  "I radiate positive energy.",
  "I deserve love, peace, and happiness.",
  "I trust the process of my journey.",
  "I am growing every single day.",
  "My mental health is a priority.",
];

export default function Affirmations() {
  const [current, setCurrent] = useState(affirmations[0]);
  const [fade, setFade] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [tab, setTab] = useState('daily');
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mindease_saved_affirmations')) || []; }
    catch { return []; }
  });

  const isSaved = saved.includes(current);

  const toggleSave = () => {
    setSaved(prev => {
      const updated = prev.includes(current)
        ? prev.filter(a => a !== current)
        : [current, ...prev];
      localStorage.setItem('mindease_saved_affirmations', JSON.stringify(updated));
      return updated;
    });
  };

  const removeSaved = (affirmation) => {
    setSaved(prev => {
      const updated = prev.filter(a => a !== affirmation);
      localStorage.setItem('mindease_saved_affirmations', JSON.stringify(updated));
      return updated;
    });
  };

  const newAffirmation = () => {
    setFade(false);
    setSpinning(true);
    setTimeout(() => {
      let next;
      do { next = affirmations[Math.floor(Math.random() * affirmations.length)]; }
      while (next === current);
      setCurrent(next);
      setFade(true);
      setSpinning(false);
    }, 350);
  };

  useEffect(() => { newAffirmation(); }, []);

  return (
    <div className="container main-content" style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      minHeight: '80vh', gap: '28px',
      paddingTop: '20px',
    }}>

      {/* Top badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '6px 18px', borderRadius: '50px',
        background: 'var(--accent-dim)',
        border: '1px solid rgba(245,201,122,0.25)',
        color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 600,
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        <Sparkles size={13} /> Affirmations
      </div>

      {/* Tab Switcher */}
      <div style={{
        display: 'flex',
        background: 'var(--surface-2)',
        borderRadius: '50px',
        padding: '4px',
        gap: '4px',
      }}>
        {[
          { key: 'daily', label: '✨ Daily' },
          { key: 'saved', label: `💜 Saved ${saved.length > 0 ? `(${saved.length})` : ''}` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '9px 24px', borderRadius: '50px',
              fontSize: '0.9rem', fontWeight: 600,
              transition: 'all 0.25s ease',
              background: tab === t.key
                ? 'linear-gradient(135deg, var(--accent), #e0a840)'
                : 'transparent',
              color: tab === t.key ? '#1a1200' : 'var(--text-muted)',
              boxShadow: tab === t.key ? '0 4px 12px rgba(245,201,122,0.3)' : 'none',
              cursor: 'pointer', border: 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── DAILY TAB ── */}
      {tab === 'daily' && (
        <>
          {/* Card */}
          <div style={{
            width: '100%', maxWidth: '720px',
            background: 'var(--surface)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(40px, 8vw, 72px) clamp(28px, 6vw, 64px)',
            textAlign: 'center',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
          }}>
            <div style={{
              position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)',
              width: '400px', height: '300px', borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(245,201,122,0.07) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              fontSize: '6rem', lineHeight: 0.8,
              color: 'var(--accent)', opacity: 0.15,
              fontFamily: 'Georgia, serif', marginBottom: '16px', userSelect: 'none',
            }}>"</div>

            <p style={{
              fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.5,
              opacity: fade ? 1 : 0,
              transform: fade ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
              position: 'relative', zIndex: 1, marginBottom: '32px',
            }}>
              {current}
            </p>

            <button onClick={toggleSave} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 18px', borderRadius: '50px',
              background: isSaved ? 'var(--crisis-dim)' : 'var(--surface-2)',
              border: `1px solid ${isSaved ? 'rgba(255,123,114,0.3)' : 'var(--glass-border)'}`,
              color: isSaved ? 'var(--crisis)' : 'var(--text-muted)',
              fontSize: '0.85rem', fontWeight: 500,
              transition: 'all 0.25s ease', cursor: 'pointer',
            }}>
              <Heart size={15} fill={isSaved ? 'var(--crisis)' : 'none'} />
              {isSaved ? 'Saved ✓' : 'Save'}
            </button>
          </div>

          <button onClick={newAffirmation} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '14px 32px', borderRadius: '50px',
            background: 'linear-gradient(135deg, var(--accent), #e0a840)',
            border: 'none', color: '#1a1200',
            fontSize: '0.97rem', fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(245,201,122,0.3)',
            transition: 'all 0.25s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <RefreshCw size={17} style={{
              transition: 'transform 0.35s ease',
              transform: spinning ? 'rotate(180deg)' : 'rotate(0deg)',
            }} />
            New Affirmation
          </button>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
            💜 Take a moment to breathe and believe this.
          </p>
        </>
      )}

      {/* ── SAVED TAB ── */}
      {tab === 'saved' && (
        <div style={{ width: '100%', maxWidth: '720px' }}>
          {saved.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 24px',
              background: 'var(--surface)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>💜</div>
              <p style={{ color: 'var(--text)', fontWeight: 600, marginBottom: '8px' }}>
                No saved affirmations yet
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Go to Daily tab and save the ones that speak to you!
              </p>
              <button
                onClick={() => setTab('daily')}
                style={{
                  marginTop: '20px', padding: '10px 24px',
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, var(--accent), #e0a840)',
                  border: 'none', color: '#1a1200',
                  fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                }}
              >
                ✨ Go to Daily
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
                {saved.length} affirmation{saved.length > 1 ? 's' : ''} saved 💜
              </p>
              {saved.map((affirmation, i) => (
                <div key={i} className="fade-in" style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                  transition: 'border-color 0.25s ease',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,201,122,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>✨</span>
                    <p style={{
                      fontFamily: 'Playfair Display, serif',
                      fontStyle: 'italic',
                      fontSize: '1rem', color: 'var(--text)', lineHeight: 1.5,
                    }}>
                      "{affirmation}"
                    </p>
                  </div>
                  <button
                    onClick={() => removeSaved(affirmation)}
                    style={{
                      flexShrink: 0, padding: '8px',
                      borderRadius: '50%', background: 'var(--surface-2)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-muted)', cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--crisis-dim)'; e.currentTarget.style.color = 'var(--crisis)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}