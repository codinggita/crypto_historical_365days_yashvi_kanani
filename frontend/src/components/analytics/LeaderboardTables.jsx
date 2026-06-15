import React, { useState } from 'react';
import { FiTrendingUp, FiTrendingDown, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { formatPrice, formatLargeNumber, formatPercent, getCoinInitials } from '../../utils/format';
import { useNavigate } from 'react-router-dom';

function extractList(raw) {
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  return [];
}

function CoinRow({ coin, rank, isGainer }) {
  const navigate = useNavigate();
  const change = parseFloat(coin?.dailyReturn ?? 0);
  const isPositive = change >= 0;

  const handleClick = () => {
    if (coin?.coinId) navigate(`/coins/${coin.coinId}`);
  };

  return (
    <div
      className={`leaderboard-row ${coin?.coinId ? 'leaderboard-row--clickable' : ''}`}
      onClick={handleClick}
      role={coin?.coinId ? 'button' : undefined}
      tabIndex={coin?.coinId ? 0 : undefined}
    >
      <span className="lb-rank">#{rank}</span>

      <div className="lb-coin">
        <div className={`lb-coin-icon ${isGainer ? 'positive-bg' : 'negative-bg'}`}>
          {getCoinInitials(coin?.name, coin?.symbol)}
        </div>
        <div className="lb-coin-meta">
          <span className="lb-coin-name">{coin?.name ?? '—'}</span>
          <span className="lb-coin-sym">{coin?.symbol ?? '—'}</span>
        </div>
      </div>

      <span className="lb-price">{formatPrice(coin?.price)}</span>

      <span className={`lb-change ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? <FiArrowUpRight /> : <FiArrowDownRight />}
        {formatPercent(change)}
      </span>

      <span className="lb-volume hide-mobile">{formatLargeNumber(coin?.volume)}</span>
      <span className="lb-mcap hide-tablet">{formatLargeNumber(coin?.marketCap)}</span>
    </div>
  );
}

function LeaderboardTables({ topGainers, topLosers }) {
  const [gainersPage, setGainersPage] = useState(1);
  const [losersPage,  setLosersPage]  = useState(1);
  const PAGE_SIZE = 10;

  const gainers = extractList(topGainers);
  const losers  = extractList(topLosers);

  const paginatedGainers = gainers.slice(0, gainersPage * PAGE_SIZE);
  const paginatedLosers  = losers.slice(0, losersPage * PAGE_SIZE);

  return (
    <div className="analytics-section">
      <div className="analytics-section-header">
        <h2 className="analytics-section-title">
          <FiTrendingUp className="section-title-icon" />
          Top Gainers &amp; Losers
        </h2>
        <p className="analytics-section-subtitle">
          Top 10 best and worst performing assets ranked by daily return
        </p>
      </div>

      <div className="leaderboard-grid">
        {/* Top Gainers */}
        <div className="analytics-chart-card">
          <div className="leaderboard-header">
            <div className="analytics-chart-title">
              <FiTrendingUp style={{ color: 'var(--positive)' }} />
              Top Gainers
            </div>
            <span className="leaderboard-count">{gainers.length} coins</span>
          </div>

          <div className="leaderboard-col-labels">
            <span>#</span>
            <span>Coin</span>
            <span>Price</span>
            <span>Return</span>
            <span className="hide-mobile">Volume</span>
            <span className="hide-tablet">Mkt Cap</span>
          </div>

          <div className="leaderboard-body">
            {gainers.length === 0 ? (
              <div className="analytics-empty">
                <FiTrendingUp size={30} />
                <p>No gainers data</p>
              </div>
            ) : (
              paginatedGainers.map((coin, i) => (
                <CoinRow key={coin?.coinId ?? i} coin={coin} rank={i + 1} isGainer />
              ))
            )}
          </div>

          {gainers.length > gainersPage * PAGE_SIZE && (
            <button className="lb-load-more" onClick={() => setGainersPage((p) => p + 1)}>
              Load More
            </button>
          )}
        </div>

        {/* Top Losers */}
        <div className="analytics-chart-card">
          <div className="leaderboard-header">
            <div className="analytics-chart-title">
              <FiTrendingDown style={{ color: 'var(--negative)' }} />
              Top Losers
            </div>
            <span className="leaderboard-count">{losers.length} coins</span>
          </div>

          <div className="leaderboard-col-labels">
            <span>#</span>
            <span>Coin</span>
            <span>Price</span>
            <span>Return</span>
            <span className="hide-mobile">Volume</span>
            <span className="hide-tablet">Mkt Cap</span>
          </div>

          <div className="leaderboard-body">
            {losers.length === 0 ? (
              <div className="analytics-empty">
                <FiTrendingDown size={30} />
                <p>No losers data</p>
              </div>
            ) : (
              paginatedLosers.map((coin, i) => (
                <CoinRow key={coin?.coinId ?? i} coin={coin} rank={i + 1} isGainer={false} />
              ))
            )}
          </div>

          {losers.length > losersPage * PAGE_SIZE && (
            <button className="lb-load-more" onClick={() => setLosersPage((p) => p + 1)}>
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeaderboardTables;
