import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiMinus, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { formatPrice, formatDate, getCoinInitials } from '../../utils/format';

function WatchlistTable({ bookmarks, onEdit, onDelete }) {
  const navigate = useNavigate();

  if (bookmarks.length === 0) {
    return (
      <div className="watchlist-table-empty">
        <p>No coins match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="watchlist-table-wrapper">
      <table className="watchlist-table-content">
        <thead>
          <tr>
            <th>Coin</th>
            <th>Symbol</th>
            <th>Added Price</th>
            <th>Current Price</th>
            <th>Change</th>
            <th>Category</th>
            <th>Notes</th>
            <th>Date Added</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookmarks.map((item) => {
            const initials = getCoinInitials(item.coinName, item.symbol);
            
            // Calculate change percentage since bookmarked
            const priceDiff = item.currentPrice - item.addedPrice;
            const changePercent = item.addedPrice > 0 ? (priceDiff / item.addedPrice) * 100 : 0;
            const changeClass = changePercent > 0 ? 'positive' : changePercent < 0 ? 'negative' : 'neutral';

            return (
              <tr key={item._id} className={item.isOptimistic ? 'watchlist-row-optimistic' : ''}>
                <td>
                  <div
                    className="watchlist-coin-identity"
                    onClick={() => navigate(`/coins/${item.coin}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="watchlist-coin-logo">{initials}</div>
                    <span className="watchlist-coin-name">{item.coinName || '—'}</span>
                  </div>
                </td>
                <td>
                  <span className="watchlist-coin-symbol">{item.symbol || '—'}</span>
                </td>
                <td className="watchlist-coin-price">
                  {formatPrice(item.addedPrice)}
                </td>
                <td className="watchlist-coin-price">
                  {formatPrice(item.currentPrice)}
                </td>
                <td>
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
                </td>
                <td>
                  <span className={`watchlist-category-badge ${item.category || 'watchlist'}`}>
                    {item.category === 'watchlist' ? 'Watchlist' : item.category}
                  </span>
                </td>
                <td>
                  <div className="watchlist-notes-cell" title={item.notes}>
                    {item.notes ? (
                      <span className="watchlist-notes-text">{item.notes}</span>
                    ) : (
                      <span className="watchlist-notes-empty">No notes added</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className="watchlist-date-added">{formatDate(item.createdAt)}</span>
                </td>
                <td>
                  <div className="watchlist-row-actions">
                    <button
                      className="watchlist-action-btn edit"
                      onClick={() => onEdit(item)}
                      title="Edit Category & Notes"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      className="watchlist-action-btn delete"
                      onClick={() => onDelete(item._id, item.coinName || item.symbol)}
                      title="Remove Bookmark"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default WatchlistTable;
