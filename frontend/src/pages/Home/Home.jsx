import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiTrendingUp, FiTrendingDown, FiBarChart2, FiShield, FiActivity,
  FiPieChart, FiBookmark, FiArrowRight, FiZap, FiGlobe, FiArrowUpRight, FiArrowDownRight,
} from 'react-icons/fi';
import { fetchMarketSummaryThunk, fetchTopGainersThunk, fetchTopLosersThunk, fetchTrendingCoinsThunk } from '../../redux/thunks/coinThunks';
import { formatPrice, formatLargeNumber, formatPercent, getCoinInitials, getChangeClass } from '../../utils/format';
import '../../styles/home.css';

const FEATURES = [
  {
    icon: <FiBarChart2 />, color: '#6366f1', bg: 'rgba(99,102,241,0.12)',
    title: '365-Day History', text: 'Access a full year of daily OHLCV data for every major cryptocurrency asset.',
  },
  {
    icon: <FiTrendingUp />, color: '#10b981', bg: 'rgba(16,185,129,0.12)',
    title: 'Volatility Analytics', text: 'Understand risk profiles with standard deviation, daily return, and drawdown metrics.',
  },
  {
    icon: <FiPieChart />, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',
    title: 'Portfolio Simulator', text: 'Simulate investment growth using real historical price trajectories.',
  },
  {
    icon: <FiBookmark />, color: '#a855f7', bg: 'rgba(168,85,247,0.12)',
    title: 'Smart Watchlist', text: 'Bookmark assets, add notes, and track performance since you bookmarked them.',
  },
  {
    icon: <FiShield />, color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',
    title: 'Secure Authentication', text: 'JWT-based auth protects your data and portfolio insights end-to-end.',
  },
  {
    icon: <FiActivity />, color: '#ef4444', bg: 'rgba(239,68,68,0.12)',
    title: 'Market Insights', text: 'Top gainers, losers, trending coins, and market cap rankings — all in one view.',
  },
];

