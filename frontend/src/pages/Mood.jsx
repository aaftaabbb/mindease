import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircle2, Flame, Trophy, Calendar } from 'lucide-react';

export default function Mood() {
  const [mood, setMood] = useState('neutral');
  const [note, setNote] = useState('');
  const [stats, setStats] = useState([]);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, totalEntries: 0, todayLogged: false });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  const moods = [
    { value: 'happy',   emoji: '😊', color: '#f5c97a', label: 'Happy' },
    { value: 'neutral', emoji: '😐', color: '#9b8cff', label: 'Neutral' },
    { value: 'sad',     emoji: '😢', color: '#5ecfaa', label: 'Sad' },
    { value: 'anxious', emoji: '😰', color: '#a0a0a0', label: 'Anxious' },
    { value: 'angry',   emoji: '😤', color: '#ff7b72', label: 'Angry' },
  ];

  const badges = [
    { threshold: 1, icon: '🌱', label: 'First Step', desc: 'Log your first mood' },
    { threshold: 3, icon: '🔥', label: 'On Fire', desc: '3 day streak' },
    { threshold: 7, icon: '⭐', label: 'Week Warrior', desc: '7 day streak' },
    { threshold: 14, icon: '💎', label: 'Diamond Mind', desc: '14 day streak' },
    { threshold: 30, icon: '👑', label: 'Mood Master', desc: '30 day streak' },
  ];

  useEffect(() => { fetchStats(); fetchStreak(); }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/mood/stats');
      const chartData = Object.keys(res.data).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        count: res.data[key],
        color: moods.find(m => m.value === key)?.color || 'var(--primary)',
      }));
      setStats(chartData);
    } catch (err) { console.error(err); }
  };

  const fetchStreak = async () => {
    try {
      const res = await api.get('/mood/streak');
      setStreak(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/mood', { mood, note });
      setNote('');
      setSuccess(true);
      fetchStats();
      fetchStreak();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Failed to log mood');
    } finally { setLoading(false); }
  };

  const selectedMood = moods.find(m => m.value === mood);
  const earnedBadges = badges.filter(b => streak.currentStreak >= b.threshold || streak.longestStreak >= b.threshold);

  return (
    <div className="container main-content" style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '720px' }}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2rem)', marginBottom: '6px' }}>Mood Tracker</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>How are you feeling today?</p>
      </div>

      {/* Streak & Badges Card */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'clamp(20px, 4vw, 28px)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
          <div style={{
            textAlign: 'center', padding: '16px 8px',
            background: streak.todayLogged ? 'rgba(255,165,0,0.08)' : 'var(--surface-2)',
            borderRadius: 'var(--radius-sm)',
            border: `1px solid ${streak.todayLogged ? 'rgba(255,165,0,0.3)' : 'var(--glass-border)'}`,
          }}>
            <Flame size={22} color={streak.todayLogged ? '#ffa500' : 'var(--text-muted)'} style={{ marginBottom: '6px' }} />
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>{streak.currentStreak}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Day Streak</div>
          </div>
          <div style={{
            textAlign: 'center', padding: '16px 8px',
            background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--glass-border)',
          }}>
            <Trophy size={22} color="var(--primary)" style={{ marginBottom: '6px' }} />
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>{streak.longestStreak}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Best Streak</div>
          </div>
          <div style={{
            textAlign: 'center', padding: '16px 8px',
            background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--glass-border)',
          }}>
            <Calendar size={22} color="var(--secondary)" style={{ marginBottom: '6px' }} />
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>{streak.totalEntries}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Logs</div>
          </div>
        </div>

        {earnedBadges.length > 0 && (
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 500 }}>Your Badges</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {earnedBadges.map(b => (
                <div key={b.label} title={`${b.label}: ${b.desc}`} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '50px',
                  background: 'var(--primary-dim)', border: '1px solid rgba(155,140,255,0.2)',
                  fontSize: '0.8rem', fontWeight: 500, color: 'var(--text)',
                }}>
                  <span>{b.icon}</span> {b.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {streak.todayLogged && (
          <div style={{
            marginTop: '14px', padding: '10px 16px', borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.2)',
            color: '#ffa500', fontSize: '0.85rem', fontWeight: 500, textAlign: 'center',
          }}>
            🔥 You've logged today! Keep the streak alive!
          </div>
        )}
      </div>

      {/* Log Mood Card */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'clamp(24px, 4vw, 40px)',
      }}>

        {success && (
          <div className="fade-in" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'var(--secondary-dim)',
            border: '1px solid rgba(94,207,170,0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            marginBottom: '24px',
            color: 'var(--secondary)', fontSize: '0.9rem', fontWeight: 500,
          }}>
            <CheckCircle2 size={18} /> Mood logged successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div style={{
            display: 'flex', justifyContent: 'center',
            gap: 'clamp(8px, 2vw, 16px)',
            marginBottom: '32px', flexWrap: 'wrap',
          }}>
            {moods.map(m => (
              <button
                key={m.value} type="button" onClick={() => setMood(m.value)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  padding: 'clamp(12px, 2vw, 18px)',
                  borderRadius: '18px',
                  background: mood === m.value ? `${m.color}18` : 'var(--surface-2)',
                  border: `2px solid ${mood === m.value ? m.color : 'transparent'}`,
                  transition: 'all 0.25s ease',
                  transform: mood === m.value ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: mood === m.value ? `0 8px 24px ${m.color}30` : 'none',
                  cursor: 'pointer',
                  minWidth: 'clamp(60px, 12vw, 80px)',
                }}
              >
                <span style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', lineHeight: 1 }}>{m.emoji}</span>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600,
                  color: mood === m.value ? m.color : 'var(--text-muted)',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  transition: 'color 0.25s',
                }}>{m.label}</span>
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px', color: selectedMood?.color, fontSize: '0.88rem', fontWeight: 500, opacity: 0.9 }}>
            You're feeling <strong>{selectedMood?.label}</strong> {selectedMood?.emoji}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-soft)' }}>Add a note (optional)</label>
            <textarea rows="3" value={note} onChange={e => setNote(e.target.value)} placeholder="What's on your mind today?"
              style={{
                width: '100%', padding: '13px 16px', background: 'var(--surface-2)',
                border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)',
                color: 'var(--text)', fontSize: '0.95rem', fontFamily: 'inherit',
                resize: 'vertical', outline: 'none', transition: 'border-color 0.25s', lineHeight: 1.6,
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--glass-border)'}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? 'var(--surface-3)' : `linear-gradient(135deg, ${selectedMood?.color}, ${selectedMood?.color}cc)`,
            border: 'none', borderRadius: '50px',
            color: 'white', fontSize: '0.97rem', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: loading ? 'none' : `0 4px 20px ${selectedMood?.color}40`,
          }}>
            {loading ? 'Logging...' : `Log Mood ${selectedMood?.emoji}`}
          </button>
        </form>
      </div>

      {/* Stats Card */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'clamp(24px, 4vw, 40px)',
      }}>
        <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>Mood Statistics</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '28px' }}>Your emotional patterns over time</p>

        {stats.length > 0 ? (
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} barCategoryGap="30%">
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} stroke="var(--text-muted)" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)', radius: 8 }} contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--glass-border)', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={56}>
                  {stats.map((entry, index) => <Cell key={index} fill={entry.color} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📊</div>
            <p style={{ fontSize: '0.9rem' }}>No mood data yet. Log your first mood above!</p>
          </div>
        )}
      </div>

    </div>
  );
}