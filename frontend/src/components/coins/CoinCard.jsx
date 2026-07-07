import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Minus, Eye } from 'lucide-react';
import { formatPrice, formatLargeNumber, getCoinInitials, getChangeClass } from '../../utils/format';

function ChangeChip({ value }) {
  const cls = getChangeClass(value);
  const num = parseFloat(value);
  if (isNaN(num)) return <span className="coin-change neutral"><Minus size={12} /> —</span>;
  return (
    <span className={`coin-change ${cls}`}>
      {cls === 'positive' ? <ArrowUpRight size={13} /> : cls === 'negative' ? <ArrowDownRight size={13} /> : <Minus size={13} />}
      {Math.abs(num).toFixed(2)}%
    </span>
  );
}

function CoinCard({ coin, index }) {
  const navigate = useNavigate();
  const initials = getCoinInitials(coin.name, coin.symbol);
  // Navigate by coinId slug (e.g. "bitcoin") which works with findCoinByFlexibleId
  const coinId = coin.coinId || coin._id || coin.id || coin.symbol?.toLowerCase();

  return (
    <motion.div 
      className="coin-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
    >
      <div className="coin-card-header">
        <div className="coin-card-identity">
          {coin.image ? (
            <img
              src={coin.image}
              alt={coin.name}
              className="coin-logo-img"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="coin-logo-circle" style={coin.image ? { display: 'none' } : {}}>
            {initials}
          </div>
          <div>
            <div className="coin-card-name">{coin.name || '—'}</div>
            <div className="coin-card-symbol">{coin.symbol?.toUpperCase() || '—'}</div>
          </div>
        </div>
        <div className="coin-card-rank">#{coin.rank || index + 1}</div>
      </div>

      <div className="coin-card-price">
        {formatPrice(coin.price ?? coin.close ?? coin.open)}
      </div>

      <div className="coin-card-change">
        <ChangeChip value={coin.change_24h ?? coin.dailyReturn ?? coin.daily_return} />
      </div>

      <div className="coin-card-stats">
        <div className="coin-card-stat-row">
          <span className="coin-card-stat-label">Market Cap</span>
          <span className="coin-card-stat-value">{formatLargeNumber(coin.marketCap ?? coin.market_cap)}</span>
        </div>
        <div className="coin-card-stat-row">
          <span className="coin-card-stat-label">Volume 24h</span>
          <span className="coin-card-stat-value">{formatLargeNumber(coin.volume ?? coin.volume_24h)}</span>
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
        <Eye size={13} style={{ marginRight: '0.35rem', display: 'inline-block', verticalAlign: 'middle' }} />
        <span>View Details</span>
      </button>
    </motion.div>
  );
}

export default CoinCard;
