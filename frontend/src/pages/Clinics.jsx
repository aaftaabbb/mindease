import { useState, useEffect } from 'react';
import axios from 'axios';
import { PhoneCall, MapPin, Calendar, Clock, X, CheckCircle2, Search, Building2 } from 'lucide-react';

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
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    fetchClinics();
    fetchBookings();
  }, []);

  const fetchClinics = async () => {
    try {
      const res = await api.get('/clinic');
      setClinics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get('/booking');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
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
        email: bookEmail,
      });
      setSuccess(true);
      fetchBookings();
      setTimeout(() => {
        setShowBooking(null);
        setSuccess(false);
        setBookDate('');
        setBookTime('');
        setBookReason('');
        setBookPhone('');
        setBookEmail('');
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.msg || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.delete(`/booking/${id}`);
      fetchBookings();
    } catch (err) {
      alert('Failed to cancel');
    }
  };

  const cities = [...new Set(clinics.map((c) => c.city))];
  const filtered = cityFilter ? clinics.filter((c) => c.city === cityFilter) : clinics;
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '960px', margin: '0 auto', padding: '0 20px 48px' }}>

      {/* ── Hero Section ── */}
      <div style={{
        textAlign: 'center',
        padding: '48px 24px 36px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(145deg, var(--surface), var(--surface-2))',
        border: '1px solid var(--glass-border)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '160px', height: '160px', borderRadius: '50%',
          background: 'var(--primary-dim)', opacity: 0.3, filter: 'blur(50px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-30px', left: '-30px',
          width: '120px', height: '120px', borderRadius: '50%',
          background: 'var(--secondary-dim)', opacity: 0.25, filter: 'blur(40px)',
        }} />
        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
          fontWeight: 700,
          marginBottom: '10px',
          color: 'var(--text)',
          position: 'relative',
        }}>
          Find the Right Support
        </h2>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.95rem',
          maxWidth: '480px',
          margin: '0 auto',
          lineHeight: 1.6,
          position: 'relative',
        }}>
          Browse trusted mental health clinics and helplines. Book an appointment or reach out for immediate support.
        </p>
      </div>

      {/* ── Toolbar: Bookings + City Chips ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Bookings toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
            <Building2 size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Available Resources
          </h3>
          <button
            onClick={() => setShowBookingsList(!showBookingsList)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '50px',
              background: showBookingsList ? 'var(--primary)' : 'transparent',
              border: `1px solid ${showBookingsList ? 'var(--primary)' : 'var(--glass-border)'}`,
              color: showBookingsList ? '#fff' : 'var(--text-muted)',
              fontWeight: 500, fontSize: '0.82rem', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Calendar size={14} />
            My Bookings
            {pendingBookings.length > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '20px', height: '20px', borderRadius: '50%',
                background: showBookingsList ? 'rgba(255,255,255,0.25)' : 'var(--primary-dim)',
                color: showBookingsList ? '#fff' : 'var(--primary)',
                fontSize: '0.72rem', fontWeight: 700,
              }}>
                {pendingBookings.length}
              </span>
            )}
          </button>
        </div>

        {/* City filter chips */}
        {cities.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCityFilter('')}
              style={{
                padding: '6px 14px', borderRadius: '50px',
                background: cityFilter === '' ? 'var(--primary)' : 'var(--surface)',
                border: `1px solid ${cityFilter === '' ? 'var(--primary)' : 'var(--glass-border)'}`,
                color: cityFilter === '' ? '#fff' : 'var(--text-muted)',
                fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '5px',
              }}
            >
              <Search size={12} /> All Cities
            </button>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setCityFilter(city)}
                style={{
                  padding: '6px 14px', borderRadius: '50px',
                  background: cityFilter === city ? 'var(--primary)' : 'var(--surface)',
                  border: `1px solid ${cityFilter === city ? 'var(--primary)' : 'var(--glass-border)'}`,
                  color: cityFilter === city ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}
              >
                <MapPin size={12} /> {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── My Bookings Panel ── */}
      {showBookingsList && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(20px, 4vw, 28px)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>My Bookings</h3>
            <button
              onClick={() => setShowBookingsList(false)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'var(--surface-2)', border: '1px solid var(--glass-border)',
                color: 'var(--text-muted)', cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {pendingBookings.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '12px', padding: '36px 16px', color: 'var(--text-muted)',
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'var(--surface-2)', border: '1px solid var(--glass-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Calendar size={24} style={{ opacity: 0.4 }} />
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>No active bookings</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', margin: 0 }}>
                When you book an appointment it will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendingBookings.map((b) => (
                <div
                  key={b._id}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 16px', borderRadius: 'var(--radius-lg)',
                    background: 'var(--surface-2)', border: '1px solid var(--glass-border)',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary-dim)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--glass-border)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', flexShrink: 0,
                      background: 'var(--primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CheckCircle2 size={18} color="var(--primary)" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {b.clinic?.name}
                      </p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{new Date(b.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span style={{ opacity: 0.4 }}>|</span>
                        <span>{b.time}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => cancelBooking(b._id)}
                    style={{
                      padding: '6px 14px', borderRadius: '50px',
                      border: '1px solid var(--crisis)',
                      background: 'transparent',
                      color: 'var(--crisis)',
                      fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.target.style.background = 'var(--crisis)'; e.target.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--crisis)'; }}
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Clinic Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '18px' }}>
        {filtered.map((clinic) => {
          const isHelpline = clinic.type === 'helpline';
          const accentColor = isHelpline ? 'var(--crisis)' : 'var(--primary)';
          const dimColor = isHelpline ? 'var(--crisis-dim)' : 'var(--primary-dim)';

          return (
            <div
              key={clinic._id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--glass-border)',
                borderLeft: `3px solid ${accentColor}`,
                borderRadius: 'var(--radius-xl)',
                padding: '22px',
                display: 'flex', flexDirection: 'column', gap: '14px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Header: Name + Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <h3 style={{
                  fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)',
                  margin: 0, lineHeight: 1.4,
                }}>
                  {clinic.name}
                </h3>
                <span style={{
                  fontSize: '0.68rem', padding: '3px 10px', borderRadius: '50px',
                  background: dimColor,
                  color: accentColor,
                  fontWeight: 700, letterSpacing: '0.04em',
                  whiteSpace: 'nowrap', flexShrink: 0,
                  border: `1px solid ${accentColor}22`,
                }}>
                  {clinic.type.toUpperCase()}
                </span>
              </div>

              {/* City + Phone info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  color: 'var(--text-muted)', fontSize: '0.82rem',
                }}>
                  <MapPin size={13} style={{ flexShrink: 0 }} /> {clinic.city}
                </span>
                {clinic.phone && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    color: 'var(--text-soft)', fontSize: '0.82rem',
                  }}>
                    <PhoneCall size={13} style={{ flexShrink: 0 }} /> {clinic.phone}
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '4px' }}>
                <a
                  href={`tel:${clinic.phone}`}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '10px', borderRadius: 'var(--radius-sm)',
                    background: dimColor,
                    border: `1px solid ${accentColor}33`,
                    color: accentColor,
                    fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <PhoneCall size={14} /> Call Now
                </a>
                {!isHelpline && (
                  <button
                    onClick={() => { setShowBooking(clinic); setBookPhone(''); setBookEmail(''); }}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '10px', borderRadius: 'var(--radius-sm)',
                      background: 'linear-gradient(135deg, var(--primary), #7b6de0)',
                      border: 'none', color: '#fff', fontWeight: 600, fontSize: '0.82rem',
                      cursor: 'pointer', transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    <Calendar size={14} /> Book
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '10px', padding: '48px 16px', color: 'var(--text-muted)',
        }}>
          <Search size={32} style={{ opacity: 0.3 }} />
          <p style={{ fontSize: '0.95rem', fontWeight: 500, margin: 0 }}>No clinics found</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-soft)', margin: 0 }}>Try selecting a different city</p>
        </div>
      )}

      {/* ── Booking Modal ── */}
      {showBooking && (
        <div
          onClick={() => setShowBooking(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(24px, 5vw, 32px)',
              maxWidth: '440px', width: '100%',
              maxHeight: '90vh', overflowY: 'auto',
            }}
          >
            {success ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px 0' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'var(--secondary-dim)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CheckCircle2 size={32} color="var(--secondary)" />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>Booking Confirmed!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, textAlign: 'center' }}>
                  We'll reach out to confirm your appointment.
                </p>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 4px' }}>Book Appointment</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Fill in the details below</p>
                  </div>
                  <button
                    onClick={() => setShowBooking(null)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: 'var(--surface-2)', border: '1px solid var(--glass-border)',
                      color: 'var(--text-muted)', cursor: 'pointer',
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Clinic preview */}
                <div style={{
                  padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-2)', border: '1px solid var(--glass-border)',
                  marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', flexShrink: 0,
                    background: showBooking.type === 'helpline' ? 'var(--crisis-dim)' : 'var(--primary-dim)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Building2 size={18} color={showBooking.type === 'helpline' ? 'var(--crisis)' : 'var(--primary)'} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {showBooking.name}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '1px 0 0' }}>
                      {showBooking.city} · {showBooking.type}
                    </p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Email */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-soft)' }}>
                      Email Address
                    </label>
                    <input
                      type="email" value={bookEmail} onChange={(e) => setBookEmail(e.target.value)}
                      placeholder="your@email.com" required
                      style={{
                        width: '100%', padding: '11px 14px',
                        background: 'var(--surface-2)', border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-sm)', color: 'var(--text)',
                        fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-soft)' }}>
                      Phone Number
                    </label>
                    <input
                      type="text" value={bookPhone} onChange={(e) => setBookPhone(e.target.value)}
                      placeholder="10-digit phone number" required pattern="\d{10}" maxLength={10}
                      style={{
                        width: '100%', padding: '11px 14px',
                        background: 'var(--surface-2)', border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-sm)', color: 'var(--text)',
                        fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-soft)' }}>
                      Preferred Date
                    </label>
                    <input
                      type="date" value={bookDate} onChange={(e) => setBookDate(e.target.value)}
                      min={today} required
                      style={{
                        width: '100%', padding: '11px 14px',
                        background: 'var(--surface-2)', border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-sm)', color: 'var(--text)',
                        fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-soft)' }}>
                      Preferred Time
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {timeSlots.map((slot) => {
                        const active = bookTime === slot;
                        return (
                          <button
                            key={slot} type="button" onClick={() => setBookTime(slot)}
                            style={{
                              padding: '9px 4px', borderRadius: 'var(--radius-sm)',
                              fontSize: '0.75rem', fontWeight: 500,
                              background: active ? 'var(--primary)' : 'var(--surface-2)',
                              border: `1.5px solid ${active ? 'var(--primary)' : 'var(--glass-border)'}`,
                              color: active ? '#fff' : 'var(--text)',
                              cursor: 'pointer', transition: 'all 0.15s',
                              boxShadow: active ? '0 2px 8px rgba(155,140,255,0.3)' : 'none',
                            }}
                          >
                            <Clock size={11} style={{ verticalAlign: 'middle', marginRight: '3px', opacity: 0.8 }} />
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-soft)' }}>
                      Reason <span style={{ color: 'var(--text-soft)', fontWeight: 400 }}>(optional)</span>
                    </label>
                    <textarea
                      rows="2" value={bookReason} onChange={(e) => setBookReason(e.target.value)}
                      placeholder="Brief description of your concern..."
                      style={{
                        width: '100%', padding: '11px 14px',
                        background: 'var(--surface-2)', border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-sm)', color: 'var(--text)',
                        fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none',
                        resize: 'vertical', lineHeight: 1.5,
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit" disabled={loading || !bookTime || !bookEmail}
                    style={{
                      width: '100%', padding: '13px',
                      background: loading || !bookTime || !bookEmail ? 'var(--surface-2)' : 'linear-gradient(135deg, var(--primary), #7b6de0)',
                      border: 'none', borderRadius: 'var(--radius-sm)',
                      color: loading || !bookTime || !bookEmail ? 'var(--text-muted)' : '#fff',
                      fontWeight: 600, fontSize: '0.92rem',
                      cursor: loading || !bookTime || !bookEmail ? 'not-allowed' : 'pointer',
                      transition: 'opacity 0.2s',
                      marginTop: '4px',
                    }}
                  >
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
