import React from 'react';

/* ── Individual skeleton primitives ── */
function SkBar({ w = '100%', h = 12, style = {} }) {
  return (
    <div
      className="skeleton-shimmer skeleton-cell"
      style={{ width: w, height: h, ...style }}
    />
  );
}

function SkCircle({ size = 32 }) {
  return (
    <div
      className="skeleton-shimmer skeleton-circle"
      style={{ width: size, height: size }}
    />
  );
}

/* ── Market Summary skeleton ── */
export function MarketSummarySkeleton() {
  return (
    <div className="skeleton-market-grid">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton-market-card">
          <SkBar w="50%" h={10} />
          <SkBar w="70%" h={24} />
          <SkBar w="40%" h={10} />
        </div>
      ))}
    </div>
  );
}

/* ── Table skeleton ── */
export function TableSkeleton({ rows = 10 }) {
  return (
    <div className="skeleton-table-wrap">
      {/* Header */}
      <div className="skeleton-table-header">
        {[40, 160, 100, 100, 120, 120, 100, 100, 70].map((w, i) => (
          <SkBar key={i} w={w} h={11} />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row">
          <SkBar w={28} h={12} style={{ flexShrink: 0 }} />
          <SkCircle size={32} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1.5 }}>
            <SkBar w="60%" h={12} />
            <SkBar w="35%" h={10} />
          </div>
          {[100, 90, 110, 110, 95, 95, 65].map((w, j) => (
            <SkBar key={j} w={w} h={13} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Grid skeleton ── */
export function GridSkeleton({ cards = 12 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <SkCircle size={40} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <SkBar w="60%" h={13} />
              <SkBar w="40%" h={10} />
            </div>
            <SkBar w={32} h={20} style={{ borderRadius: 6 }} />
          </div>
          <SkBar w="75%" h={28} />
          <SkBar w="50%" h={22} style={{ borderRadius: 8 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1, 2, 3, 4].map((k) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <SkBar w="40%" h={10} />
                <SkBar w="35%" h={10} />
              </div>
            ))}
          </div>
          <SkBar w="100%" h={36} style={{ borderRadius: 9 }} />
        </div>
      ))}
    </div>
  );
}

/* ── Default export: combined skeleton ── */
function LoadingSkeleton({ viewMode = 'table', rows = 10, cards = 12 }) {
  return viewMode === 'grid'
    ? <GridSkeleton cards={cards} />
    : <TableSkeleton rows={rows} />;
}

export default LoadingSkeleton;
