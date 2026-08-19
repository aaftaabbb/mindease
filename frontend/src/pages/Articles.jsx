import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Clock, ArrowLeft, Search, Tag, ChevronRight } from 'lucide-react';

const categories = [
  { value: '', label: 'All', emoji: '📚' },
  { value: 'anxiety', label: 'Anxiety', emoji: '😰' },
  { value: 'depression', label: 'Depression', emoji: '💙' },
  { value: 'stress', label: 'Stress', emoji: '🔥' },
  { value: 'sleep', label: 'Sleep', emoji: '🌙' },
  { value: 'mindfulness', label: 'Mindfulness', emoji: '🧘' },
  { value: 'self-care', label: 'Self-Care', emoji: '💚' },
  { value: 'relationships', label: 'Relationships', emoji: '🤝' },
  { value: 'general', label: 'General', emoji: '✨' },
];

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [articleLoading, setArticleLoading] = useState(false);

  useEffect(() => { fetchArticles(); }, [category, search]);

  const openArticle = async (article) => {
    setArticleLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/articles/${article.slug}`);
      setSelected(res.data);
    } catch (err) { console.error(err); }
    finally { setArticleLoading(false); }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/articles`, { params });
      setArticles(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (selected) {
    return (
      <div className="container main-content" style={{ maxWidth: '720px' }}>
        <button onClick={() => setSelected(null)} style={{
          display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px',
          color: 'var(--text-muted)', fontSize: '0.88rem', background: 'none',
          border: 'none', cursor: 'pointer', padding: 0,
        }}>
          <ArrowLeft size={16} /> Back to Articles
        </button>

        <div className="fade-in">
          <div style={{ marginBottom: '8px' }}>
            <span style={{
              fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.06em', color: 'var(--primary)',
              background: 'var(--primary-dim)', padding: '4px 10px',
              borderRadius: '50px', border: '1px solid rgba(155,140,255,0.2)',
            }}>
              {categories.find(c => c.value === selected.category)?.emoji} {selected.category}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700,
            color: 'var(--text)', lineHeight: 1.3, margin: '16px 0',
          }}>{selected.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {selected.readTime} min read</span>
            <span>{new Date(selected.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(24px, 4vw, 40px)',
            lineHeight: 1.8,
            color: 'var(--text)',
          }}>
            {articleLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>Loading...</div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: selected.content }} style={{
                fontSize: '0.95rem',
              }} />
            )}
          </div>

          {selected.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '20px' }}>
              {selected.tags.map(tag => (
                <span key={tag} style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '4px 12px', borderRadius: '50px',
                  background: 'var(--surface-2)', border: '1px solid var(--glass-border)',
                  fontSize: '0.75rem', color: 'var(--text-muted)',
                }}><Tag size={10} /> {tag}</span>
              ))}
            </div>
          )}

          <div style={{
            marginTop: '32px', padding: '20px 24px',
            background: 'var(--crisis-dim)',
            border: '1px solid rgba(255,123,114,0.2)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text)',
          }}>
            <strong>⚠️ Important:</strong> This article is for educational purposes only. If you're struggling, please reach out to a professional or call a helpline. You are not alone.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container main-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '860px' }}>
      <div>
        <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2rem)', marginBottom: '6px' }}>Psychoeducation</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Learn about mental health, one article at a time</p>
      </div>

      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search articles..."
          style={{
            width: '100%', padding: '12px 14px 12px 40px',
            background: 'var(--surface)', border: '1px solid var(--glass-border)',
            borderRadius: '50px', color: 'var(--text)', fontSize: '0.9rem',
            fontFamily: 'inherit', outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {categories.map(c => (
          <button key={c.value} onClick={() => setCategory(c.value)} style={{
            padding: '7px 14px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 500,
            whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s',
            background: category === c.value ? 'var(--primary)' : 'var(--surface)',
            border: `1px solid ${category === c.value ? 'var(--primary)' : 'var(--glass-border)'}`,
            color: category === c.value ? 'white' : 'var(--text-muted)',
          }}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <Loader />
        </div>
      ) : articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          <BookOpen size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <p>No articles found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {articles.map(article => (
            <div key={article._id} onClick={() => openArticle(article)} className="fade-in" style={{
              background: 'var(--surface)', border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)', padding: '24px',
              cursor: 'pointer', transition: 'all 0.25s',
              display: 'flex', flexDirection: 'column',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.05em', color: 'var(--primary)',
                  background: 'var(--primary-dim)', padding: '3px 8px',
                  borderRadius: '50px',
                }}>
                  {categories.find(c => c.value === article.category)?.emoji} {article.category}
                </span>
                {article.featured && (
                  <span style={{ fontSize: '0.65rem', color: '#f5c97a', fontWeight: 600 }}>⭐ Featured</span>
                )}
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '8px', lineHeight: 1.3 }}>{article.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, flex: 1 }}>{article.excerpt}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--glass-border)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <Clock size={12} /> {article.readTime} min
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 500 }}>
                  Read <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <div style={{
        width: '32px', height: '32px', border: '3px solid var(--surface-3)',
        borderTopColor: 'var(--primary)', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );
}
