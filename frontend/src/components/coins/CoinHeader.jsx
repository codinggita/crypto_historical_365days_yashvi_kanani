import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiPlus, FiCheck, FiBookmark, FiArrowUpRight, FiArrowDownRight, FiMinus } from 'react-icons/fi';
import { formatPrice, formatPercent, getCoinInitials, getChangeClass } from '../../utils/format';
import watchlistService from '../../services/watchlist.service';
import { toast } from 'react-hot-toast';

function CoinHeader({ coin }) {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const coinId = coin._id || coin.id || coin.symbol;
  const symbol = coin.symbol || '—';
  const name = coin.name || '—';
  const price = coin.price ?? coin.close ?? coin.open ?? 0;
  const change = coin.change_24h ?? coin.daily_return ?? 0;
  const rank = coin.rank || '—';

  // Check watchlist status
  useEffect(() => {
    let active = true;
    const checkStatus = async () => {
      try {
        const statusRes = await watchlistService.checkBookmark(coinId);
        if (!active) return;
        
        const isFav = statusRes?.data?.bookmarked ?? statusRes?.bookmarked ?? false;
        setIsBookmarked(isFav);

        if (isFav) {
          // Fetch watchlist to find the bookmark _id for deletion
          const listRes = await watchlistService.getWatchlist();
          if (!active) return;
          const items = listRes?.data || [];
          const found = items.find((item) => item.coin === coin._id || item.symbol?.toLowerCase() === symbol.toLowerCase());
          if (found) {
            setBookmarkId(found._id);
          }
        }
      } catch (err) {
        console.error('Error checking bookmark status:', err);
      }
    };

    if (coinId) {
      checkStatus();
    }
    return () => {
      active = false;
    };
  }, [coinId, coin._id, symbol]);

  const handleWatchlistToggle = async () => {
    if (watchlistLoading) return;
    setWatchlistLoading(true);
    try {
      if (isBookmarked) {
        // If we have a bookmarkId, delete it. If not, fetch watchlist again to find it
        let idToDelete = bookmarkId;
        if (!idToDelete) {
          const listRes = await watchlistService.getWatchlist();
          const items = listRes?.data || [];
          const found = items.find((item) => item.coin === coin._id || item.symbol?.toLowerCase() === symbol.toLowerCase());
          if (found) {
            idToDelete = found._id;
          }
        }

        if (idToDelete) {
          await watchlistService.removeFromWatchlist(idToDelete);
          setIsBookmarked(false);
          setBookmarkId(null);
          toast.success(`${name} removed from watchlist`);
        } else {
          toast.error('Unable to locate watchlist item ID');
        }
      } else {
        const res = await watchlistService.addToWatchlist(coinId);
        const newBookmark = res?.data || res;
        setIsBookmarked(true);
        setBookmarkId(newBookmark?._id);
        toast.success(`${name} added to watchlist`);
      }
    } catch (err) {
      console.error('Watchlist toggle error:', err);
      toast.error(err?.response?.data?.message || err.message || 'Failed to update watchlist');
    } finally {
      setWatchlistLoading(false);
    }
  };

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
        <button
          id="watchlist-toggle-btn"
          className={`btn-watchlist-toggle${isBookmarked ? ' active' : ''}`}
          onClick={handleWatchlistToggle}
          disabled={watchlistLoading}
        >
          <FiBookmark />
          {isBookmarked ? 'Bookmarked' : 'Add to Watchlist'}
        </button>
      </div>
    </div>
  );
}

export default CoinHeader;
