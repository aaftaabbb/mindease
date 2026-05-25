import { Link } from 'react-router-dom';
import { Heart, MessageCircle, BarChart2, Sparkles, Wind, Building, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <MessageCircle size={22} />,
    color: 'var(--primary)',
    dim: 'var(--primary-dim)',
    title: 'Empathetic AI Chat',
    desc: 'Talk to MindEase anytime. A judgment-free space that truly listens and understands.',
  },
  {
    icon: <BarChart2 size={22} />,
    color: 'var(--secondary)',
    dim: 'var(--secondary-dim)',
    title: 'Mood Tracking',
    desc: 'Log your emotions daily and visualize patterns in your mental well-being over time.',
  },
  {
    icon: <Sparkles size={22} />,
    color: 'var(--accent)',
    dim: 'var(--accent-dim)',
    title: 'Daily Affirmations',
    desc: 'Start each morning with a curated affirmation designed to ground and uplift you.',
  },
  {
    icon: <Wind size={22} />,
    color: 'var(--secondary)',
    dim: 'var(--secondary-dim)',
    title: 'Breathing Exercises',
    desc: 'Calm your nervous system with guided breathwork sessions, anytime you need.',
  },
  {
    icon: <Building size={22} />,
    color: 'var(--primary)',
    dim: 'var(--primary-dim)',
    title: 'Find Clinics',
    desc: 'Discover verified mental health professionals and clinics near your campus.',
  },
  {
    icon: <Heart size={22} />,
    color: 'var(--crisis)',
    dim: 'var(--crisis-dim)',
    title: 'Crisis Support',
    desc: 'Immediate resources and guidance available whenever you need urgent help.',
  },
];

export default function Landing() {
  return (
    <div style={{ paddingBottom: '80px' }}>

      <section style={{
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(155,140,255,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="fade-in" style={{ maxWidth: '680px', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 18px', borderRadius: '50px',
            background: 'var(--primary-dim)', border: '1px solid rgba(155,140,255,0.25)',
            color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            marginBottom: '32px',
          }}>
            <Heart size={13} fill="var(--primary)" /> For College Students
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 6vw, 3.8rem)',
            marginBottom: '20px',
            color: 'var(--text)',
            lineHeight: 1.15,
          }}>
            Your Mental Wellness<br />
            <span style={{ color: 'var(--primary)' }}>Companion</span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-soft)',
            lineHeight: 1.75,
            marginBottom: '44px',
            maxWidth: '520px',
            margin: '0 auto 44px',
          }}>
            A safe, empathetic space to share your thoughts, track your moods,
            and find the support you deserve. <em>You are never alone.</em>
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              Get Started <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn btn-ghost" style={{ fontSize: '1rem', padding: '14px 28px' }}>
              Learn More
            </Link>
          </div>

          <p style={{
            marginTop: '40px', color: 'var(--text-muted)',
            fontSize: '0.82rem', letterSpacing: '0.03em',
          }}>
            🔒 &nbsp;Private &nbsp;·&nbsp; 🤝 Judgment-free &nbsp;·&nbsp; 💜 Always available
          </p>
        </div>
      </section>

      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', marginBottom: '14px' }}>
            Everything you need
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
            Thoughtfully designed tools to support your mental health journey.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card fade-in" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
              <div style={{
                width: '48px', height: '48px',
                borderRadius: '12px',
                background: f.dim,
                border: `1px solid ${f.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: f.color,
                marginBottom: '18px',
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontSize: '1.05rem', fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600, marginBottom: '10px', color: 'var(--text)',
              }}>
                {f.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container" style={{ marginTop: '80px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(155,140,255,0.12) 0%, rgba(94,207,170,0.08) 100%)',
          border: '1px solid var(--glass-border-2)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(40px, 6vw, 64px)',
          textAlign: 'center',
        }}>
          <Heart size={36} fill="var(--primary)" color="var(--primary)" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '14px' }}>
            Ready to start your journey?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '420px', margin: '0 auto 32px' }}>
            Join thousands of students taking care of their mental health every day.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ fontSize: '1rem', padding: '14px 36px' }}>
            Begin Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}