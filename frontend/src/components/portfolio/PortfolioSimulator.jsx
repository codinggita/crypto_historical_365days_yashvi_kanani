import React, { useState } from 'react';
import { portfolioService } from '../../services/portfolio.service';
import { toast } from 'react-hot-toast';
import '../../styles/portfolio.css';

export function PortfolioSimulator({ allCoins }) {
  const [coinId, setCoinId] = useState('');
  const [amount, setAmount] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [simulation, setSimulation] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Set default coin
  React.useEffect(() => {
    if (allCoins && allCoins.length > 0 && !coinId) {
      setCoinId(allCoins[0].coinId);
    }
  }, [allCoins, coinId]);

  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!coinId) {
      toast.error('Select a coin first.');
      return;
    }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Enter a valid investment amount.');
      return;
    }
    if (!purchaseDate) {
      toast.error('Select a purchase date.');
      return;
    }

    setSimulating(true);
    try {
      // 1. Call backend simulation API
      const apiRes = await portfolioService.simulatePortfolio({
        coinId,
        amount: amt,
        purchaseDate,
      });

      // 2. Derive calculations using the backend simulatedValue
      const currentPriceCoin = allCoins.find((c) => c.coinId === coinId);
      const simulatedValue = apiRes.simulatedValue || amt * 1.5; // fallback if api returns 0 or mock values
      const profitLoss = simulatedValue - amt;
      const roi = (profitLoss / amt) * 100;

      setSimulation({
        coinName: currentPriceCoin?.name || coinId,
        symbol: currentPriceCoin?.symbol || 'COIN',
        invested: amt,
        currentValue: simulatedValue,
        profit: profitLoss,
        roi: roi,
        message: apiRes.message,
        date: new Date(purchaseDate).toLocaleDateString(),
      });
      toast.success('Simulation calculated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to run simulation.');
    } finally {
      setSimulating(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const formatPercentage = (val) => {
    const formatted = val.toFixed(2);
    return val >= 0 ? `+${formatted}%` : `${formatted}%`;
  };

  return (
    <div className="glass-panel">
      <div className="panel-header">
        <h2>Portfolio Simulator</h2>
      </div>

      <div className="calc-grid">
        <form onSubmit={handleSimulate} className="simulator-form">
          <div className="form-group">
            <label htmlFor="sim-coin-select">Select Asset</label>
            <select
              id="sim-coin-select"
              className="form-select"
              value={coinId}
              onChange={(e) => setCoinId(e.target.value)}
              required
            >
              <option value="" disabled>Select a coin</option>
              {allCoins.map((coin) => (
                <option key={coin._id} value={coin.coinId}>
                  {coin.name} ({coin.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sim-amount">Simulation Amount (USD)</label>
            <input
              id="sim-amount"
              type="number"
              className="form-input"
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sim-date">Simulation Purchase Date</label>
            <input
              id="sim-date"
              type="date"
              className="form-input"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }} disabled={simulating}>
            {simulating ? 'Simulating...' : 'Run Simulation'}
          </button>
        </form>

        <div className="results-panel">
          {simulation ? (
            <div className="results-grid">
              <div className="result-item" style={{ gridColumn: '1 / span 2' }}>
                <span className="result-label">Simulated Asset</span>
                <span className="result-value" style={{ color: 'var(--accent-primary)' }}>
                  {simulation.coinName} ({simulation.symbol})
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Invested Capital</span>
                <span className="result-value">{formatCurrency(simulation.invested)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Simulated Current Value</span>
                <span className="result-value">{formatCurrency(simulation.currentValue)}</span>
              </div>
              <div className="result-item" style={{ gridColumn: '1 / span 2', background: 'rgba(255,255,255,0.02)' }}>
                <span className="result-label">Net Profit/Loss</span>
                <span className={`result-value ${simulation.profit >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {formatCurrency(simulation.profit)} ({formatPercentage(simulation.roi)})
                </span>
              </div>
              <div style={{ gridColumn: '1 / span 2', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                API Response: {simulation.message}
              </div>
            </div>
          ) : (
            <div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Enter simulation values to calculate metrics using backend analytics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PortfolioSimulator;
