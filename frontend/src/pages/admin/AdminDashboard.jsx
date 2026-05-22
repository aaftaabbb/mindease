import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, MessageCircle, AlertOctagon } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalChats: 0, crisisCount: 0 });

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '32px' }}>Admin Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ background: 'rgba(124, 111, 247, 0.2)', padding: '16px', borderRadius: '12px' }}>
            <Users size={32} color="var(--primary)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)' }}>Total Users</p>
            <h3 style={{ fontSize: '2rem' }}>{stats.totalUsers}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ background: 'rgba(56, 201, 138, 0.2)', padding: '16px', borderRadius: '12px' }}>
            <MessageCircle size={32} color="var(--secondary)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)' }}>Total Chats</p>
            <h3 style={{ fontSize: '2rem' }}>{stats.totalChats}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '24px', border: '1px solid rgba(232, 93, 74, 0.3)' }}>
          <div style={{ background: 'rgba(232, 93, 74, 0.2)', padding: '16px', borderRadius: '12px' }}>
            <AlertOctagon size={32} color="var(--crisis)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)' }}>Crisis Alerts</p>
            <h3 style={{ fontSize: '2rem', color: 'var(--crisis)' }}>{stats.crisisCount}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
