import React from 'react';

/** Lightweight route loading state — avoids heavy full-page skeleton on navigation */
function RouteFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40vh',
        width: '100%',
      }}
      aria-label="Loading page"
      role="status"
    >
      <div
        className="spinner"
        style={{ width: '2rem', height: '2rem', borderWidth: '3px' }}
      />
    </div>
  );
}

export default RouteFallback;
