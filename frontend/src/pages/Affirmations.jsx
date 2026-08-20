import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Heart, Trash2, Copy, Check } from 'lucide-react';

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

const getDayNumber = () => {
  const start = localStorage.getItem('mindease_affirmation_start');
  if (!start) {
    localStorage.setItem('mindease_affirmation_start', Date.now());
    return 1;
  }
  return Math.floor((Date.now() - Number(start)) / 86400000) + 1;
};

export default function Affirmations() {
  const [current, setCurrent] = useState(affirmations[0]);
  const [fade, setFade] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [tab, setTab] = useState('daily');
  const [copied, setCopied] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [dayNumber] = useState(getDayNumber);
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
    if (!isSaved) {
      setHeartAnim(true);
      setTimeout(() => setHeartAnim(false), 600);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(current);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      minHeight: '80vh', gap: '28px',
      paddingTop: '24px', paddingBottom: '40px',
      maxWidth: '760px', width: '100%', margin: '0 auto',
      padding: '24px 20px 40px',
    }}>

      {/* Top badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '7px 20px', borderRadius: '50px',
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
        borderRadius: 'var(--radius-xl)',
        padding: '5px',
        gap: '4px',
        position: 'relative',
      }}>
        {[
          { key: 'daily', label: 'Daily', icon: <Sparkles size={14} /> },
          { key: 'saved', label: `Saved${saved.length > 0 ? ` (${saved.length})` : ''}`, icon: <Heart size={14} /> },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 28px', borderRadius: 'calc(var(--radius-xl) - 3px)',
              fontSize: '0.88rem', fontWeight: 600,
              transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
              background: tab === t.key
                ? 'linear-gradient(135deg, var(--accent), #e0a840)'
                : 'transparent',
              color: tab === t.key ? '#1a1200' : 'var(--text-muted)',
              boxShadow: tab === t.key ? '0 4px 16px rgba(245,201,122,0.35)' : 'none',
              cursor: 'pointer', border: 'none',
              zIndex: 1,
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── DAILY TAB ── */}
      {tab === 'daily' && (
        <>
          {/* Day counter */}
          <p style={{
            color: 'var(--text-muted)', fontSize: '0.8rem',
            letterSpacing: '0.05em',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            Today's affirmation · <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Day {dayNumber}</span>
          </p>

          {/* Card */}
          <div style={{
            width: '100%',
            background: 'linear-gradient(145deg, var(--surface) 0%, var(--surface-2) 100%)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(40px, 8vw, 72px) clamp(28px, 6vw, 64px)',
            textAlign: 'center',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
          }}>
            {/* Glow */}
            <div style={{
              position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)',
              width: '420px', height: '320px', borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(245,201,122,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* Decorative opening quote */}
            <div style={{
              position: 'absolute', top: '24px', left: '28px',
              fontSize: '5rem', lineHeight: 0.8,
              color: 'var(--accent)', opacity: 0.10,
              fontFamily: 'Georgia, serif', userSelect: 'none',
            }}>&ldquo;</div>

            {/* Decorative closing quote */}
            <div style={{
              position: 'absolute', bottom: '8px', right: '28px',
              fontSize: '5rem', lineHeight: 0.8,
              color: 'var(--accent)', opacity: 0.10,
              fontFamily: 'Georgia, serif', userSelect: 'none',
            }}>&rdquo;</div>

            <p style={{
              fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
              fontFamily: 'Playfair Display, serif',
              fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.6,
              opacity: fade ? 1 : 0,
              transform: fade ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.98)',
              transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)',
              position: 'relative', zIndex: 1, marginBottom: '36px',
            }}>
              {current}
            </p>

            {/* Action buttons */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', position: 'relative', zIndex: 1,
            }}>
              <button onClick={toggleSave} style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '10px 22px', borderRadius: 'var(--radius-lg)',
                background: isSaved ? 'rgba(255,123,114,0.12)' : 'var(--surface-2)',
                border: `1px solid ${isSaved ? 'rgba(255,123,114,0.3)' : 'var(--glass-border)'}`,
                color: isSaved ? 'var(--crisis)' : 'var(--text-muted)',
                fontSize: '0.85rem', fontWeight: 600,
                transition: 'all 0.3s ease', cursor: 'pointer',
              }}>
                <Heart
                  size={16}
                  fill={isSaved ? 'var(--crisis)' : 'none'}
                  style={{
                    transform: heartAnim ? 'scale(1.35)' : 'scale(1)',
                    transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                />
                {isSaved ? 'Saved' : 'Save'}
              </button>

              <button onClick={copyToClipboard} style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '10px 22px', borderRadius: 'var(--radius-lg)',
                background: copied ? 'rgba(125,211,152,0.12)' : 'var(--surface-2)',
                border: `1px solid ${copied ? 'rgba(125,211,152,0.3)' : 'var(--glass-border)'}`,
                color: copied ? '#5cb87a' : 'var(--text-muted)',
                fontSize: '0.85rem', fontWeight: 600,
                transition: 'all 0.3s ease', cursor: 'pointer',
              }}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* New affirmation button */}
          <button onClick={newAffirmation} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '14px 36px', borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, var(--accent), #e0a840)',
            border: 'none', color: '#1a1200',
            fontSize: '0.95rem', fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(245,201,122,0.3)',
            transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(245,201,122,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(245,201,122,0.3)'; }}
          >
            <RefreshCw size={17} style={{
              transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
              transform: spinning ? 'rotate(180deg)' : 'rotate(0deg)',
            }} />
            New Affirmation
          </button>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
            Take a moment to breathe and believe this.
          </p>
        </>
      )}

      {/* ── SAVED TAB ── */}
      {tab === 'saved' && (
        <div style={{ width: '100%' }}>
          {saved.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '64px 24px',
              background: 'linear-gradient(145deg, var(--surface) 0%, var(--surface-2) 100%)',
              border: '1px dashed var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'var(--accent-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <Heart size={26} style={{ color: 'var(--accent)', opacity: 0.7 }} />
              </div>
              <p style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '8px' }}>
                Your collection is empty
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '340px', margin: '0 auto', lineHeight: 1.6 }}>
                When an affirmation resonates with you, save it here. Build a collection that lifts you up on hard days.
              </p>
              <button
                onClick={() => setTab('daily')}
                style={{
                  marginTop: '24px', padding: '11px 28px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'linear-gradient(135deg, var(--accent), #e0a840)',
                  border: 'none', color: '#1a1200',
                  fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 4px 16px rgba(245,201,122,0.3)',
                }}
              >
                <Sparkles size={15} />
                Find your first affirmation
              </button>
            </div>
          ) : (
            <>
              <p style={{
                color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', marginBottom: '4px',
              }}>
                {saved.length} affirmation{saved.length > 1 ? 's' : ''} saved
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {saved.map((affirmation, i) => (
                  <div key={i} style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--glass-border)',
                    borderLeft: '3px solid var(--accent)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '18px 22px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                    transition: 'all 0.25s ease',
                    opacity: 1,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,201,122,0.4)'; e.currentTarget.style.borderLeftColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--surface-2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.borderLeftColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--surface)'; }}
                  >
                    <p style={{
                      fontFamily: 'Playfair Display, serif',
                      fontStyle: 'italic',
                      fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.55,
                      flex: 1,
                    }}>
                      {affirmation}
                    </p>
                    <button
                      onClick={() => removeSaved(affirmation)}
                      style={{
                        flexShrink: 0, padding: '9px',
                        borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-muted)', cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,123,114,0.12)'; e.currentTarget.style.color = 'var(--crisis)'; e.currentTarget.style.borderColor = 'rgba(255,123,114,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}
