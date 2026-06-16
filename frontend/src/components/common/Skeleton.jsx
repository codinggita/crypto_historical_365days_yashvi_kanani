import React from 'react';

/* Primitive Skeleton Components */
export function SkBar({ w = '100%', h = 12, style = {} }) {
  return (
    <div
      className="skeleton-pulse skeleton-bar-element"
      style={{ width: w, height: h, borderRadius: '4px', ...style }}
      aria-hidden="true"
    />
  );
}

export function SkCircle({ size = 32, style = {} }) {
  return (
    <div
      className="skeleton-pulse skeleton-circle-element"
      style={{ width: size, height: size, borderRadius: '50%', ...style }}
      aria-hidden="true"
    />
  );
}

/* Card Skeleton */
export function CardSkeleton({ style = {} }) {
  return (
    <div className="skeleton-card-container" style={style}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <SkCircle size={40} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <SkBar w="50%" h={14} />
          <SkBar w="30%" h={10} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <SkBar w="85%" h={16} />
        <SkBar w="70%" h={12} />
        <SkBar w="40%" h={12} />
      </div>
    </div>
  );
}

/* Table Skeleton */
export function TableSkeleton({ rows = 5, cols = 5, style = {} }) {
  return (
    <div className="skeleton-table-container" style={style}>
      {/* Header */}
      <div className="skeleton-table-row header-row" style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        {Array.from({ length: cols }).map((_, i) => (
          <SkBar key={i} w={`${100 / cols - 5}%`} h={14} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="skeleton-table-row"
          style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
        >
          {Array.from({ length: cols }).map((_, c) => {
            if (c === 0) {
              return (
                <div key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: `${100 / cols - 5}%` }}>
                  <SkCircle size={28} />
                  <SkBar w="60%" h={12} />
                </div>
              );
            }
            return <SkBar key={c} w={`${100 / cols - 5}%`} h={12} />;
          })}
        </div>
      ))}
    </div>
  );
}

/* Chart Skeleton */
export function ChartSkeleton({ height = '250px', style = {} }) {
  return (
    <div className="skeleton-chart-container" style={{ height, ...style }}>
      <div className="skeleton-chart-title" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <SkBar w="150px" h={18} />
        <SkBar w="80px" h={18} />
      </div>
      <div className="skeleton-chart-bars" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 'calc(100% - 40px)', padding: '0 10px' }}>
        {[60, 40, 80, 50, 95, 30, 70, 45, 85, 60, 30, 90].map((h, i) => (
          <div
            key={i}
            className="skeleton-pulse skeleton-chart-bar-element"
            style={{
              width: '5%',
              height: `${h}%`,
              borderRadius: '4px 4px 0 0',
              opacity: 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* Dashboard Skeleton */
export function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner Skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <SkBar w="250px" h={28} />
        <SkBar w="400px" h={16} />
      </div>
      {/* Stats Cards */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-card-container" style={{ minHeight: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <SkBar w="50%" h={12} />
              <SkCircle size={24} />
            </div>
            <SkBar w="70%" h={24} style={{ marginBottom: '0.5rem' }} />
            <SkBar w="30%" h={12} />
          </div>
        ))}
      </div>
      {/* Dual Column Content */}
      <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <ChartSkeleton height="300px" />
          <TableSkeleton rows={4} cols={5} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}

/* Page Skeleton (Full-page container fallback for lazy loading Suspense) */
export function PageSkeleton() {
  return (
    <div className="page-skeleton-container" style={{ display: 'flex', minHeight: '100vh', background: '#0b0f19', color: '#f3f4f6' }}>
      {/* Sidebar Skeleton */}
      <div className="sidebar-skeleton" style={{ width: '260px', borderRight: '1px solid rgba(255, 255, 255, 0.08)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <SkCircle size={36} />
          <SkBar w="120px" h={20} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <SkCircle size={20} />
              <SkBar w={i % 2 === 0 ? '70%' : '50%'} h={12} />
            </div>
          ))}
        </div>
      </div>
      {/* Main Content Area Skeleton */}
      <div className="main-content-skeleton" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Top Navbar Skeleton */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem' }}>
          <SkBar w="200px" h={20} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <SkCircle size={32} />
            <SkBar w="80px" h={14} />
          </div>
        </div>
        {/* Children Skeleton (Dashboard as default mockup) */}
        <DashboardSkeleton />
      </div>
    </div>
  );
}

export default PageSkeleton;
