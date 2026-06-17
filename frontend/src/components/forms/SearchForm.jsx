import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export function SearchForm({ value = '', onChange, onClear, placeholder = 'Search...' }) {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="navbar-search" style={{ display: 'block', width: '100%', maxWidth: '100%' }}>
      <div className="navbar-search-inner">
        <FiSearch className="navbar-search-icon" />
        <input
          type="text"
          className="navbar-search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search inputs"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted-layout)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Clear search text"
          >
            <FiX />
          </button>
        )}
      </div>
    </form>
  );
}

export default SearchForm;
