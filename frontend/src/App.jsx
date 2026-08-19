import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import SOSButton from './components/SOSButton';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Chat from './pages/Chat';
import Mood from './pages/Mood';
import Breathing from './pages/Breathing';
import Affirmations from './pages/Affirmations';
import Clinics from './pages/Clinics';
import Journal from './pages/Journal';
import Articles from './pages/Articles';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCrisis from './pages/admin/AdminCrisis';

function ProtectedRoute({ children, roleRequired, token, userRole }) {
  if (!token) return <Navigate to="/login" />;
  if (roleRequired && userRole !== roleRequired) return <Navigate to="/" />;
  return children;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
      setUserRole(localStorage.getItem('role'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Navbar token={token} userRole={userRole} />
      {token && <Sidebar token={token} userRole={userRole} />}
      <div className="main-content" style={token ? { marginLeft: '220px' } : {}}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* User Routes */}
          <Route path="/chat" element={<ProtectedRoute token={token} userRole={userRole}><Chat /></ProtectedRoute>} />
          <Route path="/mood" element={<ProtectedRoute token={token} userRole={userRole}><Mood /></ProtectedRoute>} />
          <Route path="/breathing" element={<ProtectedRoute token={token} userRole={userRole}><Breathing /></ProtectedRoute>} />
          <Route path="/affirmations" element={<ProtectedRoute token={token} userRole={userRole}><Affirmations /></ProtectedRoute>} />
          <Route path="/clinics" element={<ProtectedRoute token={token} userRole={userRole}><Clinics /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute token={token} userRole={userRole}><Journal /></ProtectedRoute>} />
          <Route path="/articles" element={<ProtectedRoute token={token} userRole={userRole}><Articles /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute token={token} userRole={userRole} roleRequired="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute token={token} userRole={userRole} roleRequired="admin"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/crisis" element={<ProtectedRoute token={token} userRole={userRole} roleRequired="admin"><AdminCrisis /></ProtectedRoute>} />
        </Routes>
      </div>
      <footer className="footer" style={token ? { marginLeft: '220px' } : {}}>
        <p>Disclaimer: MindEase is an AI companion, not a replacement for professional medical advice.</p>
        <p style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Built by three sleep-deprived students — <strong style={{ color: 'var(--primary)' }}>Aftab, Adarsh & Ambar</strong>
        </p>
      </footer>
      {token && <BottomNav />}
      <SOSButton />
    </Router>
  );
}

export default App;
