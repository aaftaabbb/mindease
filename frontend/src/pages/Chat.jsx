import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Trash2 } from 'lucide-react';

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

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/chat/history');
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
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
      if (res.data.isCrisis) {
        setShowCrisis(true);
      }
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = async () => {
    if (!confirm('Are you sure you want to clear chat history?')) return;
    try {
      await api.delete('/chat/clear');
      setMessages([]);
    } catch (err) {
      alert('Failed to clear chat');
    }
  };

  return (
    <div className="container" style={{ height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>MindEase Chat</h2>
        <button onClick={clearChat} className="btn" style={{ color: 'var(--crisis)', display: 'flex', gap: '8px' }}>
          <Trash2 size={18} /> Clear Chat
        </button>
      </div>

      <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 'auto', marginBottom: 'auto' }}>
            No messages yet. Say hello to MindEase!
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '70%',
            padding: '12px 16px',
            borderRadius: '16px',
            borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
            borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
            backgroundColor: msg.role === 'user' ? 'var(--primary)' : (msg.isCrisis ? 'var(--crisis)' : 'rgba(255,255,255,0.1)'),
            color: 'white',
            border: msg.role === 'assistant' && !msg.isCrisis ? '1px solid var(--glass-border)' : 'none'
          }}>
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '16px', color: 'var(--text-muted)' }}>
            MindEase is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
        <input 
          type="text" 
          className="form-input" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Type your message..." 
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>
          <Send size={20} />
        </button>
      </form>

      {showCrisis && (
        <div className="modal-overlay">
          <div className="modal-content fade-in" style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'var(--crisis)', marginBottom: '16px' }}>You are not alone.</h2>
            <p style={{ marginBottom: '24px' }}>We are here for you. Please reach out to professional help immediately.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <a href="tel:9152987821" className="btn btn-crisis">Call iCall TISS: 9152987821</a>
              <a href="tel:18602662345" className="btn btn-crisis">Call Vandrevala Foundation: 18602662345</a>
            </div>
            <button onClick={() => setShowCrisis(false)} className="btn" style={{ border: '1px solid var(--glass-border)', width: '100%' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
