import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FiX, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import watchlistService from '../../services/watchlist.service';
import { updateBookmarkOptimistic } from '../../redux/slices/watchlistSlice';

const PRESETS = ['Long Term', 'Short Term', 'Research', 'High Risk', 'Favorites'];

function BookmarkModal({ isOpen, onClose, bookmark }) {
  const dispatch = useDispatch();
  const [category, setCategory] = useState('watchlist');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (bookmark) {
      setNotes(bookmark.notes || '');
      const cat = bookmark.category || 'watchlist';
      if (PRESETS.includes(cat) || cat === 'watchlist') {
        setCategory(cat);
        setIsCustomCategory(false);
      } else {
        setCategory('custom');
        setCustomCategory(cat);
        setIsCustomCategory(true);
      }
    }
  }, [bookmark, isOpen]);

  if (!isOpen || !bookmark) return null;

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val);
    if (val === 'custom') {
      setIsCustomCategory(true);
    } else {
      setIsCustomCategory(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const finalCategory = isCustomCategory ? customCategory.trim() : category;
    const updatePayload = {
      category: finalCategory || 'watchlist',
      notes: notes.trim(),
    };

    const bookmarkId = bookmark._id;

    // 1. Optimistic Update
    dispatch(
      updateBookmarkOptimistic({
        id: bookmarkId,
        category: updatePayload.category,
        notes: updatePayload.notes,
      })
    );

    try {
      await watchlistService.updateBookmark(bookmarkId, updatePayload);
      toast.success(`Watchlist settings for ${bookmark.coinName} updated.`);
      onClose();
    } catch (err) {
      // Revert if API fails
      dispatch(
        updateBookmarkOptimistic({
          id: bookmarkId,
          category: bookmark.category,
          notes: bookmark.notes,
        })
      );
      toast.error(err?.response?.data?.message || err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="watchlist-modal-overlay" onClick={onClose}>
      <div className="watchlist-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="watchlist-modal-header">
          <h3>Edit Watchlist Settings: {bookmark.coinName}</h3>
          <button className="watchlist-modal-close" onClick={onClose} aria-label="Close modal">
            <FiX size={18} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="watchlist-modal-form">
          <div className="watchlist-modal-field">
            <label htmlFor="modal-category">Category</label>
            <select
              id="modal-category"
              value={category}
              onChange={handleCategoryChange}
              className="watchlist-modal-input"
            >
              <option value="watchlist">Watchlist (Default)</option>
              {PRESETS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
              <option value="custom">Custom Category...</option>
            </select>
          </div>

          {/* Custom Category Input */}
          {isCustomCategory && (
            <div className="watchlist-modal-field animate-slide-down">
              <label htmlFor="modal-custom-category">Custom Category Name</label>
              <input
                id="modal-custom-category"
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g. DeFi Bags, Memecoins"
                required
                maxLength={25}
                className="watchlist-modal-input"
              />
            </div>
          )}

          <div className="watchlist-modal-field">
            <label htmlFor="modal-notes">Personal Notes</label>
            <textarea
              id="modal-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your target prices, entry notes, or reasons for watching this coin..."
              rows={4}
              maxLength={250}
              className="watchlist-modal-textarea"
            />
            <span className="watchlist-modal-char-count">{notes.length}/250 characters</span>
          </div>

          {/* Footer Actions */}
          <div className="watchlist-modal-footer">
            <button
              type="button"
              className="watchlist-modal-btn cancel"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="watchlist-modal-btn submit" disabled={saving}>
              {saving ? 'Saving...' : (
                <>
                  <FiCheck /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookmarkModal;
