import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Trash2, Heart, Bot } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => { fetchHistory(); }, []);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/chat/history');
      setMessages(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);
    try {
      const res = await api.post('/chat/message', { message: userMsg });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response, isCrisis: res.data.isCrisis }]);
      if (res.data.isCrisis) setShowCrisis(true);
    } catch (err) {
      alert('Failed to send message');
    } finally { setIsTyping(false); }
  };

  const clearChat = async () => {
    if (!confirm('Clear all chat history?')) return;
    try {
      await api.delete('/chat/clear');
      setMessages([]);
    } catch (err) { alert('Failed to clear chat'); }
  };

  return (
    <div style={{
      height: 'calc(100vh - 65px)',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '860px',
      margin: '0 auto',
      padding: '0 16px',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 0 14px',
        borderBottom: '1px solid var(--glass-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'var(--primary-dim)',
            border: '1px solid rgba(155,140,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Heart size={17} fill="var(--primary)" color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.97rem', color: 'var(--text)' }}>MindEase</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--secondary)', display: 'inline-block' }} />
              Always here for you
            </div>
          </div>
        </div>
        <button onClick={clearChat} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 500,
          padding: '7px 14px', borderRadius: '50px',
          border: '1px solid var(--glass-border)',
          background: 'var(--glass-bg)',
          transition: 'all 0.2s ease',
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--crisis)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <Trash2 size={14} /> Clear
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '24px 0',
        display: 'flex', flexDirection: 'column', gap: '14px',
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--glass-border) transparent',
      }}>
        {messages.length === 0 && (
          <div style={{
            margin: 'auto', textAlign: 'center',
            padding: '40px 24px',
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'var(--primary-dim)',
              border: '1px solid rgba(155,140,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px',
            }}>
              <Bot size={28} color="var(--primary)" />
            </div>
            <p style={{ color: 'var(--text)', fontWeight: 600, marginBottom: '8px', fontSize: '1rem' }}>
              Hi, I'm MindEase 💜
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '280px', margin: '0 auto', lineHeight: 1.65 }}>
              A safe space to share how you're feeling. I'm here to listen, always.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            gap: '10px',
            alignItems: 'flex-end',
            animation: 'fadeIn 0.3s ease',
          }}>
            {/* AI Avatar */}
            {msg.role === 'assistant' && (
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                background: msg.isCrisis ? 'var(--crisis-dim)' : 'var(--primary-dim)',
                border: `1px solid ${msg.isCrisis ? 'rgba(255,123,114,0.3)' : 'rgba(155,140,255,0.3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Heart size={13} fill={msg.isCrisis ? 'var(--crisis)' : 'var(--primary)'} color={msg.isCrisis ? 'var(--crisis)' : 'var(--primary)'} />
              </div>
            )}

            {/* Bubble */}
            <div style={{
              maxWidth: 'min(72%, 520px)',
              padding: '12px 18px',
              borderRadius: '18px',
              borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
              borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '18px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, var(--primary), #7b6de0)'
                : msg.isCrisis
                  ? 'var(--crisis-dim)'
                  : 'var(--surface-2)',
              color: msg.role === 'user' ? 'white' : 'var(--text)',
              border: msg.role === 'assistant'
                ? `1px solid ${msg.isCrisis ? 'rgba(255,123,114,0.3)' : 'var(--glass-border)'}`
                : 'none',
              boxShadow: msg.role === 'user' ? '0 4px 16px var(--primary-glow)' : 'none',
              fontSize: '0.93rem',
              lineHeight: 1.65,
              wordBreak: 'break-word',
            }}>
              {msg.isCrisis && (
                <div style={{ color: 'var(--crisis)', fontWeight: 600, marginBottom: '6px', fontSize: '0.82rem' }}>
                  ⚠️ Crisis Support
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
              background: 'var(--primary-dim)',
              border: '1px solid rgba(155,140,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Heart size={13} fill="var(--primary)" color="var(--primary)" />
            </div>
            <div style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--glass-border)',
              padding: '14px 18px', borderRadius: '18px', borderBottomLeftRadius: '4px',
              display: 'flex', gap: '5px', alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'inline-block',
                  animation: 'typingDot 1.2s infinite',
                  animationDelay: `${i * 0.2}s`,
                  opacity: 0.4,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '14px 0 20px',
        borderTop: '1px solid var(--glass-border)',
      }}>
        <form onSubmit={handleSend} style={{
          display: 'flex', gap: '10px', alignItems: 'center',
          background: 'var(--surface)',
          border: '1px solid var(--glass-border)',
          borderRadius: '50px',
          padding: '6px 6px 6px 20px',
          transition: 'border-color 0.25s, box-shadow 0.25s',
        }}
          onFocus={() => {}}
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Share how you're feeling..."
            style={{
              flex: 1, background: 'transparent',
              border: 'none', outline: 'none',
              color: 'var(--text)', fontSize: '0.95rem',
              fontFamily: 'inherit',
              padding: '8px 0',
            }}
          />
          <button type="submit" disabled={!input.trim()} style={{
            width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
            background: input.trim()
              ? 'linear-gradient(135deg, var(--primary), #7b6de0)'
              : 'var(--surface-2)',
            border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.25s ease',
            boxShadow: input.trim() ? '0 4px 14px var(--primary-glow)' : 'none',
          }}>
            <Send size={17} color={input.trim() ? 'white' : 'var(--text-muted)'} />
          </button>
        </form>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '10px' }}>
          MindEase is an AI companion, not a replacement for professional help.
        </p>
      </div>

      {/* Crisis Modal */}
      {showCrisis && (
        <div className="modal-overlay">
          <div className="modal-content fade-in" style={{ textAlign: 'center' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'var(--crisis-dim)', margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,123,114,0.4)',
            }}>
              <Heart size={24} fill="var(--crisis)" color="var(--crisis)" />
            </div>
            <h2 style={{ color: 'var(--crisis)', marginBottom: '12px', fontSize: '1.4rem' }}>
              You are not alone.
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.7, fontSize: '0.92rem' }}>
              We care deeply about you. Please reach out to a professional right now — help is just a call away.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <a href="tel:9152987821" className="btn btn-crisis">
                📞 iCall TISS — 9152987821
              </a>
              <a href="tel:18602662345" className="btn btn-crisis">
                📞 Vandrevala Foundation — 18602662345
              </a>
            </div>
            <button onClick={() => setShowCrisis(false)} style={{
              width: '100%', padding: '12px',
              background: 'transparent',
              border: '1px solid var(--glass-border)',
              borderRadius: '50px', color: 'var(--text-muted)',
              fontWeight: 500, fontSize: '0.9rem',
              cursor: 'pointer', marginTop: '8px',
            }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}