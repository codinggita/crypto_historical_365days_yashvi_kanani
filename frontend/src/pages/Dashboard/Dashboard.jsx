import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FiTrendingUp, FiTrendingDown, FiDollarSign, FiActivity,
  FiBookmark, FiArrowUpRight, FiArrowDownRight, FiPieChart,
  FiRefreshCw, FiAlertCircle, FiMinus, FiDatabase,
} from 'react-icons/fi';
import { fetchMarketSummaryThunk, fetchTopGainersThunk, fetchTopLosersThunk } from '../../redux/thunks/coinThunks';
import { formatPrice, formatLargeNumber, formatPercent, getCoinInitials, getChangeClass } from '../../utils/format';

/* ── Skeleton card ── */
function StatSkeleton() {
  return (
    <div className="stat-card" aria-hidden="true">
      <div className="stat-card-header">
        <div className="skeleton-pulse" style={{ height: '0.75rem', width: '60%', borderRadius: '4px' }} />
        <div className="skeleton-pulse" style={{ width: '2.25rem', height: '2.25rem', borderRadius: '10px' }} />
      </div>
      <div className="skeleton-pulse" style={{ height: '1.65rem', width: '55%', borderRadius: '6px', margin: '0.75rem 0 0.4rem' }} />
      <div className="skeleton-pulse" style={{ height: '0.75rem', width: '40%', borderRadius: '4px' }} />
    </div>
  );
}

function CoinRowSkeleton() {
  return (
    <div className="placeholder-row" aria-hidden="true">
      <div className="placeholder-coin">
        <div className="skeleton-pulse" style={{ width: '2rem', height: '2rem', borderRadius: '50%' }} />
        <div>
          <div className="skeleton-pulse" style={{ width: '80px', height: '0.85rem', borderRadius: '4px', marginBottom: '0.3rem' }} />
          <div className="skeleton-pulse" style={{ width: '40px', height: '0.7rem', borderRadius: '4px' }} />
        </div>
      </div>
      <div className="skeleton-pulse" style={{ width: '55px', height: '1.2rem', borderRadius: '6px' }} />
    </div>
  );
}

/* ── Coin row ── */
function CoinListRow({ coin }) {
  const change = coin.dailyReturn ?? coin.daily_return ?? coin.change_24h ?? 0;
  const cls = getChangeClass(change);
  const initials = getCoinInitials(coin.name, coin.symbol);

  return (
    <div className="placeholder-row">
      <div className="placeholder-coin">
        <div className="placeholder-coin-dot">{typeof initials === 'string' ? initials.slice(0, 2) : '??'}</div>
        <div>
          <div className="placeholder-coin-name">{coin.name}</div>
          <div className="placeholder-coin-sym">{coin.symbol?.toUpperCase()}</div>
        </div>
      </div>
      <span className={`placeholder-badge ${cls}`} style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
        {change > 0 ? <FiArrowUpRight style={{ fontSize: '0.75rem' }} />
          : change < 0 ? <FiArrowDownRight style={{ fontSize: '0.75rem' }} />
          : <FiMinus style={{ fontSize: '0.75rem' }} />}
        {formatPercent(change)}
      </span>
    </div>
  );
}

