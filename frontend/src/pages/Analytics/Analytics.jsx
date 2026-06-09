import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';

function Analytics() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Market Analytics</h1>
        <p className="page-subtitle">Deep dive statistical trends, correlations, and predictive crypto modeling.</p>
      </div>
      <div className="shell-card">
        <span className="shell-card-icon" aria-hidden="true">
          <FiBarChart2 />
        </span>
        <h3>Analytics Module</h3>
        <p style={{ marginTop: '0.5rem' }}>
          Interactive technical indicator charts, sentiment analysis, and correlation matrices are coming soon.
        </p>
      </div>
    </div>
  );
}

export default Analytics;

