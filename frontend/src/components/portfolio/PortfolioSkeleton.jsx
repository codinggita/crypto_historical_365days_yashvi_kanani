import React from 'react';
import '../../styles/portfolio.css';

export function PortfolioSkeleton() {
  return (
    <div className="portfolio-container">
      {/* Header Skeleton */}
      <div className="portfolio-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="skeleton-pulse" style={{ width: '180px', height: '24px' }}></div>
          <div className="skeleton-pulse" style={{ width: '280px', height: '14px' }}></div>
        </div>
        <div className="skeleton-pulse" style={{ width: '120px', height: '36px', borderRadius: '8px' }}></div>
      </div>

      {/* Overview Cards Skeleton */}
      <div className="portfolio-overview-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-pulse sk-card"></div>
        ))}
      </div>

      {/* Content Layout Skeleton */}
      <div className="portfolio-content-row">
        {/* Left Side: Table & Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="skeleton-pulse sk-chart"></div>
          <div className="skeleton-pulse sk-table"></div>
        </div>

        {/* Right Side: Allocation & Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="skeleton-pulse sk-chart"></div>
          <div className="skeleton-pulse sk-table"></div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioSkeleton;
