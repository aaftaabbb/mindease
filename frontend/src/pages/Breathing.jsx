import { useState, useEffect } from 'react';
import { Wind, Pause, Play, Square, CircleDot, Sparkles, Heart, Shield, Brain } from 'lucide-react';

const TECHNIQUES = {
  '4-7-8': {
    name: '4-7-8 Relaxing',
    description: 'Calms anxiety and helps you fall asleep faster',
    phases: [
      { name: 'Inhale', duration: 4, color: '#a78bfa', instruction: 'Breathe in slowly through your nose', icon: Wind, next: 'Hold' },
      { name: 'Hold', duration: 7, color: '#34d399', instruction: 'Hold your breath gently', icon: Pause, next: 'Exhale' },
      { name: 'Exhale', duration: 8, color: '#fbbf24', instruction: 'Exhale slowly through your mouth', icon: Wind, next: 'Inhale' },
    ],
  },
  'box': {
    name: 'Box Breathing',
    description: 'Used by Navy SEALs to stay calm under pressure',
    phases: [
      { name: 'Inhale', duration: 4, color: '#a78bfa', instruction: 'Breathe in slowly', icon: Wind, next: 'Hold' },
      { name: 'Hold', duration: 4, color: '#34d399', instruction: 'Hold your breath', icon: Pause, next: 'Exhale' },
      { name: 'Exhale', duration: 4, color: '#fbbf24', instruction: 'Breathe out slowly', icon: Wind, next: 'Hold2' },
      { name: 'Hold2', duration: 4, color: '#34d399', instruction: 'Hold your breath', icon: Pause, next: 'Inhale' },
    ],
  },
  'calm': {
    name: 'Calm Breathing',
    description: 'Short hold with longer exhale for deep relaxation',
    phases: [
      { name: 'Inhale', duration: 4, color: '#a78bfa', instruction: 'Breathe in deeply', icon: Wind, next: 'Hold' },
      { name: 'Hold', duration: 2, color: '#34d399', instruction: 'Brief pause', icon: Pause, next: 'Exhale' },
      { name: 'Exhale', duration: 6, color: '#fbbf24', instruction: 'Let it all go slowly', icon: Wind, next: 'Inhale' },
    ],
  },
};

