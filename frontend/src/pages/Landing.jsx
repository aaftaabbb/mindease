import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { MessageCircle, BarChart2, Sparkles, Wind, Building, Shield, ArrowRight, Brain, BookOpen } from 'lucide-react';

const features = [
  {
    icon: <MessageCircle size={24} />,
    color: '#9b8cff',
    dim: 'var(--primary-dim)',
    title: 'AI Chat',
    desc: 'Judgment-free space that listens and understands, 24/7.',
  },
  {
    icon: <BarChart2 size={24} />,
    color: '#5ecfaa',
    dim: 'var(--secondary-dim)',
    title: 'Mood Tracking',
    desc: 'Visualize your emotional patterns and grow over time.',
  },
  {
    icon: <BookOpen size={24} />,
    color: '#f5c97a',
    dim: 'var(--accent-dim)',
    title: 'Journal',
    desc: 'Write freely with AI-powered reflections on your entries.',
  },
  {
    icon: <Wind size={24} />,
    color: '#5ecfaa',
    dim: 'var(--secondary-dim)',
    title: 'Breathing',
    desc: 'Guided breathwork to calm your nervous system instantly.',
  },
  {
    icon: <Sparkles size={24} />,
    color: '#f5c97a',
    dim: 'var(--accent-dim)',
    title: 'Affirmations',
    desc: 'Daily curated affirmations to ground and uplift you.',
  },
  {
    icon: <Building size={24} />,
    color: '#9b8cff',
    dim: 'var(--primary-dim)',
    title: 'Find Clinics',
    desc: 'Verified mental health professionals near your campus.',
  },
];

function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        obs.unobserve(el);
      }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

export default function Landing() {
  const heroRef = useScrollReveal(0.1);
  const featuresRef = useScrollReveal(0.1);
  const ctaRef = useScrollReveal(0.1);

  return (
    <div style={{ paddingBottom: '40px', overflow: 'hidden' }}>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '100px 24px 60px',
        position: 'relative',
      }}>

        {/* Floating orbs */}
        <div style={{
          position: 'absolute', top: '12%', left: '15%',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(155,140,255,0.12) 0%, transparent 70%)',
          animation: 'floatOrb 8s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '12%',
          width: '220px', height: '220px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(94,207,170,0.1) 0%, transparent 70%)',
          animation: 'floatOrb 10s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }} />

        <div ref={heroRef} style={{ maxWidth: '720px', position: 'relative' }}>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '7px 20px', borderRadius: '50px',
            background: 'var(--primary-dim)', border: '1px solid rgba(155,140,255,0.25)',
            color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: '36px',
          }}>
            <Brain size={14} strokeWidth={2.5} /> Built for College Students
          </div>

          <h1 style={{
            fontSize: 'clamp(2.6rem, 7vw, 4.2rem)',
            marginBottom: '24px',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
          }}>
            Your mind deserves{' '}
            <span style={{
              background: 'linear-gradient(135deg, #9b8cff 0%, #5ecfaa 50%, #f5c97a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              better days.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.75,
            marginBottom: '44px',
            maxWidth: '500px',
            margin: '0 auto 44px',
          }}>
            Track your moods, talk to an AI that understands,
            and build habits that actually help. <em style={{ color: 'var(--text-soft)' }}>You're not alone.</em>
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-primary" style={{
              fontSize: '1rem', padding: '15px 36px',
              boxShadow: '0 6px 30px rgba(155,140,255,0.35)',
            }}>
              Start Free <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'flex', gap: '28px', justifyContent: 'center',
            marginTop: '48px', flexWrap: 'wrap',
          }}>
            {[
              { icon: <Shield size={14} />, text: 'Private' },
              { icon: <Brain size={14} />, text: 'AI-Powered' },
              { icon: <Sparkles size={14} />, text: 'Always Free' },
            ].map((item, i) => (
              <span key={i} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 500,
              }}>
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="container" ref={featuresRef}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{
            color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px',
          }}>
            Features
          </p>
          <h2 style={{
            fontSize: 'clamp(1.7rem, 4vw, 2.4rem)',
            letterSpacing: '-0.02em',
          }}>
            Everything you need
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '18px',
        }}>
          {features.map((f, i) => (
            <FeatureCard key={i} feature={f} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container" ref={ctaRef} style={{ marginTop: '80px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(155,140,255,0.1) 0%, rgba(94,207,170,0.08) 100%)',
          border: '1px solid var(--glass-border-2)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(44px, 7vw, 72px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(155,140,255,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <Brain size={40} strokeWidth={1.5} color="var(--primary)" style={{ margin: '0 auto 22px' }} />
          <h2 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            marginBottom: '14px',
            letterSpacing: '-0.02em',
          }}>
            Ready to start?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '36px', maxWidth: '400px', margin: '0 auto 36px', lineHeight: 1.7 }}>
            Join students who chose to prioritize their mental health.
          </p>
          <Link to="/login" className="btn btn-primary" style={{
            fontSize: '1rem', padding: '15px 40px',
            boxShadow: '0 6px 30px rgba(155,140,255,0.35)',
          }}>
            Begin Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ feature, delay }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s, box-shadow 0.3s ease, border-color 0.3s ease`;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        obs.unobserve(el);
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        cursor: 'default',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 8px 32px ${feature.color}18`;
        e.currentTarget.style.borderColor = `${feature.color}40`;
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{
        width: '48px', height: '48px',
        borderRadius: '14px',
        background: feature.dim,
        border: `1px solid ${feature.color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: feature.color,
        marginBottom: '18px',
      }}>
        {feature.icon}
      </div>
      <h3 style={{
        fontSize: '1.05rem', fontFamily: 'DM Sans, sans-serif',
        fontWeight: 700, marginBottom: '8px', color: 'var(--text)',
        letterSpacing: '-0.02em',
      }}>
        {feature.title}
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>
        {feature.desc}
      </p>
    </div>
  );
}
