import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

function ErrorState({ message, onRetry }) {
  return (
    <div className="coins-error-state">
      <div className="error-icon">
        <FiAlertTriangle />
      </div>
      <div className="error-title">Failed to Load Coins</div>
      <p className="error-message">
        {message || 'Unable to fetch coin data. Please check your connection and try again.'}
      </p>
      {onRetry && (
        <button id="coin-error-retry" className="btn-retry" onClick={onRetry}>
          <FiRefreshCw style={{ marginRight: '0.4rem' }} />
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorState;
