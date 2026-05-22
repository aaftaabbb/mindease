import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Mood from './pages/Mood';
import Breathing from './pages/Breathing';
import Affirmations from './pages/Affirmations';
import Clinics from './pages/Clinics';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCrisis from './pages/admin/AdminCrisis';

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

  const ProtectedRoute = ({ children, roleRequired }) => {
    if (!token) return <Navigate to="/login" />;
    if (roleRequired && userRole !== roleRequired) return <Navigate to="/" />;
    return children;
  };

  return (
    <Router>
      <Navbar token={token} userRole={userRole} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* User Routes */}
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/mood" element={<ProtectedRoute><Mood /></ProtectedRoute>} />
          <Route path="/breathing" element={<ProtectedRoute><Breathing /></ProtectedRoute>} />
          <Route path="/affirmations" element={<ProtectedRoute><Affirmations /></ProtectedRoute>} />
          <Route path="/clinics" element={<ProtectedRoute><Clinics /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute roleRequired="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roleRequired="admin"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/crisis" element={<ProtectedRoute roleRequired="admin"><AdminCrisis /></ProtectedRoute>} />
        </Routes>
      </div>
      <footer className="footer">
        <p>Disclaimer: MindEase is an AI companion, not a replacement for professional medical advice.</p>
      </footer>
    </Router>
  );
}

export default App;
