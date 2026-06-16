import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiList, FiGrid, FiX } from 'react-icons/fi';
import { setFilters, resetFilters, setViewMode } from '../../redux/slices/watchlistSlice';

const CATEGORIES = ['Long Term', 'Short Term', 'Research', 'High Risk', 'Favorites'];
const SORT_FIELDS = [
  { value: 'createdAt', label: 'Date Added' },
  { value: 'coinName', label: 'Coin Name' },
  { value: 'addedPrice', label: 'Added Price' },
  { value: 'currentPrice', label: 'Current Price' },
  { value: 'category', label: 'Category' },
];

function WatchlistFilters() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.watchlist.filters);
  const viewMode = useSelector((state) => state.watchlist.viewMode);

  // Local state for debounced search
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debouncing search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchTerm }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  // Sync search input if filters are reset from outside
  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  const handleCategoryChange = (e) => {
    dispatch(setFilters({ category: e.target.value }));
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split(':');
    dispatch(setFilters({ sortBy, sortOrder }));
  };

  const handleClearFilters = () => {
    dispatch(resetFilters());
    setSearchTerm('');
  };

  const hasActiveFilters =
    filters.category || filters.search || filters.sortBy !== 'createdAt' || filters.sortOrder !== 'desc';

  return (
    <div className="watchlist-filters-card">
      <div className="watchlist-filters-left">
        {/* Search */}
        <div className="watchlist-search-wrapper">
          <FiSearch className="watchlist-search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, symbol, or notes..."
            className="watchlist-search-input"
            aria-label="Search Watchlist"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="watchlist-search-clear"
              aria-label="Clear search"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={handleCategoryChange}
          className="watchlist-select-input"
          aria-label="Filter by Category"
        >
          <option value="">All Categories</option>
          <option value="watchlist">Watchlist (Default)</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Sorting Dropdown */}
        <select
          value={`${filters.sortBy}:${filters.sortOrder}`}
          onChange={handleSortChange}
          className="watchlist-select-input"
          aria-label="Sort bookmarks"
        >
          {SORT_FIELDS.map((sort) => (
            <React.Fragment key={sort.value}>
              <option value={`${sort.value}:desc`}>{sort.label} (High to Low / Newest)</option>
              <option value={`${sort.value}:asc`}>{sort.label} (Low to High / Oldest)</option>
            </React.Fragment>
          ))}
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button onClick={handleClearFilters} className="watchlist-clear-filters-btn">
            Clear Filters
          </button>
        )}
      </div>

      {/* View Mode Toggle (Grid/List) */}
      <div className="watchlist-view-toggle">
        <button
          onClick={() => dispatch(setViewMode('table'))}
          className={`watchlist-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
          aria-label="Table View"
          title="Table View"
        >
          <FiList size={16} />
        </button>
        <button
          onClick={() => dispatch(setViewMode('grid'))}
          className={`watchlist-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
          aria-label="Grid View"
          title="Grid View"
        >
          <FiGrid size={16} />
        </button>
      </div>
    </div>
  );
}

export default WatchlistFilters;
