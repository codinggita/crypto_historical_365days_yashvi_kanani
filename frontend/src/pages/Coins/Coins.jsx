import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RefreshCw, List, Grid, TrendingUp } from 'lucide-react';

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
      const raw = response?.data || response;

      if (Array.isArray(raw)) {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="coins-page"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* ── Page Header ── */}
      <div className="coins-header">
        <div className="coins-header-row">
          <div>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <TrendingUp className="text-primary" size={26} />
              <span className="title-gradient">Cryptocurrencies</span>
            </h1>
            <p className="page-subtitle">
              Live market data, prices, market caps, volume, and 24h performance.
            </p>
          </div>
          <motion.button
            id="coin-refresh-btn"
            className="btn-secondary"
            onClick={handleRefresh}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* ── Market Summary ── */}
      {marketSummaryLoading ? (
        <MarketSummarySkeleton />
      ) : (
        <motion.div variants={itemVariants}>
          <MarketSummaryCards summary={marketSummary} />
        </motion.div>
      )}

      {/* ── Filters ── */}
      <motion.div variants={itemVariants}>
        <CoinFilters
          filters={{ ...filters, limit: pagination.limit }}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </motion.div>

      {/* ── Content Header ── */}
      <motion.div className="coins-content-header" variants={itemVariants}>
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
            <List size={18} />
          </button>
          <button
            id="view-toggle-grid"
            className={`view-toggle-btn${viewMode === 'grid' ? ' active' : ''}`}
            onClick={() => handleViewMode('grid')}
            title="Grid view"
          >
            <Grid size={18} />
          </button>
        </div>
      </motion.div>

      {/* ── Main Content ── */}
      <motion.div variants={itemVariants} style={{ minHeight: '300px' }}>
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
      </motion.div>

      {/* ── Pagination ── */}
      {!loading && !error && totalCoins > 0 && (
        <motion.div variants={itemVariants}>
          <Pagination
            page={pagination.page}
            totalPages={totalPages}
            totalItems={totalCoins}
            limit={pagination.limit}
            onPageChange={handlePageChange}
            onLimitChange={(val) => handleFilterChange({ limit: val })}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

export default Coins;
