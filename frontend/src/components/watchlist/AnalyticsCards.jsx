import React from 'react';
import { FiBookmark, FiTrendingUp, FiLayers, FiPlusCircle, FiZap, FiActivity } from 'react-icons/fi';
import { formatLargeNumber, formatPercent } from '../../utils/format';
import { useNavigate } from 'react-router-dom';

function AnalyticsCards({ analytics, trending }) {
  const navigate = useNavigate();

  const total = analytics?.totalBookmarked ?? 0;
  const highestCap = analytics?.highestMarketCap;
  const highestPotential = analytics?.highestProfitPotential;
  const recent = analytics?.recentlyAdded?.[0];
  const topTrending = trending?.[0];

  const handleNavigate = (coinId) => {
    if (coinId) navigate(`/coins/${coinId}`);
  };

  return (
    <div className="watchlist-analytics-grid">
      {/* Card 1: Total Bookmarked Coins */}
      <div className="watchlist-analytic-card">
        <div className="watchlist-analytic-header">
          <span className="watchlist-analytic-label">Total Bookmarked</span>
          <div className="watchlist-analytic-icon blue">
            <FiBookmark />
          </div>
        </div>
        <div className="watchlist-analytic-value">{total}</div>
        <div className="watchlist-analytic-sub">
          Saved coins in portfolio
        </div>
      </div>

      {/* Card 2: Highest Market Cap Coin */}
      <div
        className={`watchlist-analytic-card clickable ${highestCap ? '' : 'disabled'}`}
        onClick={() => highestCap && handleNavigate(highestCap.coinId)}
      >
        <div className="watchlist-analytic-header">
          <span className="watchlist-analytic-label">Highest Cap Coin</span>
          <div className="watchlist-analytic-icon indigo">
            <FiLayers />
          </div>
        </div>
        <div className="watchlist-analytic-value">
          {highestCap ? highestCap.symbol : '—'}
        </div>
        <div className="watchlist-analytic-sub text-truncate" title={highestCap?.coinName}>
          {highestCap
            ? `${highestCap.coinName} (${formatLargeNumber(highestCap.marketCap)})`
            : 'No coins saved yet'}
        </div>
      </div>

      {/* Card 3: Highest Potential Coin */}
      <div
        className={`watchlist-analytic-card clickable ${highestPotential ? '' : 'disabled'}`}
        onClick={() => highestPotential && handleNavigate(highestPotential.coinId)}
      >
        <div className="watchlist-analytic-header">
          <span className="watchlist-analytic-label">Highest Potential</span>
          <div className="watchlist-analytic-icon emerald">
            <FiTrendingUp />
          </div>
        </div>
        <div className="watchlist-analytic-value">
          {highestPotential && highestPotential.profitPotential > 0
            ? `${highestPotential.symbol}`
            : '—'}
        </div>
        <div className="watchlist-analytic-sub text-truncate">
          {highestPotential && highestPotential.profitPotential > 0 ? (
            <span className="positive-text">
              {highestPotential.coinName} ({formatPercent(highestPotential.profitPotential)})
            </span>
          ) : (
            'No gains tracked yet'
          )}
        </div>
      </div>

      {/* Card 4: Recent Bookmarks */}
      <div
        className={`watchlist-analytic-card clickable ${recent ? '' : 'disabled'}`}
        onClick={() => recent && handleNavigate(recent.coin)}
      >
        <div className="watchlist-analytic-header">
          <span className="watchlist-analytic-label">Recent Bookmark</span>
          <div className="watchlist-analytic-icon amber">
            <FiPlusCircle />
          </div>
        </div>
        <div className="watchlist-analytic-value">
          {recent ? recent.symbol : '—'}
        </div>
        <div className="watchlist-analytic-sub text-truncate" title={recent?.coinName}>
          {recent ? `${recent.coinName} saved recently` : 'No recent activity'}
        </div>
      </div>

      {/* Card 5: Trending Coin */}
      <div
        className={`watchlist-analytic-card clickable ${topTrending ? '' : 'disabled'}`}
        onClick={() => topTrending && handleNavigate(topTrending.coinId)}
      >
        <div className="watchlist-analytic-header">
          <span className="watchlist-analytic-label">Global Top Saved</span>
          <div className="watchlist-analytic-icon purple">
            <FiZap />
          </div>
        </div>
        <div className="watchlist-analytic-value">
          {topTrending ? topTrending.symbol : '—'}
        </div>
        <div className="watchlist-analytic-sub text-truncate" title={topTrending?.coinName}>
          {topTrending
            ? `${topTrending.coinName} (${topTrending.count} watchlists)`
            : 'No trending data'}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsCards;
