import { useState, useEffect } from 'react';
import { Wind } from 'lucide-react';

const PHASES = {
  Inhale: { duration: 4, color: '#9b8cff', instruction: 'Breathe in slowly...', next: 'Hold' },
  Hold:   { duration: 7, color: '#5ecfaa', instruction: 'Hold your breath...', next: 'Exhale' },
  Exhale: { duration: 8, color: '#f5c97a', instruction: 'Breathe out slowly...', next: 'Inhale' },
};

export default function Breathing() {
  const [phase, setPhase] = useState('Inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    if (timeLeft > 0) {
      const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
      return () => clearInterval(t);
    } else {
      const next = PHASES[phase].next;
      if (phase === 'Exhale') setCycles(c => c + 1);
      setPhase(next);
      setTimeLeft(PHASES[next].duration);
    }
  }, [isActive, timeLeft, phase]);

  const toggle = () => {
    if (isActive) {
      setIsActive(false);
      setPhase('Inhale');
      setTimeLeft(4);
      setCycles(0);
    } else {
      setIsActive(true);
      setPhase('Inhale');
      setTimeLeft(4);
    }
  };

  const current = PHASES[phase];
  const progress = isActive ? ((current.duration - timeLeft) / current.duration) * 100 : 0;
  const circumference = 2 * Math.PI * 110;

  const getScale = () => {
    if (!isActive) return 1;
    if (phase === 'Inhale') return 1 + 0.45 * ((current.duration - timeLeft) / current.duration);
    if (phase === 'Hold') return 1.45;
    return 1 + 0.45 * (timeLeft / current.duration);
  };

  return (
    <div className="container main-content" style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', textAlign: 'center',
      gap: '28px', paddingTop: '20px',
    }}>

      {/* Header */}
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 18px', borderRadius: '50px',
          background: 'rgba(94,207,170,0.12)',
          border: '1px solid rgba(94,207,170,0.25)',
          color: 'var(--secondary)', fontSize: '0.82rem', fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          marginBottom: '16px',
        }}>
          <Wind size={13} /> Breathing Exercise
        </div>
        <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2rem)', marginBottom: '8px' }}>
          4 — 7 — 8 Technique
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px' }}>
          Inhale 4s · Hold 7s · Exhale 8s — reduces anxiety and calms the mind.
        </p>
      </div>

      {/* Cycles counter */}
      {cycles > 0 && (
        <div className="fade-in" style={{
          padding: '8px 20px', borderRadius: '50px',
          background: 'var(--secondary-dim)',
          border: '1px solid rgba(94,207,170,0.2)',
          color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: 600,
        }}>
          ✨ {cycles} cycle{cycles > 1 ? 's' : ''} completed
        </div>
      )}

      {/* Circle */}
      <div style={{ position: 'relative', width: '280px', height: '280px' }}>

        {/* Outer glow ring */}
        <svg width="280" height="280" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
          <circle cx="140" cy="140" r="110"
            fill="none" stroke="var(--glass-border)" strokeWidth="3" />
          {isActive && (
            <circle cx="140" cy="140" r="110"
              fill="none"
              stroke={current.color}
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
            />
          )}
        </svg>

        {/* Breathing blob */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: `translate(-50%, -50%) scale(${getScale()})`,
          width: '160px', height: '160px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${isActive ? current.color : 'var(--primary)'}30 0%, ${isActive ? current.color : 'var(--primary)'}08 70%)`,
          transition: phase === 'Inhale'
            ? `transform ${current.duration}s cubic-bezier(0.4,0,0.2,1)`
            : phase === 'Exhale'
            ? `transform ${current.duration}s cubic-bezier(0.4,0,0.2,1)`
            : 'none',
        }} />

        {/* Center content */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10, textAlign: 'center',
          width: '160px',
        }}>
          {isActive ? (
            <>
              <div style={{
                fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: current.color,
                marginBottom: '4px', transition: 'color 0.5s',
              }}>
                {phase}
              </div>
              <div style={{
                fontSize: '3.2rem', fontWeight: 700, lineHeight: 1,
                color: 'var(--text)', fontFamily: 'monospace',
              }}>
                {timeLeft}
              </div>
              <div style={{
                fontSize: '0.72rem', color: 'var(--text-muted)',
                marginTop: '6px', lineHeight: 1.4,
              }}>
                {current.instruction}
              </div>
            </>
          ) : (
            <>
              <Wind size={28} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Press Start</div>
            </>
          )}
        </div>
      </div>

      {/* Phase indicators */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {Object.entries(PHASES).map(([name, data]) => (
          <div key={name} style={{
            padding: '8px 16px', borderRadius: '50px',
            background: isActive && phase === name ? `${data.color}18` : 'var(--surface-2)',
            border: `1px solid ${isActive && phase === name ? data.color + '44' : 'var(--glass-border)'}`,
            color: isActive && phase === name ? data.color : 'var(--text-muted)',
            fontSize: '0.8rem', fontWeight: 600,
            transition: 'all 0.4s ease',
          }}>
            {name} · {data.duration}s
          </div>
        ))}
      </div>

      {/* Start/Stop button */}
      <button onClick={toggle} style={{
        padding: '14px 48px', borderRadius: '50px',
        background: isActive
          ? 'transparent'
          : 'linear-gradient(135deg, var(--secondary), #3daa85)',
        border: isActive ? '2px solid var(--glass-border)' : 'none',
        color: isActive ? 'var(--text-muted)' : 'white',
        fontSize: '1rem', fontWeight: 700,
        cursor: 'pointer',
        boxShadow: isActive ? 'none' : '0 4px 20px rgba(94,207,170,0.3)',
        transition: 'all 0.25s ease',
      }}
        onMouseEnter={e => !isActive && (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        {isActive ? 'Stop Session' : 'Start Breathing'}
      </button>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
        💜 Practice daily for best results
      </p>

    </div>
  );
}