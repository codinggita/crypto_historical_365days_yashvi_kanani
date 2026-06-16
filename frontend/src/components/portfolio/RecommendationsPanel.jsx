import React from 'react';
import '../../styles/portfolio.css';

export function RecommendationsPanel({ recommendations }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const getRiskBadgeClass = (volatility) => {
    if (volatility >= 3.0) return 'rec-badge badge-high';
    if (volatility >= 1.5) return 'rec-badge badge-medium';
    return 'rec-badge badge-low';
  };

  const getRiskLabel = (volatility) => {
    if (volatility >= 3.0) return 'High';
    if (volatility >= 1.5) return 'Medium';
    return 'Low';
  };

  return (
    <div className="glass-panel" style={{ width: '100%' }}>
      <div className="panel-header">
        <h2>Recommended Assets</h2>
      </div>

      {recommendations.length === 0 ? (
        <div className="empty-state" style={{ border: 'none', padding: '2rem 0' }}>
          <p>No suggested recommendations available at this time.</p>
        </div>
      ) : (
        <div className="recommendations-list">
          {recommendations.map((coin) => (
            <div key={coin._id} className="recommendation-card">
              <div className="coin-cell">
                <div className="coin-icon-placeholder">
                  {coin.symbol?.slice(0, 3)}
                </div>
                <div className="coin-info">
                  <span className="coin-name-display">{coin.name}</span>
                  <span className="coin-symbol-display" style={{ fontSize: '0.7rem' }}>
                    Price: {formatCurrency(coin.price)}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981' }}>
                  +{coin.dailyReturn.toFixed(2)}% Growth
                </div>
                <div style={{ marginTop: '0.25rem' }}>
                  <span className={getRiskBadgeClass(coin.volatility)}>
                    {getRiskLabel(coin.volatility)} Risk
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecommendationsPanel;
