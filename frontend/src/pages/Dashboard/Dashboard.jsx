import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { logout } from '../../redux/slices/authSlice';
import authService from '../../services/auth.service';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (_) {
      // Continue logout even if API call fails
    } finally {
      localStorage.removeItem('token');
      dispatch(logout());
      toast.success('Logged out successfully.');
      navigate('/login');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '1.5rem',
        padding: '2rem',
        backgroundColor: '#0b0f19',
        color: '#f3f4f6',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #6366f1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Welcome to CryptoVerseX
      </h1>

      {user && (
        <p style={{ color: '#9ca3af', fontSize: '1rem' }}>
          Logged in as <strong style={{ color: '#f3f4f6' }}>{user.name || user.email}</strong>
        </p>
      )}

      <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
        Dashboard module is under active development.
      </p>

      <button
        onClick={handleLogout}
        style={{
          padding: '0.75rem 2rem',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          color: '#fca5a5',
          fontSize: '0.9rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        }}
      >
        Log Out
      </button>
    </div>
  );
}

export default Dashboard;
