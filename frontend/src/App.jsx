import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import authService from './services/auth.service';
import { setUser, logout, setLoading } from './redux/slices/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      dispatch(setLoading(true));
      try {
        const response = await authService.getProfile();
        // Backend returns response wrapped in ApiResponse: { success: true, data: { user } }
        const user = response.data?.user || response.data || response;
        dispatch(setUser({ user, token }));
      } catch (error) {
        console.error('Session restoration failed:', error);
        localStorage.removeItem('token');
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    restoreSession();
  }, [dispatch]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#f3f4f6',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#111827',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#111827',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;
