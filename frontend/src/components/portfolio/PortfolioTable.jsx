import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import '../../styles/portfolio.css';

export function PortfolioTable({
  holdings,
  allCoins,
  onAddHolding,
  onUpdateHolding,
  onDeleteHolding,
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [selectedCoinId, setSelectedCoinId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const [activeHolding, setActiveHolding] = useState(null);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(val);
  };

  const formatPercentage = (val) => {
    const formatted = val.toFixed(2);
    return val >= 0 ? `+${formatted}%` : `${formatted}%`;
  };

  // Open add modal
  const handleOpenAddModal = () => {
    setSelectedCoinId(allCoins[0]?.coinId || '');
    setQuantity('');
    // Auto-fill buy price with current coin price if available
    const initialCoin = allCoins[0];
    setBuyPrice(initialCoin ? initialCoin.price.toString() : '');
    setIsAddModalOpen(true);
  };

  const handleCoinChange = (e) => {
    const coinId = e.target.value;
    setSelectedCoinId(coinId);
    const coin = allCoins.find((c) => c.coinId === coinId);
    if (coin) {
      setBuyPrice(coin.price.toString());
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!selectedCoinId) {
      toast.error('Please select a coin');
      return;
    }
    const qVal = parseFloat(quantity);
    if (isNaN(qVal) || qVal <= 0) {
      toast.error('Quantity must be a positive number');
      return;
    }
    const pVal = parseFloat(buyPrice);
    if (isNaN(pVal) || pVal < 0) {
      toast.error('Buy price cannot be negative');
      return;
    }

    onAddHolding({
      coinId: selectedCoinId,
      quantity: qVal,
      buyPrice: pVal,
    });
    setIsAddModalOpen(false);
  };

  // Open edit modal
  const handleOpenEditModal = (holding) => {
    setActiveHolding(holding);
    setQuantity(holding.quantity.toString());
    setBuyPrice(holding.buyPrice.toString());
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const qVal = parseFloat(quantity);
    if (isNaN(qVal) || qVal <= 0) {
      toast.error('Quantity must be a positive number');
      return;
    }
    const pVal = parseFloat(buyPrice);
    if (isNaN(pVal) || pVal < 0) {
      toast.error('Buy price cannot be negative');
      return;
    }

    onUpdateHolding(activeHolding._id, {
      quantity: qVal,
      buyPrice: pVal,
    });
    setIsEditModalOpen(false);
  };

  // Open delete modal
  const handleOpenDeleteModal = (holding) => {
    setActiveHolding(holding);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDeleteHolding(activeHolding._id);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="glass-panel" style={{ width: '100%' }}>
      <div className="panel-header">
        <h2>Holdings Portfolio</h2>
        <button className="btn-primary" onClick={handleOpenAddModal}>
          <FiPlus /> Add Asset
        </button>
      </div>

      {holdings.length === 0 ? (
        <div className="empty-state" style={{ border: 'none', padding: '2rem 0' }}>
          <p>No holdings added yet. Click 'Add Asset' to start your portfolio.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="portfolio-table" aria-label="Holdings details">
            <thead>
              <tr>
                <th scope="col">Coin</th>
                <th scope="col">Quantity</th>
                <th scope="col">Buy Price</th>
                <th scope="col">Current Price</th>
                <th scope="col">Investment</th>
                <th scope="col">Current Value</th>
                <th scope="col">Profit/Loss</th>
                <th scope="col">ROI %</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => {
                const isProfit = holding.profitLoss >= 0;
                return (
                  <tr key={holding._id}>
                    <td>
                      <div className="coin-cell">
                        <div className="coin-icon-placeholder">
                          {typeof holding.symbol === 'string' ? holding.symbol.slice(0, 3) : '???'}
                        </div>
                        <div className="coin-info">
                          <span className="coin-name-display">{holding.coinName}</span>
                          <span className="coin-symbol-display">{holding.symbol}</span>
                        </div>
                      </div>
                    </td>
                    <td>{holding.quantity}</td>
                    <td>{formatCurrency(holding.buyPrice)}</td>
                    <td>{formatCurrency(holding.currentPrice)}</td>
                    <td>{formatCurrency(holding.investedAmount)}</td>
                    <td>{formatCurrency(holding.currentValue)}</td>
                    <td className={isProfit ? 'text-profit' : 'text-loss'}>
                      {formatCurrency(holding.profitLoss)}
                    </td>
                    <td className={isProfit ? 'text-profit' : 'text-loss'}>
                      {formatPercentage(holding.profitLossPercentage)}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-icon"
                          onClick={() => handleOpenEditModal(holding)}
                          aria-label={`Edit ${holding.coinName} holdings`}
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          className="btn-icon delete-btn"
                          onClick={() => handleOpenDeleteModal(holding)}
                          aria-label={`Remove ${holding.coinName} holdings`}
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
      )}

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Asset to Portfolio</h3>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="simulator-form">
              <div className="form-group">
                <label htmlFor="add-coin-select">Select Cryptocurrency</label>
                <select
                  id="add-coin-select"
                  className="form-select"
                  value={selectedCoinId}
                  onChange={handleCoinChange}
                >
                  {allCoins.map((coin) => (
                    <option key={coin._id} value={coin.coinId}>
                      {coin.name} ({coin.symbol})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="add-quantity">Quantity</label>
                <input
                  id="add-quantity"
                  type="number"
                  step="any"
                  className="form-input"
                  placeholder="e.g. 0.5"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="add-buy-price">Buy Price (USD)</label>
                <input
                  id="add-buy-price"
                  type="number"
                  step="any"
                  className="form-input"
                  placeholder="e.g. 64000"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && activeHolding && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Holdings</h3>
              <button className="modal-close-btn" onClick={() => setIsEditModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="simulator-form">
              <div className="form-group">
                <label>Coin</label>
                <input
                  type="text"
                  className="form-input"
                  value={`${activeHolding.coinName} (${activeHolding.symbol})`}
                  disabled
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-quantity">Quantity</label>
                <input
                  id="edit-quantity"
                  type="number"
                  step="any"
                  className="form-input"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-buy-price">Buy Price (USD)</label>
                <input
                  id="edit-buy-price"
                  type="number"
                  step="any"
                  className="form-input"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && activeHolding && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Remove Asset</h3>
              <button className="modal-close-btn" onClick={() => setIsDeleteModalOpen(false)}>
                <FiX />
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>
              Are you sure you want to remove all holdings of{' '}
              <strong>
                {activeHolding.coinName} ({activeHolding.symbol})
              </strong>{' '}
              from your portfolio? This action cannot be undone.
            </p>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                style={{ backgroundColor: '#ef4444', boxShadow: 'none' }}
                onClick={handleDeleteConfirm}
              >
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioTable;
