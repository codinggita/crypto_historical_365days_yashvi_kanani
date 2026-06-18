import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiBriefcase, FiRefreshCw, FiX } from 'react-icons/fi';
import portfolioService from '../../services/portfolio.service';
import coinService from '../../services/coin.service';
import {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  resetPortfolioState,
} from '../../redux/slices/portfolioSlice';

import PortfolioOverview from '../../components/portfolio/PortfolioOverview';
import PortfolioTable from '../../components/portfolio/PortfolioTable';
import PortfolioAllocation from '../../components/portfolio/PortfolioAllocation';
import PortfolioCharts from '../../components/portfolio/PortfolioCharts';
import InvestmentCalculator from '../../components/portfolio/InvestmentCalculator';
import PortfolioSimulator from '../../components/portfolio/PortfolioSimulator';
import RecommendationsPanel from '../../components/portfolio/RecommendationsPanel';
import PortfolioSkeleton from '../../components/portfolio/PortfolioSkeleton';

import '../../styles/portfolio.css';

export function Portfolio() {
  const dispatch = useDispatch();
  const { portfolio, holdings, recommendations, loading, error } = useSelector(
    (state) => state.portfolio
  );

  const [allCoins, setAllCoins] = useState([]);
  const [allocation, setAllocation] = useState([]);
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [isFirstAddOpen, setIsFirstAddOpen] = useState(false);

  // Form states for first add modal
  const [selectedCoinId, setSelectedCoinId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  // Ensure allCoins is an array
  const safeAllCoins = Array.isArray(allCoins) ? allCoins : [];

  const loadData = useCallback(async () => {
    dispatch(fetchStart());
    try {
      const [
        holdingsRes,
        summaryRes,
        distRes,
        historyRes,
        coinsRes,
        recsRes,
      ] = await Promise.allSettled([
        portfolioService.getPortfolios({ limit: 100 }),
        portfolioService.getPortfolioSummary(),
        portfolioService.getPortfolioDistribution(),
        portfolioService.getPortfolioHistory(),
        coinService.getCoins({ limit: 100 }),
        portfolioService.getRecommendations(),
      ]);

      const holdingsData = holdingsRes.status === 'fulfilled' ? holdingsRes.value.items : [];
      const summaryData = summaryRes.status === 'fulfilled' ? summaryRes.value : null;
      const distData = distRes.status === 'fulfilled' ? distRes.value : [];
      const historyData = historyRes.status === 'fulfilled' ? historyRes.value : [];
      const coinsData = coinsRes.status === 'fulfilled' ? coinsRes.value.coins : [];
      const recsData = recsRes.status === 'fulfilled' ? recsRes.value : [];

      setAllCoins(coinsData);
      setAllocation(distData);
      setPerformanceHistory(historyData);

      dispatch(
        fetchSuccess({
          portfolio: summaryData,
          holdings: holdingsData,
          recommendations: recsData,
        })
      );
    } catch (err) {
      console.error(err);
      dispatch(fetchFailure('Failed to load portfolio details.'));
    }
  }, [dispatch]);

  useEffect(() => {
    loadData();
    return () => {
      dispatch(resetPortfolioState());
    };
  }, [loadData, dispatch]);

  const handleAddHolding = async (data) => {
    try {
      await portfolioService.addPortfolioItem(data);
      toast.success('Asset added successfully!');
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to add asset.');
    }
  };

  const handleUpdateHolding = async (id, data) => {
    try {
      await portfolioService.updatePortfolioItem(id, data);
      toast.success('Holdings updated successfully!');
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update holdings.');
    }
  };

  const handleDeleteHolding = async (id) => {
    try {
      await portfolioService.deletePortfolioItem(id);
      toast.success('Asset removed from portfolio.');
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to remove asset.');
    }
  };

  const handleFirstAddOpen = () => {
    if (safeAllCoins.length > 0) {
      setSelectedCoinId(safeAllCoins[0].coinId);
      setBuyPrice(safeAllCoins[0].price.toString());
    }
    setQuantity('');
    setIsFirstAddOpen(true);
  };

  const handleFirstAddSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCoinId) {
      toast.error('Select a coin first.');
      return;
    }
    const qVal = parseFloat(quantity);
    if (isNaN(qVal) || qVal <= 0) {
      toast.error('Enter a valid quantity.');
      return;
    }
    const pVal = parseFloat(buyPrice);
    if (isNaN(pVal) || pVal < 0) {
      toast.error('Enter a valid price.');
      return;
    }

    await handleAddHolding({
      coinId: selectedCoinId,
      quantity: qVal,
      buyPrice: pVal,
    });
    setIsFirstAddOpen(false);
  };

  if (loading) {
    return <PortfolioSkeleton />;
  }

  if (error) {
    return (
      <div className="error-state">
        <FiRefreshCw className="error-state-icon" />
        <h3>Failed to load Portfolio</h3>
        <p>{error}</p>
        <button className="btn-primary" onClick={loadData}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      {/* Header */}
      <div className="portfolio-header">
        <div className="portfolio-title-block">
          <h1>Asset Portfolio Simulator</h1>
          <p className="portfolio-subtitle">
            Simulate cryptocurrency investments, analyze historical profits, and track portfolio asset allocations.
          </p>
        </div>
      </div>

      {holdings.length === 0 ? (
        // Empty State
        <div className="empty-state">
          <FiBriefcase className="empty-state-icon" />
          <h3>No Portfolio Created</h3>
          <p>
            Start tracking your assets, analyze percentage allocations, and simulate investment growth.
          </p>
          <button className="btn-primary" onClick={handleFirstAddOpen}>
            Create Your First Portfolio
          </button>
        </div>
      ) : (
        // Active Dashboard
        <>
          <PortfolioOverview summary={portfolio} />

          <div className="portfolio-content-row">
            {/* Left Column: Holdings table & performance charts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <PortfolioCharts history={performanceHistory} />
              <PortfolioTable
                holdings={holdings}
                allCoins={allCoins}
                onAddHolding={handleAddHolding}
                onUpdateHolding={handleUpdateHolding}
                onDeleteHolding={handleDeleteHolding}
              />
            </div>

            {/* Right Column: Allocation and Recommendations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <PortfolioAllocation distribution={allocation} />
              <RecommendationsPanel recommendations={recommendations} />
            </div>
          </div>
        </>
      )}

      {/* Simulator Tools Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
        <InvestmentCalculator allCoins={allCoins} />
        <PortfolioSimulator allCoins={allCoins} />
      </div>

      {/* First Add Modal */}
      {isFirstAddOpen && (
        <div className="modal-overlay" onClick={() => setIsFirstAddOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Your First Portfolio</h3>
              <button className="modal-close-btn" onClick={() => setIsFirstAddOpen(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleFirstAddSubmit} className="simulator-form">
              <div className="form-group">
                <label htmlFor="first-coin-select">Select Asset</label>
                <select
                  id="first-coin-select"
                  className="form-select"
                  value={selectedCoinId}
                  onChange={(e) => {
                    const cid = e.target.value;
                    setSelectedCoinId(cid);
                    const coin = safeAllCoins.find((c) => c.coinId === cid);
                    if (coin) setBuyPrice(coin.price.toString());
                  }}
                  required
                >
                  {safeAllCoins.map((coin) => (
                    <option key={coin._id} value={coin.coinId}>
                      {coin.name} ({coin.symbol})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="first-quantity">Quantity</label>
                <input
                  id="first-quantity"
                  type="number"
                  step="any"
                  className="form-input"
                  placeholder="e.g. 1.25"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="first-buy-price">Buy Price (USD)</label>
                <input
                  id="first-buy-price"
                  type="number"
                  step="any"
                  className="form-input"
                  placeholder="e.g. 3500"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsFirstAddOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
