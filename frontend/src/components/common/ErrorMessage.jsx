import React from 'react';
import { FiAlertTriangle, FiWifiOff, FiRefreshCw, FiHome } from 'react-icons/fi';

/* API Error Component (renders inside panels/cards) */
export function ApiError({
  message = 'Failed to load data from the server.',
  onRetry,
  style = {},
}) {
  return (
    <div
      className="api-error-panel"
      role="alert"
      aria-live="assertive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'rgba(239, 68, 68, 0.03)',
        border: '1px dashed rgba(239, 68, 68, 0.2)',
        borderRadius: '12px',
        textAlign: 'center',
        gap: '1rem',
        ...style,
      }}
    >
      <FiAlertTriangle style={{ fontSize: '2rem', color: '#ef4444' }} aria-hidden="true" />
      <div>
        <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 600, color: '#f3f4f6' }}>API Request Failed</h4>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#9ca3af' }}>{message}</p>
      </div>
      {onRetry && (
        <button
          className="btn-secondary"
          onClick={onRetry}
          aria-label="Retry fetching data"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            fontSize: '0.8rem',
            borderColor: 'rgba(239, 68, 68, 0.2)',
            color: '#fca5a5',
          }}
        >
          <FiRefreshCw />
          Retry Request
        </button>
      )}
    </div>
  );
}

/* Network Error Component (offline or DNS fail states) */
export function NetworkError({
  message = 'No internet connection detected. Please check your network.',
  onRetry,
  style = {},
}) {
  return (
    <div
      className="network-error-panel"
      role="alert"
      aria-live="assertive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        background: 'rgba(245, 158, 11, 0.03)',
        border: '1px dashed rgba(245, 158, 11, 0.2)',
        borderRadius: '14px',
        textAlign: 'center',
        gap: '1.25rem',
        ...style,
      }}
    >
      <FiWifiOff style={{ fontSize: '2.5rem', color: '#f59e0b' }} aria-hidden="true" />
      <div>
        <h4 style={{ margin: '0 0 0.35rem 0', fontWeight: 700, fontSize: '1.1rem', color: '#f3f4f6' }}>Network Error</h4>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#9ca3af', maxWidth: '340px' }}>{message}</p>
      </div>
      {onRetry && (
        <button
          className="btn-primary"
          onClick={onRetry}
          aria-label="Retry connection"
          style={{
            background: 'var(--color-accent, #f59e0b)',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
            color: '#0b0f19',
          }}
        >
          <FiRefreshCw />
          Retry Connection
        </button>
      )}
    </div>
  );
}

/* Page Error Component (Full Screen Page Wrapper Error) */
export function PageError({
  message = 'An unexpected error occurred while loading this page.',
  onRetry,
  onGoHome,
}) {
  return (
    <div
      className="page-error-container"
      role="alert"
      aria-live="assertive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '2rem',
        textAlign: 'center',
        gap: '1.5rem',
      }}
    >
      <FiAlertTriangle style={{ fontSize: '4rem', color: '#ef4444' }} aria-hidden="true" />
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#f3f4f6' }}>Something Went Wrong</h2>
        <p style={{ color: '#9ca3af', maxWidth: '450px', margin: 0 }}>{message}</p>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        {onRetry && (
          <button className="btn-primary" onClick={onRetry} aria-label="Reload page state">
            <FiRefreshCw />
            Reload Page
          </button>
        )}
        {onGoHome && (
          <button
            className="btn-secondary"
            onClick={onGoHome}
            aria-label="Navigate to Home Page"
          >
            <FiHome />
            Back to Home
          </button>
        )}
      </div>
    </div>
  );
}

export default PageError;
