import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Plus, Trash2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const moods = [
  { value: 'happy', emoji: '😊', color: '#f5c97a' },
  { value: 'sad', emoji: '😢', color: '#5ecfaa' },
  { value: 'anxious', emoji: '😰', color: '#a0a0a0' },
  { value: 'angry', emoji: '😤', color: '#ff7b72' },
  { value: 'neutral', emoji: '😐', color: '#9b8cff' },
];

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [loading, setLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => { fetchEntries(); }, [page]);

  const fetchEntries = async () => {
    try {
      const res = await api.get(`/journal?page=${page}&limit=5`);
      setEntries(res.data.entries);
      setTotalPages(res.data.pages);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/journal', { title, content, mood });
      setTitle(''); setContent(''); setMood('neutral');
      setShowForm(false);
      setPage(1);
      fetchEntries();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to save entry');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await api.delete(`/journal/${id}`);
      fetchEntries();
      if (selectedEntry?._id === id) setSelectedEntry(null);
    } catch (err) { alert('Failed to delete'); }
  };

  const getMoodData = (m) => moods.find(mood => mood.value === m) || moods[4];

  return (
    <div className="container main-content" style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '720px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2rem)', marginBottom: '6px' }}>Journal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Write your thoughts, get AI reflections</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setSelectedEntry(null); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', borderRadius: '50px',
            background: 'linear-gradient(135deg, var(--primary), #7b6de0)',
            border: 'none', color: 'white', fontWeight: 600, fontSize: '0.9rem',
            cursor: 'pointer', boxShadow: '0 4px 16px var(--primary-glow)',
          }}
        >
          <Plus size={16} /> New Entry
        </button>
      </div>

      {showForm && (
        <div className="fade-in" style={{
          background: 'var(--surface)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(24px, 4vw, 32px)',
        }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>New Journal Entry</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {moods.map(m => (
                <button
                  key={m.value} type="button"
                  onClick={() => setMood(m.value)}
                  style={{
                    padding: '10px', borderRadius: '12px',
                    background: mood === m.value ? `${m.color}20` : 'var(--surface-2)',
                    border: `2px solid ${mood === m.value ? m.color : 'transparent'}`,
                    cursor: 'pointer', transition: 'all 0.2s',
                    transform: mood === m.value ? 'scale(1.15)' : 'scale(1)',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{m.emoji}</span>
                </button>
              ))}
            </div>

            <input
              type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Entry title..."
              maxLength={100} required
              style={{
                padding: '13px 16px', background: 'var(--surface-2)',
                border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)',
                color: 'var(--text)', fontSize: '0.95rem', fontFamily: 'inherit',
                outline: 'none',
              }}
            />

            <textarea
              rows="6" value={content} onChange={e => setContent(e.target.value)}
              placeholder="Write what's on your mind..."
              maxLength={2000} required
              style={{
                padding: '13px 16px', background: 'var(--surface-2)',
                border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)',
                color: 'var(--text)', fontSize: '0.95rem', fontFamily: 'inherit',
                resize: 'vertical', outline: 'none', lineHeight: 1.6,
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{content.length}/2000</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{
                    padding: '10px 20px', borderRadius: '50px',
                    background: 'transparent', border: '1px solid var(--glass-border)',
                    color: 'var(--text-muted)', fontWeight: 500, cursor: 'pointer', fontSize: '0.9rem',
                  }}
                >Cancel</button>
                <button type="submit" disabled={loading}
                  style={{
                    padding: '10px 24px', borderRadius: '50px',
                    background: loading ? 'var(--surface-3)' : 'linear-gradient(135deg, var(--primary), #7b6de0)',
                    border: 'none', color: 'white', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                  }}
                >{loading ? 'Saving...' : 'Save Entry'}</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {selectedEntry && (
        <div className="fade-in" style={{
          background: 'var(--surface)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(24px, 4vw, 32px)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>{getMoodData(selectedEntry.mood).emoji}</span>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{selectedEntry.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {new Date(selectedEntry.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <button onClick={() => setSelectedEntry(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <ChevronLeft size={20} /> Back
            </button>
          </div>

          <p style={{ color: 'var(--text)', fontSize: '0.95rem', lineHeight: 1.75, whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
            {selectedEntry.content}
          </p>

          {selectedEntry.reflection && (
            <div style={{
              background: 'var(--primary-dim)',
              border: '1px solid rgba(155,140,255,0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 18px',
              display: 'flex', gap: '10px', alignItems: 'flex-start',
            }}>
              <Sparkles size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>AI Reflection</p>
                <p style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.6 }}>{selectedEntry.reflection}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {!showForm && !selectedEntry && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {entries.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 24px',
              background: 'var(--surface)', border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
            }}>
              <BookOpen size={40} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No journal entries yet. Start writing!</p>
            </div>
          ) : entries.map(entry => {
            const m = getMoodData(entry.mood);
            return (
              <div key={entry._id}
                onClick={() => setSelectedEntry(entry)}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '20px 24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flex: 1 }}>
                  <span style={{ fontSize: '1.8rem' }}>{m.emoji}</span>
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(entry.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      {' · '}
                      <span style={{ color: m.color }}>{entry.mood}</span>
                    </p>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(entry._id); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--crisis)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding: '8px 16px', borderRadius: '50px', border: '1px solid var(--glass-border)', background: 'var(--surface)', color: 'var(--text)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>
                <ChevronLeft size={16} /> Prev
              </button>
              <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {page} / {totalPages}
              </span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ padding: '8px 16px', borderRadius: '50px', border: '1px solid var(--glass-border)', background: 'var(--surface)', color: 'var(--text)', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
