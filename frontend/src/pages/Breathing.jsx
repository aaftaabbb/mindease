import { useState, useEffect } from 'react';

export default function Breathing() {
  const [phase, setPhase] = useState('Ready'); // Ready, Inhale, Hold, Exhale
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      if (phase === 'Ready' || phase === 'Exhale') {
        setPhase('Inhale');
        setTimeLeft(4);
      } else if (phase === 'Inhale') {
        setPhase('Hold');
        setTimeLeft(7);
      } else if (phase === 'Hold') {
        setPhase('Exhale');
        setTimeLeft(8);
      }
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, phase]);

  const toggleTimer = () => {
    if (isActive) {
      setIsActive(false);
      setPhase('Ready');
      setTimeLeft(0);
    } else {
      setIsActive(true);
      setPhase('Inhale');
      setTimeLeft(4);
    }
  };

  const getScale = () => {
    if (phase === 'Inhale') return 1.5;
    if (phase === 'Hold') return 1.5;
    if (phase === 'Exhale') return 1;
    return 1;
  };

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '40px' }}>
      <h2>4-7-8 Breathing Exercise</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '60px' }}>
        Inhale for 4s, hold for 7s, and exhale for 8s to reduce anxiety.
      </p>

      <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          backgroundColor: 'rgba(56, 201, 138, 0.2)',
          transform: `scale(${getScale()})`,
          transition: phase === 'Inhale' ? 'transform 4s linear' : phase === 'Exhale' ? 'transform 8s linear' : 'none'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: '2px solid var(--secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg)',
          zIndex: 10
        }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--secondary)' }}>{phase}</h3>
          {isActive && <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{timeLeft}</div>}
        </div>
      </div>

      <button onClick={toggleTimer} className="btn btn-primary" style={{ marginTop: '60px', padding: '16px 48px', fontSize: '1.2rem' }}>
        {isActive ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}
