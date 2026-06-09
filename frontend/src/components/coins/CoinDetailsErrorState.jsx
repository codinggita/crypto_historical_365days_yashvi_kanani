import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

function CoinDetailsErrorState({ message, onRetry }) {
  const navigate = useNavigate();

  return (
    <div className="coins-error-state" style={{ padding: '4rem 2rem', maxWidth: '600px', margin: '3rem auto' }}>
      <div className="error-icon" style={{ fontSize: '3.5rem', color: '#f87171', marginBottom: '1rem' }}>
        <FiAlertTriangle />
      </div>
      <h2 className="error-title" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        Failed to Load Coin Intelligence
      </h2>
      <p className="error-message" style={{ fontSize: '0.92rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
        {message || 'We encountered a database connection issue or the coin does not exist in our system.'}
      </p>
      
      <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          id="err-back-btn"
          className="btn-watchlist-toggle"
          onClick={() => navigate('/coins')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <FiArrowLeft /> Back to Coins
        </button>

        {onRetry && (
          <button
            id="err-retry-btn"
            className="btn-retry"
            onClick={onRetry}
            style={{ marginTop: 0, padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <FiRefreshCw /> Retry Loading
          </button>
        )}
      </div>
    </div>
  );
}

export default CoinDetailsErrorState;
