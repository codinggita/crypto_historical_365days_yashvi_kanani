import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiBookmark, FiChevronRight } from 'react-icons/fi';
import { formatPrice, getCoinInitials } from '../../utils/format';

function TrendingBookmarks({ trending }) {
  const navigate = useNavigate();

  if (!trending || trending.length === 0) {
    return (
      <div className="trending-bookmarks-empty">
        <p>No trending coins tracked globally yet.</p>
      </div>
    );
  }

  return (
    <div className="trending-bookmarks-card">
      <div className="trending-bookmarks-header">
        <FiTrendingUp className="trending-title-icon" />
        <div>
          <h3>Trending Coins</h3>
          <p>Top bookmarked cryptocurrencies across all users globally</p>
        </div>
      </div>

      <div className="trending-bookmarks-list">
        {trending.map((coin, index) => {
          const initials = getCoinInitials(coin.coinName, coin.symbol);
          
          return (
            <div
              key={coin.coinId || index}
              className="trending-bookmark-item"
              onClick={() => navigate(`/coins/${coin.coinId}`)}
              style={{ cursor: 'pointer' }}
            >
              {/* Left: Rank & Icon & Name */}
              <div className="trending-item-left">
                <span className="trending-item-rank">#{index + 1}</span>
                <div className="trending-item-logo">{initials}</div>
                <div className="trending-item-meta">
                  <span className="trending-item-symbol">{coin.symbol}</span>
                  <span className="trending-item-name">{coin.coinName}</span>
                </div>
              </div>

              {/* Right: Price, Watchlist Count & Action */}
              <div className="trending-item-right">
                <div className="trending-item-price-info">
                  <span className="trending-item-price">{formatPrice(coin.price)}</span>
                  <span className="trending-item-count">
                    <FiBookmark size={11} style={{ marginRight: '0.15rem' }} />
                    {coin.count} {coin.count === 1 ? 'watch' : 'watches'}
                  </span>
                </div>
                <FiChevronRight className="trending-item-arrow" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TrendingBookmarks;
