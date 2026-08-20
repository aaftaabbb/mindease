import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircle2, Flame, Trophy, Calendar, Sparkles, TrendingUp, Award } from 'lucide-react';

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

  const sectionCard = {
    background: 'var(--surface)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-xl)',
    padding: 'clamp(24px, 4vw, 32px)',
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', paddingTop: '8px' }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 1.9rem)',
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: '6px',
          letterSpacing: '-0.02em',
        }}>
          Mood Tracker
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: 'clamp(0.85rem, 2vw, 1rem)',
          fontWeight: 400,
        }}>
          How are you feeling today? Take a moment to check in with yourself.
        </p>
      </div>

      {/* Streak Dashboard Card */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        padding: 'clamp(24px, 4vw, 32px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'var(--radius-xl)',
          padding: '1px',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary), var(--accent))',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
            background: 'var(--primary-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={18} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>Your Dashboard</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            textAlign: 'center', padding: '18px 8px',
            background: streak.todayLogged ? 'rgba(255,165,0,0.08)' : 'var(--surface-2)',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${streak.todayLogged ? 'rgba(255,165,0,0.25)' : 'var(--glass-border)'}`,
            transition: 'all 0.3s ease',
          }}>
            <Flame size={24} color={streak.todayLogged ? '#ffa500' : 'var(--text-muted)'} style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{streak.currentStreak}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>Day Streak</div>
          </div>
          <div style={{
            textAlign: 'center', padding: '18px 8px',
            background: 'var(--surface-2)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)',
          }}>
            <Trophy size={24} color="var(--primary)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{streak.longestStreak}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>Best Streak</div>
          </div>
          <div style={{
            textAlign: 'center', padding: '18px 8px',
            background: 'var(--surface-2)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)',
          }}>
            <Calendar size={24} color="var(--secondary)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{streak.totalEntries}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>Total Logs</div>
          </div>
        </div>

        {streak.todayLogged && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px 16px', borderRadius: 'var(--radius-md)',
            background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.2)',
            color: '#ffa500', fontSize: '0.85rem', fontWeight: 500,
          }}>
            <Flame size={15} /> You've logged today! Keep the streak alive!
          </div>
        )}

        {earnedBadges.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Award size={14} color="var(--text-muted)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Badges</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {earnedBadges.map(b => (
                <div key={b.label} title={`${b.label}: ${b.desc}`} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '50px',
                  background: 'var(--primary-dim)', border: '1px solid rgba(155,140,255,0.2)',
                  fontSize: '0.78rem', fontWeight: 500, color: 'var(--text)',
                  transition: 'transform 0.2s ease',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span>{b.icon}</span> {b.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Log Mood Card */}
      <div style={sectionCard}>
        {success && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'var(--secondary-dim)',
            border: '1px solid rgba(94,207,170,0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: '24px',
            color: 'var(--secondary)', fontSize: '0.88rem', fontWeight: 500,
          }}>
            <CheckCircle2 size={18} /> Mood logged successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Mood Emoji Selector */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(6px, 2vw, 14px)', marginBottom: '28px', flexWrap: 'wrap' }}>
            {moods.map(m => {
              const isSelected = mood === m.value;
              return (
                <button
                  key={m.value} type="button" onClick={() => setMood(m.value)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                    padding: 'clamp(14px, 2.5vw, 22px) clamp(10px, 2vw, 18px)',
                    borderRadius: 'var(--radius-lg)',
                    background: isSelected ? `${m.color}15` : 'var(--surface-2)',
                    border: `2px solid ${isSelected ? m.color : 'transparent'}`,
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                    boxShadow: isSelected ? `0 0 0 4px ${m.color}20, 0 8px 30px ${m.color}25` : 'none',
                    cursor: 'pointer',
                    minWidth: 'clamp(64px, 13vw, 90px)',
                    outline: 'none',
                  }}
                >
                  <span style={{
                    fontSize: 'clamp(2.2rem, 6vw, 3.2rem)',
                    lineHeight: 1,
                    transition: 'transform 0.3s ease',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  }}>{m.emoji}</span>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 600,
                    color: isSelected ? m.color : 'var(--text-muted)',
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    transition: 'color 0.3s',
                  }}>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Feeling indicator */}
          <div style={{
            textAlign: 'center', marginBottom: '28px',
            color: selectedMood?.color,
            fontSize: '0.9rem', fontWeight: 500,
            opacity: 0.9,
          }}>
            You're feeling <strong>{selectedMood?.label}</strong> {selectedMood?.emoji}
          </div>

          {/* Note textarea */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              marginBottom: '10px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-soft)',
            }}>
              <Sparkles size={14} />
              Add a note (optional)
            </label>
            <textarea
              rows="3" value={note} onChange={e => setNote(e.target.value)}
              placeholder="What's on your mind today? Jot down any thoughts..."
              style={{
                width: '100%', padding: '14px 16px',
                background: 'var(--surface-2)',
                border: '1.5px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text)', fontSize: '0.92rem', fontFamily: 'inherit',
                resize: 'vertical', outline: 'none',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                lineHeight: 1.6,
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px var(--primary-dim)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--glass-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Submit button */}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '15px',
            background: loading ? 'var(--surface-2)' : `linear-gradient(135deg, ${selectedMood?.color}, ${selectedMood?.color}bb)`,
            border: 'none', borderRadius: '50px',
            color: loading ? 'var(--text-muted)' : 'white',
            fontSize: '0.95rem', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: loading ? 'none' : `0 4px 24px ${selectedMood?.color}35`,
            letterSpacing: '0.02em',
          }}>
            {loading ? 'Logging...' : `Log Mood ${selectedMood?.emoji}`}
          </button>
        </form>
      </div>

      {/* Stats Chart Card */}
      <div style={{ ...sectionCard, marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={16} color="var(--accent)" />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)' }}>Mood Statistics</h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '28px', paddingLeft: '42px' }}>
          Your emotional patterns over time
        </p>

        {stats.length > 0 ? (
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} barCategoryGap="28%">
                <XAxis
                  dataKey="name"
                  stroke="var(--glass-border)"
                  tick={{ fontSize: 12, fill: 'var(--text-muted)', fontWeight: 500 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="var(--glass-border)"
                  tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }}
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    color: 'var(--text)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
                    padding: '12px 16px',
                  }}
                  itemStyle={{ color: 'var(--text)' }}
                  labelStyle={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}
                />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} maxBarSize={56}>
                  {stats.map((entry, index) => (
                    <Cell key={index} fill={entry.color} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{
            textAlign: 'center', padding: '48px 20px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface-2)',
            border: '1px dashed var(--glass-border)',
          }}>
            <div style={{ fontSize: '2.8rem', marginBottom: '14px' }}>📊</div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text)', fontWeight: 500, marginBottom: '6px' }}>
              No mood data yet
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '280px', margin: '0 auto' }}>
              Start tracking your moods to see patterns and insights over time.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
