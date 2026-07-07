import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Bookmark,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  RefreshCw,
  AlertCircle,
  Minus,
  Database
} from 'lucide-react';
import { fetchMarketSummaryThunk, fetchTopGainersThunk, fetchTopLosersThunk } from '../../redux/thunks/coinThunks';
import { formatPrice, formatLargeNumber, formatPercent, getCoinInitials, getChangeClass } from '../../utils/format';

/* ── Sparkline Helper ── */
const getSparklineData = (seed, isPositive) => {
  // Generates smooth wave-like stats sparkline path
  const points = isPositive 
    ? [20, 25, 23, 30, 28, 35, 42, 38, 48, 55]
    : [55, 48, 50, 40, 42, 32, 28, 30, 22, 15];
  
  // Add some unique fluctuation based on card seed
  return points.map((val, idx) => ({
    name: idx,
    value: val + (seed % 3) * (idx % 2 === 0 ? 3 : -2)
  }));
};

/* ── Skeleton Card Redesign ── */
function StatSkeleton() {
  return (
    <div className="stat-card" aria-hidden="true">
      <div className="stat-card-header">
        <div className="skeleton-pulse" style={{ height: '0.75rem', width: '60%', borderRadius: '4px' }} />
        <div className="skeleton-pulse" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '12px' }} />
      </div>
      <div className="skeleton-pulse" style={{ height: '1.85rem', width: '55%', borderRadius: '6px', margin: '0.75rem 0 0.5rem' }} />
      <div className="skeleton-pulse" style={{ height: '0.75rem', width: '40%', borderRadius: '4px' }} />
    </div>
  );
}

function CoinRowSkeleton() {
  return (
    <div className="placeholder-row" aria-hidden="true">
      <div className="placeholder-coin">
        <div className="skeleton-pulse" style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%' }} />
        <div>
          <div className="skeleton-pulse" style={{ width: '80px', height: '0.85rem', borderRadius: '4px', marginBottom: '0.3rem' }} />
          <div className="skeleton-pulse" style={{ width: '40px', height: '0.7rem', borderRadius: '4px' }} />
        </div>
      </div>
      <div className="skeleton-pulse" style={{ width: '55px', height: '1.35rem', borderRadius: '8px' }} />
    </div>
  );
}

