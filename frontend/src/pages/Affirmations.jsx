import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Heart } from 'lucide-react';

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
  const [liked, setLiked] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const newAffirmation = () => {
    setFade(false);
    setLiked(false);
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
      alignItems: 'center', justifyContent: 'center',
      minHeight: '80vh', gap: '32px',
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
        <Sparkles size={13} /> Daily Affirmation
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '720px',
        background: 'var(--surface)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'clamp(40px, 8vw, 72px) clamp(28px, 6vw, 64px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
      }}>

        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)',
          width: '400px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(245,201,122,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Quote marks */}
        <div style={{
          fontSize: '6rem', lineHeight: 0.8,
          color: 'var(--accent)', opacity: 0.15,
          fontFamily: 'Georgia, serif',
          marginBottom: '16px',
          userSelect: 'none',
        }}>"</div>

        {/* Affirmation text */}
        <p style={{
          fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
          fontFamily: 'Playfair Display, serif',
          fontStyle: 'italic',
          color: 'var(--text)',
          lineHeight: 1.5,
          opacity: fade ? 1 : 0,
          transform: fade ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
          position: 'relative',
          zIndex: 1,
          marginBottom: '32px',
        }}>
          {current}
        </p>

        {/* Like button */}
        <button
          onClick={() => setLiked(l => !l)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 18px', borderRadius: '50px',
            background: liked ? 'var(--crisis-dim)' : 'var(--surface-2)',
            border: `1px solid ${liked ? 'rgba(255,123,114,0.3)' : 'var(--glass-border)'}`,
            color: liked ? 'var(--crisis)' : 'var(--text-muted)',
            fontSize: '0.85rem', fontWeight: 500,
            transition: 'all 0.25s ease',
            cursor: 'pointer',
          }}
        >
          <Heart size={15} fill={liked ? 'var(--crisis)' : 'none'} />
          {liked ? 'Saved' : 'Save'}
        </button>
      </div>

      {/* New affirmation button */}
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

      {/* Bottom note */}
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
        💜 Take a moment to breathe and believe this.
      </p>

    </div>
  );
}