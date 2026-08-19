import { useState, useEffect } from 'react';
import axios from 'axios';
import { PhoneCall, MapPin, Calendar, Clock, X, CheckCircle2, ChevronLeft } from 'lucide-react';

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

export default function Clinics() {
  const [clinics, setClinics] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cityFilter, setCityFilter] = useState('');
  const [showBooking, setShowBooking] = useState(null);
  const [showBookingsList, setShowBookingsList] = useState(false);
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('');
  const [bookReason, setBookReason] = useState('');
  const [bookPhone, setBookPhone] = useState('');
  const [bookEmail, setBookEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => { fetchClinics(); fetchBookings(); }, []);

  const fetchClinics = async () => {
    try {
      const res = await api.get('/clinic');
      setClinics(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get('/booking');
      setBookings(res.data);
    } catch (err) { console.error(err); }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/booking', {
        clinicId: showBooking._id,
        date: bookDate,
        time: bookTime,
        reason: bookReason,
        phone: bookPhone,
        email: bookEmail
      });
      setSuccess(true);
      fetchBookings();
      setTimeout(() => {
        setShowBooking(null);
        setSuccess(false);
        setBookDate(''); setBookTime(''); setBookReason(''); setBookPhone(''); setBookEmail('');
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.msg || 'Booking failed');
    } finally { setLoading(false); }
  };

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.delete(`/booking/${id}`);
      fetchBookings();
    } catch (err) { alert('Failed to cancel'); }
  };

  const cities = [...new Set(clinics.map(c => c.city))];
  const filtered = cityFilter ? clinics.filter(c => c.city === cityFilter) : clinics;
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container main-content" style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '860px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2rem)', marginBottom: '6px' }}>Mental Health Resources</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Find help, book appointments</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {pendingBookings.length > 0 && (
            <button onClick={() => setShowBookingsList(!showBookingsList)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '9px 18px', borderRadius: '50px',
                background: showBookingsList ? 'var(--primary)' : 'var(--surface)',
                border: '1px solid var(--glass-border)',
                color: showBookingsList ? 'white' : 'var(--text)',
                fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer',
              }}
            >
              <Calendar size={15} /> My Bookings ({pendingBookings.length})
            </button>
          )}
          <select className="form-input" style={{ width: 'auto', minWidth: '160px', padding: '9px 14px', fontSize: '0.85rem' }}
            value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
            <option value="">All Cities</option>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
      </div>

      {showBookingsList && (
        <div className="fade-in" style={{
          background: 'var(--surface)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(20px, 4vw, 28px)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem' }}>My Bookings</h3>
            <button onClick={() => setShowBookingsList(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>
          {pendingBookings.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No active bookings</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendingBookings.map(b => (
                <div key={b._id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 16px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-2)', border: '1px solid var(--glass-border)',
                }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{b.clinic?.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(b.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} at {b.time}
                    </p>
                  </div>
                  <button onClick={() => cancelBooking(b._id)}
                    style={{ padding: '6px 14px', borderRadius: '50px', border: '1px solid var(--crisis)', background: 'transparent', color: 'var(--crisis)', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filtered.map(clinic => (
          <div key={clinic._id} style={{
            background: 'var(--surface)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1rem', color: clinic.type === 'helpline' ? 'var(--crisis)' : 'var(--primary)' }}>{clinic.name}</h3>
              <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '12px', background: 'var(--surface-2)', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.03em' }}>
                {clinic.type.toUpperCase()}
              </span>
            </div>

            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              <MapPin size={14} /> {clinic.city}
            </p>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <a href={`tel:${clinic.phone}`} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '10px', borderRadius: '50px',
                background: clinic.type === 'helpline' ? 'var(--crisis-dim)' : 'var(--primary-dim)',
                border: `1px solid ${clinic.type === 'helpline' ? 'rgba(255,123,114,0.3)' : 'rgba(155,140,255,0.3)'}`,
                color: clinic.type === 'helpline' ? 'var(--crisis)' : 'var(--primary)',
                fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none',
              }}>
                <PhoneCall size={14} /> Call
              </a>
              {clinic.type !== 'helpline' && (
                <button onClick={() => { setShowBooking(clinic); setBookPhone(''); setBookEmail(''); }}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '10px', borderRadius: '50px',
                    background: 'linear-gradient(135deg, var(--primary), #7b6de0)',
                    border: 'none', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                  }}
                >
                  <Calendar size={14} /> Book
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showBooking && (
        <div className="modal-overlay" onClick={() => setShowBooking(null)}>
          <div className="modal-content fade-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', width: '90%' }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={48} color="var(--secondary)" style={{ marginBottom: '16px' }} />
                <h3 style={{ marginBottom: '8px' }}>Booking Confirmed!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>We'll reach out to confirm your appointment.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>Book Appointment</h3>
                  <button onClick={() => setShowBooking(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={18} />
                  </button>
                </div>

                <div style={{
                  padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-2)', marginBottom: '20px',
                  border: '1px solid var(--glass-border)',
                }}>
                  <p style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.95rem' }}>{showBooking.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{showBooking.city} · {showBooking.type}</p>
                </div>

                <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-soft)' }}>Your Email</label>
                    <input type="email" value={bookEmail} onChange={e => setBookEmail(e.target.value)} placeholder="your@email.com" required
                      style={{ width: '100%', padding: '11px 14px', background: 'var(--surface-2)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-soft)' }}>Your Phone</label>
                    <input type="text" value={bookPhone} onChange={e => setBookPhone(e.target.value)} placeholder="10-digit phone" required
                      pattern="\d{10}" maxLength={10}
                      style={{ width: '100%', padding: '11px 14px', background: 'var(--surface-2)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-soft)' }}>Preferred Date</label>
                    <input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} min={today} required
                      style={{ width: '100%', padding: '11px 14px', background: 'var(--surface-2)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-soft)' }}>Preferred Time</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      {timeSlots.map(slot => (
                        <button key={slot} type="button" onClick={() => setBookTime(slot)}
                          style={{
                            padding: '8px 4px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 500,
                            background: bookTime === slot ? 'var(--primary)' : 'var(--surface-2)',
                            border: `1px solid ${bookTime === slot ? 'var(--primary)' : 'var(--glass-border)'}`,
                            color: bookTime === slot ? 'white' : 'var(--text)',
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}
                        >{slot}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-soft)' }}>Reason (optional)</label>
                    <textarea rows="2" value={bookReason} onChange={e => setBookReason(e.target.value)} placeholder="Brief description..."
                      style={{ width: '100%', padding: '11px 14px', background: 'var(--surface-2)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical', lineHeight: 1.5 }} />
                  </div>
                  <button type="submit" disabled={loading || !bookTime || !bookEmail}
                    style={{
                      width: '100%', padding: '13px',
                      background: loading || !bookTime ? 'var(--surface-3)' : 'linear-gradient(135deg, var(--primary), #7b6de0)',
                      border: 'none', borderRadius: '50px', color: 'white', fontWeight: 600, fontSize: '0.95rem',
                      cursor: loading || !bookTime ? 'not-allowed' : 'pointer',
                    }}
                  >{loading ? 'Booking...' : 'Confirm Booking'}</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
