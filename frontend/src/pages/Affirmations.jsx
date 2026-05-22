import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const affirmations = [
  "I am capable of achieving great things.",
  "My feelings are valid and matter.",
  "I am doing my best, and that is enough.",
  "I choose to be kind to myself today.",
  "I am stronger than my challenges.",
  "I give myself permission to rest.",
  "Every day is a fresh start.",
  "I radiate positive energy."
];

export default function Affirmations() {
  const [current, setCurrent] = useState(affirmations[0]);
  const [fade, setFade] = useState(true);

  const newAffirmation = () => {
    setFade(false);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * affirmations.length);
      setCurrent(affirmations[randomIndex]);
      setFade(true);
    }, 300);
  };

  useEffect(() => {
    newAffirmation();
  }, []);

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Sparkles size={48} color="var(--accent)" style={{ marginBottom: '32px' }} />
      <div className="glass-panel" style={{ padding: '60px', width: '100%', maxWidth: '800px', textAlign: 'center', minHeight: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          color: 'var(--accent)', 
          opacity: fade ? 1 : 0, 
          transition: 'opacity 0.3s ease',
          fontStyle: 'italic'
        }}>
          "{current}"
        </h2>
      </div>
      <button onClick={newAffirmation} className="btn" style={{ marginTop: '40px', backgroundColor: 'var(--accent)', color: 'black' }}>
        New Affirmation
      </button>
    </div>
  );
}
