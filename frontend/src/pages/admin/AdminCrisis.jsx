import { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertOctagon } from 'lucide-react';

export default function AdminCrisis() {
  const [crisisLogs, setCrisisLogs] = useState([]);

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    fetchCrisisLogs();
  }, []);

  const fetchCrisisLogs = async () => {
    try {
      const res = await api.get('/admin/crisis');
      // Sort by timestamp descending
      const sorted = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setCrisisLogs(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <AlertOctagon size={32} color="var(--crisis)" />
        <h2 style={{ color: 'var(--crisis)' }}>Crisis Alerts Log</h2>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {crisisLogs.map((log, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--crisis)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '1.1rem' }}>{log.user?.name || 'Unknown User'}</strong>
                <a href={`tel:${log.user?.phone}`} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                  {log.user?.phone || 'No phone'}
                </a>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
            <div style={{ background: 'rgba(232, 93, 74, 0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(232, 93, 74, 0.2)' }}>
              <strong>Message Trigger: </strong>
              "{log.message}"
            </div>
          </div>
        ))}
        {crisisLogs.length === 0 && (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No crisis alerts logged.
          </div>
        )}
      </div>
    </div>
  );
}
