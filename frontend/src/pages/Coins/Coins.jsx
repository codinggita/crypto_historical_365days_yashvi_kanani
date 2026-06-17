import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiRefreshCw, FiList, FiGrid, FiTrendingUp } from 'react-icons/fi';

// Redux
import {
  setCoins,
  setLoading,
  setError,
  setFilters,
  resetFilters,
  setViewMode,
  setPage,
  setLimit,
  setMarketSummary,
  setMarketSummaryLoading,
  setMarketSummaryError,
} from '../../redux/slices/coinSlice';

// Services
import coinService from '../../services/coin.service';

// Components
import MarketSummaryCards from '../../components/coins/MarketSummaryCards';
import CoinFilters from '../../components/coins/CoinFilters';
import CoinTable from '../../components/coins/CoinTable';
import CoinCard from '../../components/coins/CoinCard';
import LoadingSkeleton, { MarketSummarySkeleton } from '../../components/coins/LoadingSkeleton';
import Pagination from '../../components/coins/Pagination';
import ErrorState from '../../components/coins/ErrorState';
import EmptyState from '../../components/coins/EmptyState';

// Styles
import '../../styles/coins.css';

/* ── Debounce hook ── */
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function Coins() {
  const dispatch = useDispatch();

  const {
    coins,
    loading,
    error,
    pagination,
    filters,
    viewMode,
    marketSummary,
    marketSummaryLoading,
  } = useSelector((state) => state.coins);

  const debouncedSearch   = useDebounce(filters.search,   450);
  const debouncedSymbol   = useDebounce(filters.symbol,   450);
  const debouncedMinPrice = useDebounce(filters.minPrice, 500);
  const debouncedMaxPrice = useDebounce(filters.maxPrice, 500);

  /* ── Fetch market summary ── */
  const fetchMarketSummary = useCallback(async () => {
    dispatch(setMarketSummaryLoading(true));
    try {
      const data = await coinService.getMarketSummary();
      dispatch(setMarketSummary(data?.data || data));
    } catch (err) {
      dispatch(setMarketSummaryError(err?.response?.data?.message || err.message));
    }
  }, [dispatch]);

  /* ── Fetch coins list ── */
  const fetchCoins = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const params = {
        page:      pagination.page,
        limit:     pagination.limit,
        sortBy:    filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(debouncedSearch   && { search:      debouncedSearch }),
        ...(debouncedSymbol   && { symbol:      debouncedSymbol }),
        ...(debouncedMinPrice && { minPrice:    debouncedMinPrice }),
        ...(debouncedMaxPrice && { maxPrice:    debouncedMaxPrice }),
        ...(filters.minVolume    && { minVolume:    filters.minVolume }),
        ...(filters.maxVolume    && { maxVolume:    filters.maxVolume }),
        ...(filters.minMarketCap && { minMarketCap: filters.minMarketCap }),
        ...(filters.maxMarketCap && { maxMarketCap: filters.maxMarketCap }),
        ...(filters.month        && { month:        filters.month }),
      };

      const response = await coinService.getCoins(params);
      // Server returns: { success, data: { coins, pagination }, meta }
      const raw = response?.data || response;

      if (Array.isArray(raw)) {
        // Fallback: bare array — no server-side pagination
        dispatch(setCoins({
          data: raw,
          pagination: {
            page:        1,
            limit:       pagination.limit,
            total:       raw.length,
            totalPages:  1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        }));
        return;
      }

      // New API shape: data.coins + data.pagination
      const coinArray     = raw?.coins ?? raw?.data?.coins ?? [];
      const paginationObj = raw?.pagination ?? raw?.data?.pagination;

      const pageMeta = paginationObj
        ? {
            page:        paginationObj.page        ?? pagination.page,
            limit:       paginationObj.limit        ?? pagination.limit,
            total:       paginationObj.totalItems   ?? paginationObj.total ?? coinArray.length,
            totalPages:  paginationObj.totalPages   ?? 1,
            hasNextPage: paginationObj.hasNextPage  ?? false,
            hasPrevPage: paginationObj.hasPrevPage  ?? false,
          }
        : {
            // Legacy shape: flat fields at root
            page:        raw?.page        ?? pagination.page,
            limit:       raw?.limit       ?? pagination.limit,
            total:       raw?.total       ?? raw?.totalCoins ?? coinArray.length,
            totalPages:  raw?.totalPages  ?? Math.ceil((raw?.total ?? coinArray.length) / pagination.limit),
            hasNextPage: false,
            hasPrevPage: false,
          };

      dispatch(setCoins({ data: coinArray, pagination: pageMeta }));
    } catch (err) {
      dispatch(setError(err?.response?.data?.message || err.message || 'Failed to load coins'));
    }
  }, [
    dispatch,
    pagination.page,
    pagination.limit,
    filters.sortBy,
    filters.sortOrder,
    debouncedSearch,
    debouncedSymbol,
    debouncedMinPrice,
    debouncedMaxPrice,
    filters.minVolume,
    filters.maxVolume,
    filters.minMarketCap,
    filters.maxMarketCap,
    filters.month,
  ]);

  /* ── Mount effects ── */
  useEffect(() => { fetchMarketSummary(); }, [fetchMarketSummary]);
  useEffect(() => { fetchCoins();         }, [fetchCoins]);

  /* ── Handlers ── */
  const handleFilterChange = (updates) => {
    if ('limit' in updates) {
      // Limit changes must reset page to 1 via setLimit (not setFilters)
      dispatch(setLimit(Number(updates.limit)));
    } else {
      dispatch(setFilters(updates));
    }
  };

  const handleResetFilters = () => dispatch(resetFilters());
  const handlePageChange   = (p) => dispatch(setPage(p));
  const handleViewMode     = (mode) => dispatch(setViewMode(mode));
  const handleSort         = (key, order) => dispatch(setFilters({ sortBy: key, sortOrder: order }));
  const handleRefresh      = () => { fetchMarketSummary(); fetchCoins(); };

  /* ── Derived state ── */
  const hasActiveFilters =
    filters.search || filters.symbol ||
    filters.minPrice || filters.maxPrice ||
    filters.minVolume || filters.maxVolume ||
    filters.month ||
    filters.sortBy !== 'rank' || filters.sortOrder !== 'asc';

  const totalPages  = pagination.totalPages || 1;
  const totalCoins  = pagination.total      || coins.length;
  const startRecord = totalCoins === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endRecord   = Math.min(pagination.page * pagination.limit, totalCoins);

  return (
    <div className="coins-page">
      {/* ── Page Header ── */}
      <div className="coins-header">
        <div className="coins-header-row">
          <div>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiTrendingUp style={{ color: '#818cf8' }} />
              Cryptocurrencies
            </h1>
            <p className="page-subtitle">
              Live market data, prices, market caps, volume, and 24h performance.
            </p>
          </div>
          <button
            id="coin-refresh-btn"
            className="btn-reset-filter"
            onClick={handleRefresh}
            style={{
              background:  'rgba(99,102,241,0.08)',
              borderColor: 'rgba(99,102,241,0.2)',
              color:       '#a5b4fc',
              display:     'flex',
              alignItems:  'center',
              gap:         '0.4rem',
            }}
          >
            <FiRefreshCw style={{ fontSize: '0.85rem' }} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Market Summary ── */}
      {marketSummaryLoading
        ? <MarketSummarySkeleton />
        : <MarketSummaryCards summary={marketSummary} />
      }

      {/* ── Filters ── */}
      <CoinFilters
        filters={{ ...filters, limit: pagination.limit }}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* ── Content Header ── */}
      <div className="coins-content-header">
        <div className="coins-count-label">
          {loading ? (
            'Loading…'
          ) : totalCoins > 0 ? (
            <>
              Showing <strong>{startRecord}–{endRecord}</strong> of{' '}
              <strong>{totalCoins.toLocaleString()}</strong> records
              {hasActiveFilters && ' (filtered)'}
            </>
          ) : (
            'No records found'
          )}
        </div>
        <div className="view-toggle">
          <button
            id="view-toggle-table"
            className={`view-toggle-btn${viewMode === 'table' ? ' active' : ''}`}
            onClick={() => handleViewMode('table')}
            title="Table view"
          >
            <FiList />
          </button>
          <button
            id="view-toggle-grid"
            className={`view-toggle-btn${viewMode === 'grid' ? ' active' : ''}`}
            onClick={() => handleViewMode('grid')}
            title="Grid view"
          >
            <FiGrid />
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      {loading ? (
        <LoadingSkeleton viewMode={viewMode} rows={pagination.limit} cards={pagination.limit} />
      ) : error ? (
        <ErrorState message={error} onRetry={handleRefresh} />
      ) : coins.length === 0 ? (
        <EmptyState hasFilters={!!hasActiveFilters} onReset={handleResetFilters} />
      ) : viewMode === 'grid' ? (
        <div className="coin-grid">
          {coins.map((coin, i) => (
            <CoinCard key={coin._id || coin.id || i} coin={coin} index={i} />
          ))}
        </div>
      ) : (
        <CoinTable
          coins={coins}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSort={handleSort}
        />
      )}

      {/* ── Pagination ── */}
      {!loading && !error && totalCoins > 0 && (
        <Pagination
          page={pagination.page}
          totalPages={totalPages}
          totalItems={totalCoins}
          limit={pagination.limit}
          onPageChange={handlePageChange}
          onLimitChange={(val) => handleFilterChange({ limit: val })}
        />
      )}
    </div>
  );
}

export default Coins;
