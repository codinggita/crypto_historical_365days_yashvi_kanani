import React from 'react';
import { FiSearch } from 'react-icons/fi';

function EmptyState({ hasFilters, onReset }) {
  return (
    <div className="coins-empty-state">
      <div className="empty-icon">
        <FiSearch />
      </div>
      <div className="empty-title">
        {hasFilters ? 'No Coins Match Your Filters' : 'No Coins Available'}
      </div>
      <p className="empty-message">
        {hasFilters
          ? 'Try adjusting your search or filter criteria to find the coins you are looking for.'
          : 'There are no cryptocurrency records available at this time. Please check back later.'}
      </p>
      {hasFilters && onReset && (
        <button id="coin-empty-reset" className="btn-retry" onClick={onReset}>
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default EmptyState;
