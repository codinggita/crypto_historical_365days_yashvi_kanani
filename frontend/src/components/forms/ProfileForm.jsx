import React from 'react';
import { useForm } from 'react-hook-form';

export function ProfileForm({ defaultValues, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="simulator-form" noValidate>
      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="profile-name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
          Full Name
        </label>
        <input
          id="profile-name"
          type="text"
          className={`form-input ${errors.name ? 'error' : ''}`}
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && (
          <span className="field-error" style={{ color: 'var(--color-danger)', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="profile-email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
          Email Address
        </label>
        <input
          id="profile-email"
          type="email"
          className="form-input"
          disabled
          value={defaultValues?.email || ''}
          style={{ opacity: 0.6, cursor: 'not-allowed' }}
        />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted-layout)', display: 'block', marginTop: '0.25rem' }}>
          Email address cannot be changed.
        </span>
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={loading || !isDirty}
        style={{ padding: '0.65rem 1.25rem', fontWeight: 600 }}
      >
        {loading ? <span className="spinner" style={{ width: '1rem', height: '1rem' }} /> : 'Save Profile'}
      </button>
    </form>
  );
}

export default ProfileForm;
