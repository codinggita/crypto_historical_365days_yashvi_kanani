import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

// Sort options MUST match backend allowedSortFields:
// ["price","marketCap","volume","rank","dailyReturn","volatility","createdAt"]
const SORT_OPTIONS = [
  { value: 'rank',        label: 'Rank' },
  { value: 'price',       label: 'Price' },
  { value: 'dailyReturn', label: '24h Change' },
  { value: 'marketCap',   label: 'Market Cap' },
  { value: 'volume',      label: 'Volume' },
  { value: 'volatility',  label: 'Volatility' },
];

const MONTH_OPTIONS = [
  { value: '',   label: 'All Time' },
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

function CoinFilters({ filters, onFilterChange, onReset }) {
  const handleChange = (key, value) => onFilterChange({ [key]: value });

  const hasActiveFilters =
    filters.search        ||
    filters.sortBy !== 'rank' ||
    filters.sortOrder !== 'asc' ||
    filters.minPrice      ||
    filters.maxPrice      ||
    filters.minVolume     ||
    filters.maxVolume     ||
    filters.minMarketCap  ||
    filters.maxMarketCap  ||
    filters.symbol        ||
    filters.month;

  return (
    <div className="coins-filter-bar">

      {/* Search */}
      <div className="filter-search-wrap">
        <FiSearch className="filter-search-icon" />
        <input
          id="coin-search"
          type="text"
          className="filter-search-input"
          placeholder="Search coin name or symbol…"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
        />
        {filters.search && (
          <button
            className="view-toggle-btn"
            style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}
            onClick={() => handleChange('search', '')}
            title="Clear search"
          >
            <FiX />
          </button>
        )}
      </div>

      {/* Symbol filter */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="coin-symbol-filter">Symbol</label>
        <input
          id="coin-symbol-filter"
          type="text"
          className="filter-input"
          placeholder="BTC, ETH…"
          value={filters.symbol}
          onChange={(e) => handleChange('symbol', e.target.value.toUpperCase())}
          style={{ width: 90 }}
        />
      </div>

      {/* Sort By — values MATCH backend field names */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="coin-sort-by">Sort By</label>
        <select
          id="coin-sort-by"
          className="filter-select"
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Sort Order */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="coin-sort-order">Order</label>
        <select
          id="coin-sort-order"
          className="filter-select"
          value={filters.sortOrder}
          onChange={(e) => handleChange('sortOrder', e.target.value)}
          style={{ width: 110 }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Month */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="coin-month-filter">Month</label>
        <select
          id="coin-month-filter"
          className="filter-select"
          value={filters.month}
          onChange={(e) => handleChange('month', e.target.value)}
        >
          {MONTH_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <label className="filter-label">Price Range ($)</label>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <input
            id="coin-min-price"
            type="number"
            className="filter-input"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            style={{ width: 72 }}
            min="0"
          />
          <input
            id="coin-max-price"
            type="number"
            className="filter-input"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            style={{ width: 72 }}
            min="0"
          />
        </div>
      </div>

      {/* Rows per page — triggers setLimit in Coins.jsx which resets page to 1 */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="coin-per-page">Per Page</label>
        <select
          id="coin-per-page"
          className="filter-select"
          value={filters.limit}
          onChange={(e) => handleChange('limit', Number(e.target.value))}
          style={{ width: 80 }}
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Reset */}
      <div className="filter-actions">
        {hasActiveFilters && (
          <button className="btn-reset-filter" onClick={onReset} id="coin-filter-reset">
            <FiX style={{ marginRight: '0.3rem' }} /> Reset
          </button>
        )}
      </div>
    </div>
  );
}

export default CoinFilters;