export default function Breathing() {
  const [technique, setTechnique] = useState('4-7-8');
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  const phases = TECHNIQUES[technique].phases;
  const current = phases[phaseIndex];
  const progress = isActive ? ((current.duration - timeLeft) / current.duration) * 100 : 0;
  const circumference = 2 * Math.PI * 110;

  useEffect(() => {
    if (!isActive) return;
    if (timeLeft > 0) {
      const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
      return () => clearInterval(t);
    } else {
      const nextIndex = (phaseIndex + 1) % phases.length;
      if (nextIndex === 0) setCycles(c => c + 1);
      setPhaseIndex(nextIndex);
      setTimeLeft(phases[nextIndex].duration);
    }
  }, [isActive, timeLeft, phaseIndex, phases]);

  useEffect(() => {
    if (!isActive) {
      setPhaseIndex(0);
      setTimeLeft(phases[0].duration);
    }
  }, [technique]);

  const toggle = () => {
    if (isActive) {
      setIsActive(false);
      setPhaseIndex(0);
      setTimeLeft(phases[0].duration);
      setCycles(0);
    } else {
      setIsActive(true);
      setPhaseIndex(0);
      setTimeLeft(phases[0].duration);
    }
  };

  const getScale = () => {
    if (!isActive) return 1;
    if (current.name === 'Inhale') return 1 + 0.4 * ((current.duration - timeLeft) / current.duration);
    if (current.name.includes('Hold')) return 1.4;
    return 1 + 0.4 * (timeLeft / current.duration);
  };

  const PhaseIcon = current.icon;
  const glowOpacity = isActive ? 0.25 : 0.08;
  const glowScale = isActive ? getScale() : 0.8;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', textAlign: 'center',
      gap: '24px', paddingTop: '16px', paddingBottom: '40px',
      minHeight: '100vh',
    }}>

      {/* Header badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '6px 18px', borderRadius: '50px',
        background: 'var(--secondary-dim)',
        border: '1px solid var(--glass-border)',
        color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: 600,
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        <Wind size={13} /> Breathing Exercise
      </div>

      {/* Technique selector */}
      <div style={{
        display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center',
        maxWidth: '560px',
      }}>
        {Object.entries(TECHNIQUES).map(([key, tech]) => (
          <button
            key={key}
            onClick={() => { if (!isActive) setTechnique(key); }}
            disabled={isActive}
            style={{
              padding: '10px 18px', borderRadius: 'var(--radius-sm)',
              background: technique === key ? 'var(--surface-2)' : 'transparent',
              border: `1px solid ${technique === key ? 'var(--glass-border)' : 'transparent'}`,
              color: technique === key ? 'var(--text)' : 'var(--text-muted)',
              fontSize: '0.82rem', fontWeight: 600,
              cursor: isActive ? 'not-allowed' : 'pointer',
              opacity: isActive && technique !== key ? 0.4 : 1,
              transition: 'all 0.25s ease',
              textAlign: 'left', lineHeight: 1.4,
              minWidth: '150px',
            }}
            onMouseEnter={e => { if (!isActive && technique !== key) e.currentTarget.style.background = 'var(--surface-2)'; }}
            onMouseLeave={e => { if (technique !== key) e.currentTarget.style.background = 'transparent'; }}
          >
            <div>{tech.name}</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-muted)', marginTop: '2px' }}>
              {tech.description}
            </div>
          </button>
        ))}
      </div>

      {/* Cycle counter */}
      <div style={{
        padding: cycles > 0 ? '8px 22px' : '8px 22px',
        borderRadius: '50px',
        background: cycles > 0 ? 'var(--secondary-dim)' : 'var(--surface-2)',
        border: `1px solid ${cycles > 0 ? 'rgba(52,211,153,0.25)' : 'var(--glass-border)'}`,
        color: 'var(--secondary)',
        fontSize: '0.85rem', fontWeight: 600,
        transition: 'all 0.4s ease',
        opacity: cycles > 0 ? 1 : 0.6,
      }}>
        {cycles > 0 ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> {cycles} cycle{cycles > 1 ? 's' : ''} completed
          </span>
        ) : (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <CircleDot size={13} style={{ opacity: 0.5 }} /> Ready to begin
          </span>
        )}
      </div>

      {/* Circle container with ambient glow */}
      <div style={{
        position: 'relative', width: '300px', height: '300px',
      }}>

        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: `translate(-50%, -50%) scale(${glowScale})`,
          width: '240px', height: '240px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${isActive ? current.color : 'var(--primary)'}22 0%, transparent 70%)`,
          opacity: glowOpacity,
          transition: isActive
            ? current.name.includes('Hold')
              ? 'none'
              : `transform ${current.duration}s cubic-bezier(0.4,0,0.2,1), opacity 0.6s ease`
            : 'opacity 0.4s ease',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }} />

        {/* SVG progress ring */}
        <svg width="300" height="300" style={{
          position: 'absolute', top: 0, left: 0,
          transform: 'rotate(-90deg)',
        }}>
          {/* Track */}
          <circle cx="150" cy="150" r="110"
            fill="none" stroke="var(--glass-border)" strokeWidth="3" opacity="0.4" />
          {/* Progress */}
          {isActive && (
            <circle cx="150" cy="150" r="110"
              fill="none"
              stroke={current.color}
              strokeWidth="3.5"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 1s linear, stroke 0.6s ease',
                filter: `drop-shadow(0 0 6px ${current.color}66)`,
              }}
            />
          )}
        </svg>

        {/* Breathing blob */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: `translate(-50%, -50%) scale(${getScale()})`,
          width: '150px', height: '150px',
          borderRadius: '50%',
          background: `radial-gradient(circle at 40% 40%, ${isActive ? current.color : 'var(--primary)'}30 0%, ${isActive ? current.color : 'var(--primary)'}06 70%)`,
          transition: current.name.includes('Hold')
            ? 'none'
            : `transform ${current.duration}s cubic-bezier(0.4,0,0.2,1)`,
          pointerEvents: 'none',
        }} />

        {/* Second softer blob for depth */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: `translate(-50%, -50%) scale(${getScale() * 0.7})`,
          width: '100px', height: '100px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${isActive ? current.color : 'var(--primary)'}18 0%, transparent 70%)`,
          transition: current.name.includes('Hold')
            ? 'none'
            : `transform ${current.duration}s cubic-bezier(0.4,0,0.2,1)`,
          pointerEvents: 'none',
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
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '4px 12px', borderRadius: '50px',
                background: `${current.color}15`,
                border: `1px solid ${current.color}30`,
                marginBottom: '8px',
              }}>
                <PhaseIcon size={13} color={current.color} />
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: current.color,
                  transition: 'color 0.5s',
                }}>
                  {current.name.replace('2', '')}
                </span>
              </div>
              <div style={{
                fontSize: '3.4rem', fontWeight: 700, lineHeight: 1,
                color: 'var(--text)', fontFamily: 'monospace',
                letterSpacing: '-0.02em',
              }}>
                {timeLeft}
              </div>
              <div style={{
                fontSize: '0.72rem', color: 'var(--text-muted)',
                marginTop: '8px', lineHeight: 1.4,
                maxWidth: '140px', margin: '8px auto 0',
              }}>
                {current.instruction}
              </div>
            </>
          ) : (
            <>
              <Wind size={32} color="var(--text-muted)" style={{ margin: '0 auto 10px', opacity: 0.5 }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Press start to begin
              </div>
            </>
          )}
        </div>
      </div>

      {/* Phase indicators */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {phases.map((p, i) => {
          const Icon = p.icon;
          const label = p.name.replace('2', '');
          const active = isActive && phaseIndex === i;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: 'var(--radius-sm)',
              background: active ? `${p.color}15` : 'var(--surface-2)',
              border: `1px solid ${active ? p.color + '40' : 'var(--glass-border)'}`,
              color: active ? p.color : 'var(--text-muted)',
              fontSize: '0.78rem', fontWeight: 600,
              transition: 'all 0.4s ease',
            }}>
              <Icon size={13} />
              {label} {p.duration}s
            </div>
          );
        })}
      </div>

      {/* Start/Stop button */}
      <button onClick={toggle} style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        padding: '16px 52px', borderRadius: '50px',
        background: isActive
          ? 'var(--surface-2)'
          : 'linear-gradient(135deg, var(--primary), var(--secondary))',
        border: isActive ? '1px solid var(--glass-border)' : 'none',
        color: isActive ? 'var(--text-muted)' : 'white',
        fontSize: '1.05rem', fontWeight: 700,
        cursor: 'pointer',
        boxShadow: isActive
          ? 'none'
          : '0 6px 28px rgba(167,139,250,0.3), 0 2px 12px rgba(52,211,153,0.2)',
        transition: 'all 0.3s ease',
        letterSpacing: '0.02em',
      }}
        onMouseEnter={e => {
          if (!isActive) {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(167,139,250,0.4), 0 4px 16px rgba(52,211,153,0.25)';
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          if (!isActive) e.currentTarget.style.boxShadow = '0 6px 28px rgba(167,139,250,0.3), 0 2px 12px rgba(52,211,153,0.2)';
        }}
      >
        {isActive ? (
          <>
            <Square size={16} /> Stop Session
          </>
        ) : (
          <>
            <Play size={16} fill="white" /> Start Breathing
          </>
        )}
      </button>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
        Practice daily for best results
      </p>

      {/* How it works section */}
      <div style={{
        width: '100%', maxWidth: '560px',
        marginTop: '16px',
      }}>
        <h3 style={{
          fontSize: '1rem', fontWeight: 600, color: 'var(--text)',
          marginBottom: '16px', textAlign: 'center',
        }}>
          How It Works
        </h3>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
        }}>
          {[
            {
              icon: <Heart size={20} color="var(--primary)" />,
              title: 'Reduces Stress',
              text: 'Controlled breathing activates your parasympathetic nervous system, lowering cortisol.',
              bg: 'var(--primary-dim)',
            },
            {
              icon: <Shield size={20} color="var(--secondary)" />,
              title: 'Improves Focus',
              text: 'Rhythmic breathing calms mental chatter and sharpens present-moment awareness.',
              bg: 'var(--secondary-dim)',
            },
            {
              icon: <Brain size={20} color="var(--accent)" />,
              title: 'Better Sleep',
              text: 'Longer exhales signal your body it is safe to rest, making it ideal before bedtime.',
              bg: 'rgba(251,191,36,0.08)',
            },
          ].map((card, i) => (
            <div key={i} style={{
              padding: '18px 16px', borderRadius: 'var(--radius-xl)',
              background: 'var(--surface)',
              border: '1px solid var(--glass-border)',
              textAlign: 'center', lineHeight: 1.5,
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: card.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                {card.icon}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                {card.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {card.text}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
