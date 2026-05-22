import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Landing() {
  return (
    <div className="container">
      <div className="glass-panel fade-in" style={{ padding: '60px 40px', textAlign: 'center', marginTop: '40px' }}>
        <Heart size={64} color="var(--primary)" fill="var(--primary)" style={{ margin: '0 auto 24px auto', display: 'block' }} />
        <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>Your Mental Wellness Companion 💜</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          A safe, empathetic space for college students to share, track moods, and find resources. You are never alone.
        </p>
        <Link to="/login" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '16px 32px' }}>
          Get Started
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '40px' }}>
        <div className="glass-card">
          <h3 style={{ color: 'var(--primary)', marginBottom: '12px' }}>💬 Empathetic AI Chat</h3>
          <p style={{ color: 'var(--text-muted)' }}>Talk to MindEase anytime. We are here to listen without judgment.</p>
        </div>
        <div className="glass-card">
          <h3 style={{ color: 'var(--secondary)', marginBottom: '12px' }}>📊 Mood Tracking</h3>
          <p style={{ color: 'var(--text-muted)' }}>Keep track of your emotional well-being and visualize your progress over time.</p>
        </div>
        <div className="glass-card">
          <h3 style={{ color: 'var(--accent)', marginBottom: '12px' }}>✨ Daily Affirmations</h3>
          <p style={{ color: 'var(--text-muted)' }}>Start your day with positive vibes and mindful breathing exercises.</p>
        </div>
      </div>
    </div>
  );
}
