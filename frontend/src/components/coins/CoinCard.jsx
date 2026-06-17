import React from 'react';
import { FiArrowUpRight, FiArrowDownRight, FiMinus, FiEye } from 'react-icons/fi';
import { formatPrice, formatLargeNumber, getCoinInitials, getChangeClass } from '../../utils/format';
import { useNavigate } from 'react-router-dom';

function ChangeChip({ value }) {
  const cls = getChangeClass(value);
  const num = parseFloat(value);
  if (isNaN(num)) return <span className={`coin-change neutral`}><FiMinus /> —</span>;
  return (
    <span className={`coin-change ${cls}`}>
      {cls === 'positive' ? <FiArrowUpRight /> : cls === 'negative' ? <FiArrowDownRight /> : <FiMinus />}
      {Math.abs(num).toFixed(2)}%
    </span>
  );
}

function CoinCard({ coin, index }) {
  const navigate = useNavigate();
  const initials = getCoinInitials(coin.name, coin.symbol);
  const coinId = coin._id || coin.id || coin.symbol;

  return (
    <div className="coin-card">
      <div className="coin-card-header">
        <div className="coin-card-identity">
          {coin.image ? (
            <img
              src={coin.image}
              alt={coin.name}
              className="coin-card-logo-img"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="coin-card-logo" style={coin.image ? { display: 'none' } : {}}>
            {initials}
          </div>
          <div>
            <div className="coin-card-name">{coin.name || '—'}</div>
            <div className="coin-card-symbol">{coin.symbol || '—'}</div>
          </div>
        </div>
        <div className="coin-card-rank">#{coin.rank || index + 1}</div>
      </div>

      <div className="coin-card-price">
        {formatPrice(coin.price ?? coin.close ?? coin.open)}
      </div>

      <div className="coin-card-change">
        <ChangeChip value={coin.change_24h ?? coin.daily_return} />
      </div>

      <div className="coin-card-stats">
        <div className="coin-card-stat-row">
          <span className="coin-card-stat-label">Market Cap</span>
          <span className="coin-card-stat-value">{formatLargeNumber(coin.market_cap)}</span>
        </div>
        <div className="coin-card-stat-row">
          <span className="coin-card-stat-label">Volume 24h</span>
          <span className="coin-card-stat-value">{formatLargeNumber(coin.volume_24h ?? coin.volume)}</span>
        </div>
        <div className="coin-card-stat-row">
          <span className="coin-card-stat-label">24h High</span>
          <span className="coin-card-stat-value">{formatPrice(coin.high_24h ?? coin.high)}</span>
        </div>
        <div className="coin-card-stat-row">
          <span className="coin-card-stat-label">24h Low</span>
          <span className="coin-card-stat-value">{formatPrice(coin.low_24h ?? coin.low)}</span>
        </div>
      </div>

      <button
        id={`card-view-${coin.symbol || index}`}
        className="coin-card-view-btn"
        onClick={() => navigate(`/coins/${coinId}`)}
      >
        <FiEye style={{ marginRight: '0.35rem' }} /> View Details
      </button>
    </div>
  );
}

export default CoinCard;
