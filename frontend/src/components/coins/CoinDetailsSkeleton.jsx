import React from 'react';

function SkCell({ w = '100%', h = 12, r = 6, style = {} }) {
  return (
    <div
      className="skeleton-shimmer"
      style={{
        width: w,
        height: h,
        borderRadius: r,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        ...style,
      }}
    />
  );
}

function CoinDetailsSkeleton() {
  return (
    <div className="coin-details-page" style={{ opacity: 0.7 }}>
      {/* Back button skeleton */}
      <SkCell w="120px" h="18px" />

      {/* Header skeleton */}
      <div className="coin-header-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="skeleton-shimmer" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <SkCell w="140px" h="28px" />
              <SkCell w="60px" h="20px" />
              <SkCell w="80px" h="20px" />
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline' }}>
              <SkCell w="160px" h="36px" />
              <SkCell w="70px" h="24px" />
            </div>
          </div>
        </div>
        <SkCell w="150px" h="38px" r="10px" />
      </div>

      {/* Chart Skeleton */}
      <div className="chart-card-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="chart-header-row">
          <SkCell w="220px" h="36px" r="10px" />
          <SkCell w="120px" h="32px" r="8px" />
        </div>
        <div className="skeleton-shimmer" style={{ height: '380px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)' }} />
      </div>

      {/* Performance Grid Skeleton */}
      <div>
        <SkCell w="250px" h="24px" style={{ marginBottom: '1.1rem' }} />
        <div className="performance-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="perf-card">
              <SkCell w="50%" h="10px" style={{ marginBottom: '8px' }} />
              <SkCell w="75%" h="22px" style={{ marginBottom: '6px' }} />
              <SkCell w="90%" h="10px" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats & Supply Skeleton */}
      <div className="details-stats-layout">
        <div className="stats-card-box">
          <SkCell w="60%" h="20px" style={{ marginBottom: '1rem' }} />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="stats-row">
              <SkCell w="40%" h="12px" />
              <SkCell w="30%" h="12px" />
            </div>
          ))}
        </div>
        <div className="stats-card-box">
          <SkCell w="60%" h="20px" style={{ marginBottom: '1rem' }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="stats-row">
              <SkCell w="40%" h="12px" />
              <SkCell w="30%" h="12px" />
            </div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="table-section-card">
        <SkCell w="200px" h="22px" style={{ marginBottom: '0.5rem' }} />
        <div className="skeleton-shimmer" style={{ height: '320px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)' }} />
      </div>
    </div>
  );
}

export default CoinDetailsSkeleton;
