import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiAlertTriangle } from 'react-icons/fi';
import authService from '../../services/auth.service';
import { setUser, setLoading, setError } from '../../redux/slices/authSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const rememberedEmail = localStorage.getItem('rememberedEmail') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: rememberedEmail,
      password: '',
      rememberMe: !!rememberedEmail,
    },
  });

  const onSubmit = async (data) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });

      // The API response is wrapped in ApiResponse: { success: true, data: { user, token } }
      const { user, token } = response.data;

      // Handle Remember Me
      if (data.rememberMe) {
        localStorage.setItem('rememberedEmail', data.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Store JWT token
      localStorage.setItem('token', token);

      // Dispatch details to Redux
      dispatch(setUser({ user, token }));

      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err) {
      const errMsg = err.message || 'Login failed. Please check your credentials.';
      dispatch(setError(errMsg));
      toast.error(errMsg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <h2 className="auth-card-title">Welcome Back</h2>
        <p className="auth-card-subtitle">
          Don't have an account?
          <Link to="/register">Register</Link>
        </p>
      </div>

      {error && (
        <div className="auth-error-banner">
          <FiAlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <div className="form-input-container">
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className={`form-input ${errors.email ? 'error-border' : ''}`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address format',
                },
              })}
            />
          </div>
          {errors.email && <span className="form-error">{errors.email.message}</span>}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <div className="form-input-container">
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={`form-input ${errors.password ? 'error-border' : ''}`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
          </div>
          {errors.password && <span className="form-error">{errors.password.message}</span>}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="form-actions">
          <label className="form-checkbox-label" htmlFor="rememberMe">
            <input
              id="rememberMe"
              type="checkbox"
              className="form-checkbox"
              {...register('rememberMe')}
            />
            Remember Me
          </label>
          <a
            href="/forgot-password"
            onClick={(e) => {
              e.preventDefault();
              toast('Password recovery flow is under development.');
            }}
            className="forgot-password-link"
          >
            Forgot Password?
          </a>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <>
              <div className="spinner" />
              Logging in...
            </>
          ) : (
            'Log In'
          )}
        </button>
      </form>
    </div>
  );
}

export default Login;
