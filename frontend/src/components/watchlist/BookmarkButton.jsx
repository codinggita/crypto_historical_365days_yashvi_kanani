import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import watchlistService from '../../services/watchlist.service';
import {
  addBookmarkOptimistic,
  removeBookmarkOptimistic,
} from '../../redux/slices/watchlistSlice';

function BookmarkButton({ coin, showText = false, className = '' }) {
  const dispatch = useDispatch();
  const dispatchBookmarks = useSelector((state) => state.watchlist.bookmarks);
  const [loading, setLoading] = useState(false);
  const [localBookmarked, setLocalBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);

  const coinId = coin._id || coin.id || coin.coinId;
  const symbol = coin.symbol || '';
  const name = coin.name || coin.coinName || '';
  const price = coin.price || coin.addedPrice || coin.currentPrice || 0;

  // Sync state from Redux list or fallback to check bookmark status
  useEffect(() => {
    if (!coinId) return;

    // First check if it's already in our Redux bookmarks store
    const foundInRedux = dispatchBookmarks.find(
      (b) => b.coin === coinId || b.coinId === coinId || b.symbol?.toLowerCase() === symbol.toLowerCase()
    );

    if (foundInRedux) {
      setLocalBookmarked(true);
      setBookmarkId(foundInRedux._id);
    } else {
      // Standalone check from server if Redux isn't loaded/populated
      let active = true;
      const verifyStatus = async () => {
        try {
          const res = await watchlistService.checkBookmark(coinId);
          if (!active) return;
          const bookmarked = res?.data?.bookmarked ?? res?.bookmarked ?? false;
          setLocalBookmarked(bookmarked);

          if (bookmarked) {
            // Fetch watchlist to sync ID
            const listRes = await watchlistService.getWatchlist();
            if (!active) return;
            const items = listRes?.data || [];
            const found = items.find(
              (item) => item.coin === coinId || item.symbol?.toLowerCase() === symbol.toLowerCase()
            );
            if (found) {
              setBookmarkId(found._id);
            }
          }
        } catch (_) {}
      };

      verifyStatus();
      return () => {
        active = false;
      };
    }
  }, [coinId, symbol, dispatchBookmarks]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading || !coinId) return;

    setLoading(true);

    const prevBookmarked = localBookmarked;
    const prevBookmarkId = bookmarkId;

    // Prepare optimistic values
    const tempBookmark = {
      _id: prevBookmarkId || `temp-${Date.now()}`,
      coin: coinId,
      coinName: name,
      symbol: symbol,
      addedPrice: price,
      currentPrice: price,
      category: 'watchlist',
      notes: '',
    };

    // 1. Instant UI Update
    if (prevBookmarked) {
      setLocalBookmarked(false);
      setBookmarkId(null);
      dispatch(removeBookmarkOptimistic(coinId));
    } else {
      setLocalBookmarked(true);
      setBookmarkId(tempBookmark._id);
      dispatch(addBookmarkOptimistic(tempBookmark));
    }

    try {
      if (prevBookmarked) {
        // Remove bookmark
        let idToDelete = prevBookmarkId;
        if (!idToDelete) {
          const listRes = await watchlistService.getWatchlist();
          const items = listRes?.data || [];
          const found = items.find(
            (item) => item.coin === coinId || item.symbol?.toLowerCase() === symbol.toLowerCase()
          );
          idToDelete = found?._id;
        }

        if (idToDelete) {
          await watchlistService.removeFromWatchlist(idToDelete);
          toast.success(`${name || symbol} removed from watchlist`);
        } else {
          throw new Error('Bookmark reference not found');
        }
      } else {
        // Add bookmark
        const res = await watchlistService.addToWatchlist(coinId, {
          category: 'watchlist',
          notes: '',
        });
        const savedBookmark = res?.data || res;
        setBookmarkId(savedBookmark?._id);
        toast.success(`${name || symbol} added to watchlist`);
      }
    } catch (err) {
      // Revert on error
      setLocalBookmarked(prevBookmarked);
      setBookmarkId(prevBookmarkId);
      if (prevBookmarked) {
        dispatch(addBookmarkOptimistic(tempBookmark));
      } else {
        dispatch(removeBookmarkOptimistic(coinId));
      }

      console.error('Watchlist action failed:', err);
      toast.error(err?.response?.data?.message || err.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`bookmark-heart-btn ${localBookmarked ? 'active' : ''} ${className}`}
      title={localBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        transition: 'transform 0.15s ease',
      }}
    >
      <FiHeart
        size={18}
        fill={localBookmarked ? '#f43f5e' : 'none'}
        stroke={localBookmarked ? '#f43f5e' : 'currentColor'}
        style={{
          transition: 'fill 0.2s ease, stroke 0.2s ease, transform 0.1s ease',
          transform: loading ? 'scale(0.85)' : 'scale(1)',
        }}
      />
      {showText && (
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
          {localBookmarked ? 'Watched' : 'Watchlist'}
        </span>
      )}
    </button>
  );
}

export default BookmarkButton;
