import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiAlertTriangle } from 'react-icons/fi';
import authService from '../../services/auth.service';
import { setUser, setLoading, setError } from '../../redux/slices/authSlice';

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const response = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // The API response is wrapped in ApiResponse: { success: true, data: { user, token } }
      const { user, token } = response.data;

      // Store JWT token
      localStorage.setItem('token', token);

      // Dispatch details to Redux
      dispatch(setUser({ user, token }));

      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const errMsg = err.message || 'Registration failed. Please try again.';
      dispatch(setError(errMsg));
      toast.error(errMsg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <h2 className="auth-card-title">Create Account</h2>
        <p className="auth-card-subtitle">
          Already have an account?
          <Link to="/login">Login</Link>
        </p>
      </div>

      {error && (
        <div className="auth-error-banner">
          <FiAlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        {/* Name Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Full Name
          </label>
          <div className="form-input-container">
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className={`form-input ${errors.name ? 'error-border' : ''}`}
              {...register('name', {
                required: 'Name is required',
              })}
            />
          </div>
          {errors.name && <span className="form-error">{errors.name.message}</span>}
        </div>

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

        {/* Confirm Password Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="form-input-container">
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className={`form-input ${errors.confirmPassword ? 'error-border' : ''}`}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />
          </div>
          {errors.confirmPassword && (
            <span className="form-error">{errors.confirmPassword.message}</span>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <>
              <div className="spinner" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  );
}

export default Register;
