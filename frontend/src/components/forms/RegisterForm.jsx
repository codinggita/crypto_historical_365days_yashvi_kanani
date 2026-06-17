import React from 'react';
import { useForm } from 'react-hook-form';

export function RegisterForm({ onSubmit, loading, externalError }) {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
      {externalError && (
        <div className="error-message" style={{ marginBottom: '1rem', color: 'var(--color-danger)', fontSize: '0.875rem' }}>
          {externalError}
        </div>
      )}

      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="reg-name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Full Name
        </label>
        <input
          id="reg-name"
          type="text"
          className={`form-input ${errors.name ? 'error' : ''}`}
          placeholder="John Doe"
          aria-invalid={errors.name ? 'true' : 'false'}
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && (
          <span role="alert" className="field-error" style={{ display: 'block', marginTop: '0.25rem', color: 'var(--color-danger)', fontSize: '0.75rem' }}>
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="reg-email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Email Address
        </label>
        <input
          id="reg-email"
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

      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="reg-password" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Password
        </label>
        <input
          id="reg-password"
          type="password"
          className={`form-input ${errors.password ? 'error' : ''}`}
          placeholder="Minimum 6 characters"
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

      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="reg-confirmPassword" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Confirm Password
        </label>
        <input
          id="reg-confirmPassword"
          type="password"
          className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
          placeholder="Repeat password"
          aria-invalid={errors.confirmPassword ? 'true' : 'false'}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />
        {errors.confirmPassword && (
          <span role="alert" className="field-error" style={{ display: 'block', marginTop: '0.25rem', color: 'var(--color-danger)', fontSize: '0.75rem' }}>
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn-primary"
        style={{ width: '100%', padding: '0.75rem', fontWeight: 600 }}
        disabled={loading}
      >
        {loading ? <span className="spinner" style={{ width: '1rem', height: '1rem' }} /> : 'Create Account'}
      </button>
    </form>
  );
}

export default RegisterForm;
