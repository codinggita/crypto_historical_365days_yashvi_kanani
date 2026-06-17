import React from 'react';
import { useForm } from 'react-hook-form';

export function LoginForm({ onSubmit, loading, externalError }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
      {externalError && (
        <div className="error-message" style={{ marginBottom: '1rem', color: 'var(--color-danger)', fontSize: '0.875rem' }}>
          {externalError}
        </div>
      )}

      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="login-email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Email Address
        </label>
        <input
          id="login-email"
          type="email"
          className={`form-input ${errors.email ? 'error' : ''}`}
          placeholder="name@example.com"
          aria-invalid={errors.email ? 'true' : 'false'}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && (
          <span role="alert" className="field-error" style={{ display: 'block', marginTop: '0.25rem', color: 'var(--color-danger)', fontSize: '0.75rem' }}>
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label htmlFor="login-password" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Password
          </label>
        </div>
        <input
          id="login-password"
          type="password"
          className={`form-input ${errors.password ? 'error' : ''}`}
          placeholder="••••••••"
          aria-invalid={errors.password ? 'true' : 'false'}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />
        {errors.password && (
          <span role="alert" className="field-error" style={{ display: 'block', marginTop: '0.25rem', color: 'var(--color-danger)', fontSize: '0.75rem' }}>
            {errors.password.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn-primary"
        style={{ width: '100%', padding: '0.75rem', fontWeight: 600 }}
        disabled={loading}
      >
        {loading ? <span className="spinner" style={{ width: '1rem', height: '1rem' }} /> : 'Sign In'}
      </button>
    </form>
  );
}

export default LoginForm;