function CoinRow({ coin, showChange = true }) {
  const navigate = useNavigate();
  const initials = getCoinInitials(coin.name, coin.symbol);
  const change = coin.dailyReturn ?? coin.daily_return ?? coin.change_24h ?? 0;
  const cls = getChangeClass(change);

  return (
    <div
      className="home-coin-row"
      onClick={() => navigate(`/coins/${coin._id || coin.id || coin.coinId}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/coins/${coin._id || coin.id || coin.coinId}`)}
    >
      <div className="home-coin-identity">
        <div className="home-coin-dot">{initials}</div>
        <div>
          <div className="home-coin-name">{coin.name}</div>
          <div className="home-coin-sym">{coin.symbol}</div>
        </div>
      </div>
      <div className="home-coin-right">
        <div className="home-coin-price">{formatPrice(coin.price ?? coin.close)}</div>
        {showChange && (
          <div className={`home-coin-change ${cls}`}>
            {change >= 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
            {formatPercent(change)}
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="home-coin-row" style={{ cursor: 'default' }}>
      <div className="home-coin-identity">
        <div className="skeleton-pulse" style={{ width: '2rem', height: '2rem', borderRadius: '8px' }} />
        <div>
          <div className="skeleton-pulse" style={{ width: '80px', height: '0.85rem', borderRadius: '4px', marginBottom: '0.3rem' }} />
          <div className="skeleton-pulse" style={{ width: '40px', height: '0.7rem', borderRadius: '4px' }} />
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="skeleton-pulse" style={{ width: '70px', height: '0.875rem', borderRadius: '4px', marginBottom: '0.3rem' }} />
        <div className="skeleton-pulse" style={{ width: '50px', height: '0.775rem', borderRadius: '4px' }} />
      </div>
    </div>
  );
}

function Home() {
  const dispatch = useDispatch();
  const { marketSummary, topGainers, topLosers, loading, marketSummaryLoading } = useSelector((s) => s.coins);
  const { user, isAuthenticated } = useSelector((s) => s.auth);

  const [trending, setTrending] = React.useState([]);
  const [trendingLoading, setTrendingLoading] = React.useState(false);

  useEffect(() => {
    dispatch(fetchMarketSummaryThunk());
    dispatch(fetchTopGainersThunk({ limit: 5 }));
    dispatch(fetchTopLosersThunk({ limit: 5 }));

    const loadTrending = async () => {
      setTrendingLoading(true);
      try {
        const result = await dispatch(fetchTrendingCoinsThunk()).unwrap();
        setTrending(Array.isArray(result) ? result.slice(0, 5) : []);
      } catch {
        setTrending([]);
      } finally {
        setTrendingLoading(false);
      }
    };
    loadTrending();
  }, [dispatch]);

  const marketCards = useMemo(() => {
    if (!marketSummary) return null;
    const data = marketSummary.data || marketSummary;
    return [
      { label: 'Total Market Cap', value: formatLargeNumber(data.totalMarketCap || data.marketCap), change: data.marketCapChange, positive: (data.marketCapChange ?? 0) >= 0 },
      { label: 'Total Volume 24h', value: formatLargeNumber(data.totalVolume || data.volume), change: null },
      { label: 'BTC Dominance', value: `${parseFloat(data.btcDominance ?? data.dominance ?? 0).toFixed(1)}%`, change: null },
      { label: 'Active Assets', value: (data.totalCoins || data.count || '100+').toLocaleString(), change: null },
    ];
  }, [marketSummary]);

  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="home-hero" aria-label="Welcome hero section">
        <div className="home-hero-bg" />
        <div className="home-hero-grid" />
        <div className="home-hero-content">
          <div className="home-hero-badge">
            <span className="home-hero-badge-dot" />
            Real Historical Data · 365 Days · 100+ Coins
          </div>

          <h1 className="home-hero-title">
            Crypto Analytics<br />
            <span className="home-hero-title-accent">Built for Precision</span>
          </h1>

          <p className="home-hero-subtitle">
            Explore 365-day price history, run portfolio simulations, track market volatility,
            and make informed crypto decisions with <strong>CryptoVerseX</strong>.
          </p>

          <div className="home-hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="home-btn-primary">
                Go to Dashboard <FiArrowRight />
              </Link>
            ) : (
              <>
                <Link to="/register" className="home-btn-primary">
                  Start for Free <FiZap />
                </Link>
                <Link to="/login" className="home-btn-secondary">
                  Sign In <FiArrowRight />
                </Link>
              </>
            )}
          </div>

          <div className="home-hero-stats">
            <div className="home-hero-stat">
              <div className="home-hero-stat-value">365</div>
              <div className="home-hero-stat-label">Days of History</div>
            </div>
            <div className="home-hero-stat">
              <div className="home-hero-stat-value">100+</div>
              <div className="home-hero-stat-label">Crypto Assets</div>
            </div>
            <div className="home-hero-stat">
              <div className="home-hero-stat-value">6</div>
              <div className="home-hero-stat-label">Analytics Modules</div>
            </div>
            <div className="home-hero-stat">
              <div className="home-hero-stat-value">∞</div>
              <div className="home-hero-stat-label">Simulations</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Live Market Overview ── */}
      <section className="home-section" aria-label="Market overview">
        <div className="home-section-header">
          <div className="home-section-badge"><FiGlobe style={{ marginRight: 4 }} />Live Market</div>
          <h2 className="home-section-title">Market Overview</h2>
          <p className="home-section-subtitle">Current snapshot of the global crypto market capitalization and volume data.</p>
        </div>
        <div className="home-market-grid">
          {marketSummaryLoading || !marketCards
            ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="home-market-card">
                <div className="skeleton-pulse" style={{ height: '0.7rem', width: '60%', borderRadius: '4px', marginBottom: '0.65rem' }} />
                <div className="skeleton-pulse" style={{ height: '1.5rem', width: '80%', borderRadius: '4px', marginBottom: '0.4rem' }} />
                <div className="skeleton-pulse" style={{ height: '0.75rem', width: '45%', borderRadius: '4px' }} />
              </div>
            ))
            : marketCards.map((card, i) => (
              <div key={i} className="home-market-card">
                <div className="home-market-card-label">{card.label}</div>
                <div className="home-market-card-value">{card.value}</div>
                {card.change != null && (
                  <div className={`home-market-card-change ${card.positive ? 'positive' : 'negative'}`}>
                    {card.positive ? <FiArrowUpRight /> : <FiArrowDownRight />}
                    {formatPercent(card.change)}
                  </div>
                )}
              </div>
            ))
          }
        </div>
      </section>

      {/* ── Trending / Gainers / Losers ── */}
      <section className="home-section" style={{ paddingTop: 0 }} aria-label="Trending, gainers, and losers">
        <div className="home-tables-grid">
          {/* Trending */}
          <div className="home-coin-panel">
            <div className="home-coin-panel-header">
              <div className="home-coin-panel-title"><FiZap style={{ color: '#f59e0b' }} /> Trending</div>
              <Link to="/coins" style={{ fontSize: '0.78rem', color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
            </div>
            {trendingLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : trending.length > 0
                ? trending.map((c, i) => <CoinRow key={c._id || i} coin={c} />)
                : <div style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>No trending data available.</div>
            }
          </div>

          {/* Top Gainers */}
          <div className="home-coin-panel">
            <div className="home-coin-panel-header">
              <div className="home-coin-panel-title"><FiTrendingUp style={{ color: '#10b981' }} /> Top Gainers</div>
              <Link to="/analytics" style={{ fontSize: '0.78rem', color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
            </div>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : topGainers.length > 0
                ? topGainers.slice(0, 5).map((c, i) => <CoinRow key={c._id || i} coin={c} />)
                : <div style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>No gainers data available.</div>
            }
          </div>

          {/* Top Losers */}
          <div className="home-coin-panel">
            <div className="home-coin-panel-header">
              <div className="home-coin-panel-title"><FiTrendingDown style={{ color: '#ef4444' }} /> Top Losers</div>
              <Link to="/analytics" style={{ fontSize: '0.78rem', color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
            </div>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : topLosers.length > 0
                ? topLosers.slice(0, 5).map((c, i) => <CoinRow key={c._id || i} coin={c} />)
                : <div style={{ padding: '1.5rem', color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>No losers data available.</div>
            }
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="home-section" aria-label="Platform features">
        <div className="home-section-header">
          <div className="home-section-badge"><FiZap style={{ marginRight: 4 }} />Features</div>
          <h2 className="home-section-title">Everything You Need</h2>
          <p className="home-section-subtitle">A complete toolkit for historical crypto research and simulation.</p>
        </div>
        <div className="home-features-grid">
          {FEATURES.map((f, i) => (
            <div className="home-feature-card" key={i}>
              <div className="home-feature-icon" style={{ background: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <div className="home-feature-title">{f.title}</div>
              <div className="home-feature-text">{f.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why CryptoVerseX ── */}
      <section style={{ background: 'rgba(99,102,241,0.04)', borderTop: '1px solid rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
        <div className="home-section" style={{ textAlign: 'center' }}>
          <div className="home-section-badge">Why Us</div>
          <h2 className="home-section-title">Why CryptoVerseX?</h2>
          <p className="home-section-subtitle" style={{ maxWidth: 660, marginBottom: '2.5rem' }}>
            Unlike other tools that use real-time external feeds, CryptoVerseX leverages curated
            historical datasets — ensuring reproducible, auditable analysis and full offline capability.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { icon: '🔒', label: 'Data Privacy', desc: 'No third-party feeds; your queries stay private.' },
              { icon: '📊', label: 'Research Grade', desc: 'Full OHLCV history with performance metrics.' },
              { icon: '⚡', label: 'Instant Access', desc: 'Sub-second queries on pre-indexed datasets.' },
              { icon: '🎯', label: 'GSSoC Ready', desc: 'Open source, extensible, and documented.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.5rem', minWidth: '180px', maxWidth: '240px', backdropFilter: 'blur(12px)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.65rem' }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f3f4f6', marginBottom: '0.35rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.825rem', color: '#6b7280', lineHeight: 1.55 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!isAuthenticated && (
        <section className="home-section" style={{ textAlign: 'center' }}>
          <h2 className="home-section-title">Ready to Explore the Data?</h2>
          <p className="home-section-subtitle" style={{ marginBottom: '2rem' }}>
            Join thousands of analysts using CryptoVerseX to research the crypto market.
          </p>
          <Link to="/register" className="home-btn-primary" style={{ margin: '0 auto' }}>
            Create Free Account <FiZap />
          </Link>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="home-footer" role="contentinfo">
        <div className="home-footer-inner">
          <div className="home-footer-brand">
            <div className="home-footer-brand-icon"><FiBarChart2 /></div>
            CryptoVerseX
          </div>
          <nav className="home-footer-links" aria-label="Footer navigation">
            <Link to="/" className="home-footer-link">Home</Link>
            <Link to="/coins" className="home-footer-link">Coins</Link>
            <Link to="/analytics" className="home-footer-link">Analytics</Link>
            <Link to="/stats" className="home-footer-link">Statistics</Link>
            <Link to="/portfolio" className="home-footer-link">Portfolio</Link>
            <Link to="/watchlist" className="home-footer-link">Watchlist</Link>
          </nav>
          <div className="home-footer-copy">© {new Date().getFullYear()} CryptoVerseX. Built for historical crypto analytics research.</div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