/* ── Coin list row ── */
function CoinListRow({ coin }) {
  const change = coin.dailyReturn ?? coin.daily_return ?? coin.change_24h ?? 0;
  const cls = getChangeClass(change);
  const initials = getCoinInitials(coin.name, coin.symbol);
  const isUp = change >= 0;

  return (
    <motion.div 
      className="placeholder-row"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="placeholder-coin">
        <div className="placeholder-coin-dot">{typeof initials === 'string' ? initials.slice(0, 2) : '??'}</div>
        <div>
          <div className="placeholder-coin-name">{coin.name}</div>
          <div className="placeholder-coin-sym">{coin.symbol?.toUpperCase()}</div>
        </div>
      </div>
      <span className={`placeholder-badge ${isUp ? 'positive' : 'negative'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
        {change > 0 ? <ArrowUpRight size={13} />
          : change < 0 ? <ArrowDownRight size={13} />
          : <Minus size={13} />}
        {formatPercent(change)}
      </span>
    </motion.div>
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

  const safeTopGainers = Array.isArray(topGainers) ? topGainers : [];
  const safeTopLosers = Array.isArray(topLosers) ? topLosers : [];

  const loadData = useCallback(() => {
    dispatch(fetchMarketSummaryThunk());
    dispatch(fetchTopGainersThunk({ limit: 6 }));
    dispatch(fetchTopLosersThunk({ limit: 6 }));
  }, [dispatch]);

  useEffect(() => {
    if (!marketSummary && !marketSummaryLoading) {
      dispatch(fetchMarketSummaryThunk());
    }
    if (safeTopGainers.length === 0 && !loading) {
      dispatch(fetchTopGainersThunk({ limit: 6 }));
    }
    if (safeTopLosers.length === 0 && !loading) {
      dispatch(fetchTopLosersThunk({ limit: 6 }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const ms = marketSummary?.data || marketSummary;
  const gainersTop = safeTopGainers[0];
  const losersTop  = safeTopLosers[0];

  const stats = [
    {
      label: 'Total Market Cap',
      value: ms ? formatLargeNumber(ms.totalMarketCap || ms.marketCap) : '—',
      change: ms?.marketCapChange != null ? formatPercent(ms.marketCapChange) : null,
      isPositive: (ms?.marketCapChange ?? 0) >= 0,
      icon: <Activity size={18} />, iconClass: 'indigo',
    },
    {
      label: 'Top Gainer',
      value: gainersTop?.name ?? (loading ? '…' : '—'),
      change: gainersTop ? formatPercent(gainersTop.dailyReturn ?? gainersTop.daily_return ?? gainersTop.change_24h) : null,
      isPositive: true,
      icon: <TrendingUp size={18} />, iconClass: 'green',
    },
    {
      label: 'Top Loser',
      value: losersTop?.name ?? (loading ? '…' : '—'),
      change: losersTop ? formatPercent(losersTop.dailyReturn ?? losersTop.daily_return ?? losersTop.change_24h) : null,
      isPositive: false,
      icon: <TrendingDown size={18} />, iconClass: 'red',
    },
    {
      label: '24h Volume',
      value: ms ? formatLargeNumber(ms.totalVolume || ms.volume24h || ms.volume) : '—',
      change: null, isPositive: true,
      icon: <DollarSign size={18} />, iconClass: 'amber',
    },
    {
      label: 'Active Assets',
      value: ms ? (ms.totalCoins || ms.count || ms.activeCoins || '—').toLocaleString() : '—',
      change: null, isPositive: true,
      icon: <Database size={18} />, iconClass: 'blue',
    },
    {
      label: 'My Watchlist',
      value: bookmarkAnalytics ? `${bookmarkAnalytics.totalBookmarked ?? 0} Coins` : '—',
      change: null, isPositive: true,
      icon: <Bookmark size={18} />, iconClass: 'indigo', // purple class removed and changed to indigo (neon cyan glow)
    },
  ];

  const isLoadingStats = marketSummaryLoading || loading;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* ── Header ── */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1 className="page-title">
              Welcome back, <span className="title-gradient">{displayName}</span>!
            </h1>
            <p className="page-subtitle">Here is what is happening in the crypto markets today.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <motion.button
              className="btn-secondary"
              onClick={loadData}
              disabled={isLoadingStats}
              aria-label="Refresh dashboard data"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.15rem', fontSize: '0.85rem' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw size={14} className={isLoadingStats ? 'animate-spin' : ''} />
              Refresh
            </motion.button>
            <Link
              to="/coins"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.15rem', fontSize: '0.85rem', background: 'rgba(0,229,255,0.08)', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, boxShadow: 'var(--shadow-glow-sm)' }}
            >
              <PieChart size={14} /> All Coins
            </Link>
          </div>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {marketSummaryError && (
        <motion.div 
          role="alert" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: '12px', padding: '0.85rem 1.15rem', marginBottom: '1.5rem', color: '#ff8096', fontSize: '0.875rem' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertCircle style={{ flexShrink: 0, color: '#ff4d6d' }} size={16} />
          <span>Failed to load market data. <button onClick={loadData} style={{ background: 'none', border: 'none', color: '#ff4d6d', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}>Retry</button></span>
        </motion.div>
      )}

      {/* ── Stats Grid ── */}
      <div className="stats-grid" aria-label="Market statistics">
        {isLoadingStats
          ? Array.from({ length: 6 }).map((_, i) => <StatSkeleton key={i} />)
          : stats.map((stat, i) => {
              const sparklineData = getSparklineData(i, stat.isPositive);
              const lineColor = stat.isPositive ? '#00ff9d' : '#ff4d6d';
              const gradientId = `sparkline-gradient-${i}`;

              return (
                <motion.div 
                  className="stat-card" 
                  key={i}
                  variants={itemVariants}
                >
                  <div className="stat-card-header" style={{ position: 'relative', zIndex: 2 }}>
                    <span className="stat-card-label">{stat.label}</span>
                    <div className={`stat-card-icon ${stat.iconClass}`} aria-hidden="true">{stat.icon}</div>
                  </div>
                  <div className="stat-card-value" style={{ position: 'relative', zIndex: 2 }}>{stat.value}</div>
                  
                  {stat.change != null && (
                    <div className={`stat-card-change ${stat.isPositive ? 'positive' : 'negative'}`} style={{ position: 'relative', zIndex: 2 }}>
                      {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      <span>{stat.change}</span>
                    </div>
                  )}

                  {/* Embedded Sparkline Chart */}
                  <div className="stat-card-sparkline">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData} margin={{ top: 5, bottom: 0, left: 0, right: 0 }}>
                        <defs>
                          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={lineColor} stopOpacity={0.25} />
                            <stop offset="100%" stopColor={lineColor} stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={lineColor} 
                          strokeWidth={1.5}
                          fill={`url(#${gradientId})`}
                          dot={false}
                          activeDot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              );
            })
        }
      </div>

      {/* ── Gainers / Losers Content Grid ── */}
      <div className="content-grid">
        {/* Top Gainers */}
        <motion.div className="content-card" variants={itemVariants}>
          <h2 className="content-card-title">
            <TrendingUp style={{ color: 'var(--positive)' }} aria-hidden="true" size={18} />
            Top Gainers
          </h2>
          <div className="placeholder-list" role="list" aria-label="Top gaining coins">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <CoinRowSkeleton key={i} />)
              : safeTopGainers.length > 0
                ? safeTopGainers.slice(0, 6).map((coin, i) => <CoinListRow key={coin._id || i} coin={coin} />)
                : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No gainers data available.
                  </div>
                )
            }
          </div>
          {safeTopGainers.length > 0 && (
            <Link
              to="/analytics"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '1.25rem', fontSize: '0.85rem', color: '#00e5ff', textDecoration: 'none', fontWeight: 700 }}
            >
              View All Gainers <ArrowUpRight size={14} />
            </Link>
          )}
        </motion.div>

        {/* Top Losers */}
        <motion.div className="content-card" variants={itemVariants}>
          <h2 className="content-card-title">
            <TrendingDown style={{ color: 'var(--negative)' }} aria-hidden="true" size={18} />
            Top Losers
          </h2>
          <div className="placeholder-list" role="list" aria-label="Top losing coins">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <CoinRowSkeleton key={i} />)
              : safeTopLosers.length > 0
                ? safeTopLosers.slice(0, 6).map((coin, i) => <CoinListRow key={coin._id || i} coin={coin} />)
                : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No losers data available.
                  </div>
                )
            }
          </div>
          {safeTopLosers.length > 0 && (
            <Link
              to="/analytics"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '1.25rem', fontSize: '0.85rem', color: '#ff4d6d', textDecoration: 'none', fontWeight: 700 }}
            >
              View All Losers <ArrowDownRight size={14} />
            </Link>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
