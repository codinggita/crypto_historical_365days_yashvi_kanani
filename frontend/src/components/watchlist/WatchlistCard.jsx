import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiCalendar, FiArrowUpRight, FiArrowDownRight, FiMinus } from 'react-icons/fi';
import { formatPrice, formatDate, getCoinInitials } from '../../utils/format';

function WatchlistCard({ bookmarks, onEdit, onDelete }) {
  const navigate = useNavigate();

  if (bookmarks.length === 0) {
    return (
      <div className="watchlist-grid-empty">
        <p>No coins match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="watchlist-grid-layout">
      {bookmarks.map((item) => {
        const initials = getCoinInitials(item.coinName, item.symbol);
        
        // Calculate change percentage since bookmarked
        const priceDiff = item.currentPrice - item.addedPrice;
        const changePercent = item.addedPrice > 0 ? (priceDiff / item.addedPrice) * 100 : 0;
        const changeClass = changePercent > 0 ? 'positive' : changePercent < 0 ? 'negative' : 'neutral';

        return (
          <div
            key={item._id}
            className={`watchlist-coin-card ${item.isOptimistic ? 'watchlist-card-optimistic' : ''}`}
          >
            {/* Top row: Identity & Badge */}
            <div className="watchlist-card-top-row">
              <div
                className="watchlist-card-identity"
                onClick={() => navigate(`/coins/${item.coin}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="watchlist-card-logo">{initials}</div>
                <div>
                  <h4 className="watchlist-card-name">{item.coinName || '—'}</h4>
                  <span className="watchlist-card-symbol">{item.symbol || '—'}</span>
                </div>
              </div>
              <span className={`watchlist-category-badge ${item.category || 'watchlist'}`}>
                {item.category === 'watchlist' ? 'Watchlist' : item.category}
              </span>
            </div>

            {/* Price values */}
            <div className="watchlist-card-prices">
              <div className="watchlist-card-price-item">
                <span className="watchlist-card-price-label">Added Price</span>
                <span className="watchlist-card-price-value">{formatPrice(item.addedPrice)}</span>
              </div>
              <div className="watchlist-card-price-item">
                <span className="watchlist-card-price-label">Current Price</span>
                <span className="watchlist-card-price-value">{formatPrice(item.currentPrice)}</span>
              </div>
            </div>

            {/* Change since bookmarked */}
            <div className="watchlist-card-growth">
              <span className="watchlist-card-price-label">Return since Saved</span>
              <span className={`watchlist-price-change ${changeClass}`}>
                {changeClass === 'positive' ? (
                  <FiArrowUpRight />
                ) : changeClass === 'negative' ? (
                  <FiArrowDownRight />
                ) : (
                  <FiMinus />
                )}
                {Math.abs(changePercent).toFixed(2)}%
              </span>
            </div>

            {/* Notes Section */}
            <div className="watchlist-card-notes">
              <span className="watchlist-card-notes-label">Notes</span>
              {item.notes ? (
                <p className="watchlist-card-notes-text">{item.notes}</p>
              ) : (
                <p className="watchlist-card-notes-empty">No notes added.</p>
              )}
            </div>

            {/* Bottom Row: Date & Actions */}
            <div className="watchlist-card-footer">
              <div className="watchlist-card-date">
                <FiCalendar size={12} style={{ marginRight: '0.25rem' }} />
                <span>{formatDate(item.createdAt)}</span>
              </div>
              <div className="watchlist-card-actions">
                <button
                  className="watchlist-action-btn edit"
                  onClick={() => onEdit(item)}
                  title="Edit Category & Notes"
                >
                  <FiEdit2 size={13} />
                </button>
                <button
                  className="watchlist-action-btn delete"
                  onClick={() => onDelete(item._id, item.coinName || item.symbol)}
                  title="Remove Bookmark"
                >
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default WatchlistCard;
