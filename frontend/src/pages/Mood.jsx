import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Mood() {
  const [mood, setMood] = useState('neutral');
  const [note, setNote] = useState('');
  const [stats, setStats] = useState([]);
  
  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  const moods = [
    { value: 'happy', emoji: '😊', color: '#f0b429' },
    { value: 'neutral', emoji: '😐', color: '#38c98a' },
    { value: 'sad', emoji: '😢', color: '#7c6ff7' },
    { value: 'anxious', emoji: '😰', color: '#a0a0a0' },
    { value: 'angry', emoji: '😤', color: '#e85d4a' }
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/mood/stats');
      const chartData = Object.keys(res.data).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        count: res.data[key]
      }));
      setStats(chartData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/mood', { mood, note });
      alert('Mood logged successfully!');
      setNote('');
      fetchStats();
    } catch (err) {
      alert('Failed to log mood');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <h2>Mood Tracker</h2>
      
      <div className="glass-panel" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {moods.map(m => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                style={{
                  fontSize: '3rem',
                  padding: '16px',
                  borderRadius: '16px',
                  background: mood === m.value ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: `2px solid ${mood === m.value ? m.color : 'transparent'}`,
                  transition: 'all 0.3s ease'
                }}
              >
                {m.emoji}
              </button>
            ))}
          </div>
          
          <div className="form-group">
            <label className="form-label">Add a note (optional)</label>
            <textarea 
              className="form-input" 
              rows="3" 
              value={note} 
              onChange={e => setNote(e.target.value)}
              placeholder="How are you feeling today?"
            ></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Log Mood</button>
        </form>
      </div>

      <div className="glass-panel" style={{ padding: '32px', height: '400px' }}>
        <h3 style={{ marginBottom: '24px' }}>Mood Statistics</h3>
        {stats.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats}>
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis allowDecimals={false} stroke="var(--text-muted)" />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: 'var(--bg)', borderColor: 'var(--glass-border)' }} />
              <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No mood data available yet.</p>
        )}
      </div>
    </div>
  );
}
