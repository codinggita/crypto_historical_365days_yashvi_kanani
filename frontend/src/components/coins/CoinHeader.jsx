import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiArrowUpRight, FiArrowDownRight, FiMinus } from 'react-icons/fi';
import { formatPrice, formatPercent, getCoinInitials, getChangeClass } from '../../utils/format';
import BookmarkButton from '../watchlist/BookmarkButton';

function CoinHeader({ coin }) {
  const navigate = useNavigate();

  const coinId = coin._id || coin.id || coin.symbol;
  const symbol = coin.symbol || '—';
  const name = coin.name || '—';
  const price = coin.price ?? coin.close ?? coin.open ?? 0;
  const change = coin.change_24h ?? coin.daily_return ?? 0;
  const rank = coin.rank || '—';

  const initials = getCoinInitials(name, symbol);
  const changeCls = getChangeClass(change);

  return (
    <div className="coin-header-card">
      <div className="coin-header-left">
        <div className="coin-header-logo">{initials}</div>
        <div className="coin-header-meta">
          <div className="coin-header-title-row">
            <h1 className="coin-header-name">{name}</h1>
            <span className="coin-header-symbol">{symbol}</span>
            <span className="coin-header-rank-badge">Rank #{rank}</span>
          </div>
          <div className="coin-header-price-row">
            <span className="coin-header-price">{formatPrice(price)}</span>
            <span className={`coin-header-change-chip ${changeCls}`}>
              {changeCls === 'positive' ? (
                <FiArrowUpRight />
              ) : changeCls === 'negative' ? (
                <FiArrowDownRight />
              ) : (
                <FiMinus />
              )}
              {formatPercent(Math.abs(change), 2)}
            </span>
          </div>
        </div>
      </div>

      <div className="coin-header-actions">
        <BookmarkButton
          coin={coin}
          showText={true}
          className="btn-watchlist-toggle"
        />
      </div>
    </div>
  );
}

export default CoinHeader;
