import { useState, useEffect } from 'react';
import axios from 'axios';
import { PhoneCall, MapPin } from 'lucide-react';

export default function Clinics() {
  const [clinics, setClinics] = useState([]);
  const [cityFilter, setCityFilter] = useState('');

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      const res = await api.get('/clinic');
      setClinics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const cities = [...new Set(clinics.map(c => c.city))];
  const filtered = cityFilter ? clinics.filter(c => c.city === cityFilter) : clinics;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <h2>Mental Health Resources</h2>
        <select 
          className="form-input" 
          style={{ width: 'auto', minWidth: '200px' }} 
          value={cityFilter} 
          onChange={e => setCityFilter(e.target.value)}
        >
          <option value="">All Cities</option>
          {cities.map(city => <option key={city} value={city}>{city}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {filtered.map(clinic => (
          <div key={clinic._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h3 style={{ color: clinic.type === 'helpline' ? 'var(--crisis)' : 'var(--primary)' }}>{clinic.name}</h3>
              <span style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)' }}>
                {clinic.type.toUpperCase()}
              </span>
            </div>
            
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <MapPin size={16} /> {clinic.city} {clinic.address && `- ${clinic.address}`}
            </p>
            
            <a href={`tel:${clinic.phone}`} className="btn btn-primary" style={{ marginTop: 'auto', display: 'flex', gap: '8px', width: '100%', backgroundColor: clinic.type === 'helpline' ? 'var(--crisis)' : 'var(--primary)' }}>
              <PhoneCall size={18} /> Call {clinic.phone}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
