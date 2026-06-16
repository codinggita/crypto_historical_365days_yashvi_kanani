import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiBookmark, FiRefreshCw, FiAlertTriangle, FiPlus } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

import watchlistService from '../../services/watchlist.service';
import {
  fetchStart,
  fetchFailure,
  setBookmarks,
  setAnalytics,
  setTrending,
  removeBookmarkOptimistic,
} from '../../redux/slices/watchlistSlice';

// Components
import AnalyticsCards from '../../components/watchlist/AnalyticsCards';
import WatchlistFilters from '../../components/watchlist/WatchlistFilters';
import WatchlistTable from '../../components/watchlist/WatchlistTable';
import WatchlistCard from '../../components/watchlist/WatchlistCard';
import TrendingBookmarks from '../../components/watchlist/TrendingBookmarks';
import BookmarkModal from '../../components/watchlist/BookmarkModal';
import WatchlistSkeleton from '../../components/watchlist/WatchlistSkeleton';

// Styles
import '../../styles/watchlist.css';

function Watchlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    bookmarks,
    bookmarkAnalytics,
    trendingBookmarks,
    loading,
    error,
    viewMode,
    filters,
    pagination,
  } = useSelector((state) => state.watchlist);

  // Local Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState(null);

  // Fetch all data
  const loadWatchlistData = useCallback(async () => {
    dispatch(fetchStart());
    try {
      // Build API query parameters for pagination, category, q/search, sorting
      const apiParams = {
        page: pagination.page,
        limit: 100, // Fetch a larger set to allow full client-side sub-filtering if needed
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc',
      };

      if (filters.category) {
        apiParams.category = filters.category;
      }
      if (filters.search) {
        apiParams.q = filters.search;
      }

      // Fetch analytics summary, trending lists, and watchlist items in parallel
      const [listRes, analyticsRes, trendingRes] = await Promise.allSettled([
        watchlistService.getWatchlist(apiParams),
        watchlistService.getBookmarkAnalytics(),
        watchlistService.getTrendingBookmarks(10),
      ]);

      let items = [];
      let meta = null;
      let analyticsData = null;
      let trendingData = [];

      // Extract list
      if (listRes.status === 'fulfilled') {
        const payload = listRes.value?.data || listRes.value;
        items = Array.isArray(payload) ? payload : payload?.items || [];
        meta = payload?.meta || null;
      } else {
        console.warn('Watchlist items fetch failed:', listRes.reason);
      }

      // Extract analytics
      if (analyticsRes.status === 'fulfilled') {
        analyticsData = analyticsRes.value?.data || analyticsRes.value;
      } else {
        console.warn('Watchlist analytics fetch failed:', analyticsRes.reason);
      }

      // Extract trending
      if (trendingRes.status === 'fulfilled') {
        trendingData = trendingRes.value?.data || trendingRes.value || [];
      } else {
        console.warn('Trending bookmarks fetch failed:', trendingRes.reason);
      }

      // Dispatch results to store
      dispatch(setBookmarks({ items, meta }));
      if (analyticsData) dispatch(setAnalytics(analyticsData));
      if (trendingData) dispatch(setTrending(trendingData));

      if (listRes.status === 'rejected') {
        throw new Error('Failed to load saved coins list');
      }
    } catch (err) {
      console.error('Core watchlist error:', err);
      dispatch(
        fetchFailure(
          err?.response?.data?.message || err.message || 'Failed to load watchlist details'
        )
      );
    }
  }, [dispatch, filters.category, filters.search, filters.sortBy, filters.sortOrder, pagination.page]);

  useEffect(() => {
    loadWatchlistData();
  }, [loadWatchlistData]);

  // Client-side Price Range & Symbol filters
  const filteredBookmarks = React.useMemo(() => {
    return bookmarks.filter((item) => {
      // Price range
      if (filters.minPrice && item.currentPrice < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && item.currentPrice > parseFloat(filters.maxPrice)) return false;

      // Quick symbol match
      if (
        filters.symbol &&
        !item.symbol?.toLowerCase().includes(filters.symbol.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [bookmarks, filters.minPrice, filters.maxPrice, filters.symbol]);

  // Open Notes/Category Modal
  const handleEditClick = (bookmark) => {
    setSelectedBookmark(bookmark);
    setModalOpen(true);
  };

  // Remove Bookmark with Optimistic update
  const handleDeleteClick = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from your watchlist?`)) {
      // Save state for revert
      const removedBookmark = bookmarks.find((b) => b._id === id);
      
      // 1. Optimistic Update
      dispatch(removeBookmarkOptimistic(id));
      toast.success(`${name} removed.`);

      try {
        await watchlistService.removeFromWatchlist(id);
      } catch (err) {
        // Revert on error
        if (removedBookmark) {
          dispatch(setBookmarks({ items: [removedBookmark, ...bookmarks] }));
        }
        toast.error(err?.response?.data?.message || err.message || 'Removal failed');
      }
    }
  };

  if (loading && bookmarks.length === 0) {
    return (
      <div style={{ marginTop: '1rem' }}>
        <div className="page-header">
          <h1 className="page-title">My Watchlist</h1>
          <p className="page-subtitle">Track, filter, and customize your favorite digital assets.</p>
        </div>
        <WatchlistSkeleton />
      </div>
    );
  }

  if (error && bookmarks.length === 0) {
    return (
      <div className="statistics-error-card">
        <FiAlertTriangle className="statistics-error-icon" />
        <h2 className="statistics-error-title">Failed to Load Watchlist</h2>
        <p className="statistics-error-msg">{error}</p>
        <button className="statistics-retry-btn" onClick={loadWatchlistData}>
          <FiRefreshCw style={{ marginRight: '0.4rem' }} /> Retry Connection
        </button>
      </div>
    );
  }

  const isWatchlistEmpty = bookmarks.length === 0;

  return (
    <div className="watchlist-page-container">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiBookmark style={{ color: '#6366f1' }} /> My Watchlist
          </h1>
          <p className="page-subtitle">Monitor price growth, categorize investments, and keep custom entry notes.</p>
        </div>
        <button
          onClick={() => navigate('/coins')}
          className="watchlist-empty-cta-btn"
          style={{ padding: '0.55rem 1.1rem', borderRadius: '8px' }}
        >
          <FiPlus /> Explore Cryptos
        </button>
      </div>

      {isWatchlistEmpty && !filters.category && !filters.search ? (
        /* Empty Watchlist UI State */
        <div className="watchlist-empty-state-card animate-slide-down">
          <div className="watchlist-empty-icon-wrapper">
            <FiBookmark />
          </div>
          <h3>Your Watchlist is Empty</h3>
          <p>Start tracking assets to analyze returns, category summaries, and entry alerts.</p>
          <button className="watchlist-empty-cta-btn" onClick={() => navigate('/coins')}>
            Add Your First Coin
          </button>
        </div>
      ) : (
        /* Active Watchlist Grid/Table */
        <div className="watchlist-page-grid">
          {/* Section 1: Overview Analytics Cards */}
          <AnalyticsCards analytics={bookmarkAnalytics} trending={trendingBookmarks} />

          {/* Filters Panel */}
          <WatchlistFilters />

          {/* Section 2: Table / Grid View of Saved Coins */}
          <div className="watchlist-table-card-wrapper">
            {viewMode === 'table' ? (
              <WatchlistTable
                bookmarks={filteredBookmarks}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ) : (
              <WatchlistCard
                bookmarks={filteredBookmarks}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            )}
          </div>

          {/* Section 3: Global Trending Coins */}
          <div className="trending-layout-wrapper">
            <TrendingBookmarks trending={trendingBookmarks} />
          </div>
        </div>
      )}

      {/* Edit Category & Notes Modal */}
      <BookmarkModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedBookmark(null);
        }}
        bookmark={selectedBookmark}
      />
    </div>
  );
}

export default Watchlist;