function Dashboard() {
  const dispatch = useDispatch();
  const {
    marketSummary, marketSummaryLoading, marketSummaryError,
    topGainers, topLosers, loading,
  } = useSelector((s) => s.coins);
  const { user } = useSelector((s) => s.auth);
  const { bookmarkAnalytics } = useSelector((s) => s.watchlist);

  const displayName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Explorer';

  // Ensure arrays are properly initialized
  const safeTopGainers = Array.isArray(topGainers) ? topGainers : [];
  const safeTopLosers = Array.isArray(topLosers) ? topLosers : [];

  const loadData = useCallback(() => {
    dispatch(fetchMarketSummaryThunk());
    dispatch(fetchTopGainersThunk({ limit: 6 }));
    dispatch(fetchTopLosersThunk({ limit: 6 }));
  }, [dispatch]);

  useEffect(() => { loadData(); }, [loadData]);

  /* Build KPI stats from live market summary */
  const ms = marketSummary?.data || marketSummary;
  const gainersTop = safeTopGainers[0];
  const losersTop  = safeTopLosers[0];

  const stats = [
    {
      label: 'Total Market Cap',
      value: ms ? formatLargeNumber(ms.totalMarketCap || ms.marketCap) : '—',
      change: ms?.marketCapChange != null ? formatPercent(ms.marketCapChange) : null,
      isPositive: (ms?.marketCapChange ?? 0) >= 0,
      icon: <FiActivity />, iconClass: 'indigo',
    },
    {
      label: 'Top Gainer',
      value: gainersTop?.name ?? (loading ? '…' : '—'),
      change: gainersTop ? formatPercent(gainersTop.dailyReturn ?? gainersTop.daily_return ?? gainersTop.change_24h) : null,
      isPositive: true,
      icon: <FiTrendingUp />, iconClass: 'green',
    },
    {
      label: 'Top Loser',
      value: losersTop?.name ?? (loading ? '…' : '—'),
      change: losersTop ? formatPercent(losersTop.dailyReturn ?? losersTop.daily_return ?? losersTop.change_24h) : null,
      isPositive: false,
      icon: <FiTrendingDown />, iconClass: 'red',
    },
    {
      label: '24h Volume',
      value: ms ? formatLargeNumber(ms.totalVolume || ms.volume24h || ms.volume) : '—',
      change: null, isPositive: true,
      icon: <FiDollarSign />, iconClass: 'amber',
    },
    {
      label: 'Active Assets',
      value: ms ? (ms.totalCoins || ms.count || ms.activeCoins || '—').toLocaleString() : '—',
      change: null, isPositive: true,
      icon: <FiDatabase />, iconClass: 'blue',
    },
    {
      label: 'My Watchlist',
      value: bookmarkAnalytics ? `${bookmarkAnalytics.totalBookmarked ?? 0} Coins` : '—',
      change: null, isPositive: true,
      icon: <FiBookmark />, iconClass: 'purple',
    },
  ];

  const isLoadingStats = marketSummaryLoading || loading;

  return (
    <div>
      {/* ── Header ── */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1 className="page-title">
              Welcome back, <span style={{ color: 'var(--color-primary)' }}>{displayName}</span>!
            </h1>
            <p className="page-subtitle">Here is what is happening in the crypto markets today.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              className="btn-secondary"
              onClick={loadData}
              disabled={isLoadingStats}
              aria-label="Refresh dashboard data"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <FiRefreshCw style={{ animation: isLoadingStats ? 'spin 1s linear infinite' : 'none' }} />
              Refresh
            </button>
            <Link
              to="/coins"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}
            >
              <FiPieChart /> All Coins
            </Link>
          </div>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {marketSummaryError && (
        <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.5rem', color: '#fca5a5', fontSize: '0.875rem' }}>
          <FiAlertCircle style={{ flexShrink: 0, color: '#ef4444' }} />
          <span>Failed to load market data. <button onClick={loadData} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>Retry</button></span>
        </div>
      )}

      {/* ── Stats Grid ── */}
      <div className="stats-grid" aria-label="Market statistics">
        {isLoadingStats
          ? Array.from({ length: 6 }).map((_, i) => <StatSkeleton key={i} />)
          : stats.map((stat, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-card-header">
                <span className="stat-card-label">{stat.label}</span>
                <div className={`stat-card-icon ${stat.iconClass}`} aria-hidden="true">{stat.icon}</div>
              </div>
              <div className="stat-card-value">{stat.value}</div>
              {stat.change != null && (
                <div className={`stat-card-change ${stat.isPositive ? 'positive' : 'negative'}`}>
                  {stat.isPositive ? <FiArrowUpRight /> : <FiArrowDownRight />}
                  <span>{stat.change}</span>
                </div>
              )}
            </div>
          ))
        }
      </div>

      {/* ── Gainers / Losers Content Grid ── */}
      <div className="content-grid">
        {/* Top Gainers */}
        <div className="content-card">
          <h2 className="content-card-title">
            <FiTrendingUp style={{ color: 'var(--positive)' }} aria-hidden="true" />
            Top Gainers
          </h2>
          <div className="placeholder-list" role="list" aria-label="Top gaining coins">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <CoinRowSkeleton key={i} />)
              : safeTopGainers.length > 0
                ? safeTopGainers.slice(0, 6).map((coin, i) => <CoinListRow key={coin._id || i} coin={coin} />)
                : (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    No gainers data available.
                  </div>
                )
            }
          </div>
          {safeTopGainers.length > 0 && (
            <Link
              to="/analytics"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '1rem', fontSize: '0.82rem', color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}
            >
              View All Gainers <FiArrowUpRight />
            </Link>
          )}
        </div>

        {/* Top Losers */}
        <div className="content-card">
          <h2 className="content-card-title">
            <FiTrendingDown style={{ color: 'var(--negative)' }} aria-hidden="true" />
            Top Losers
          </h2>
          <div className="placeholder-list" role="list" aria-label="Top losing coins">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <CoinRowSkeleton key={i} />)
              : safeTopLosers.length > 0
                ? safeTopLosers.slice(0, 6).map((coin, i) => <CoinListRow key={coin._id || i} coin={coin} />)
                : (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    No losers data available.
                  </div>
                )
            }
          </div>
          {safeTopLosers.length > 0 && (
            <Link
              to="/analytics"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '1rem', fontSize: '0.82rem', color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}
            >
              View All Losers <FiArrowDownRight />
            </Link>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default Dashboard;
