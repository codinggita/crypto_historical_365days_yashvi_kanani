import React, { useState } from 'react';
import { coinService } from '../../services/coin.service';
import { toast } from 'react-hot-toast';
import '../../styles/portfolio.css';

export function InvestmentCalculator({ allCoins }) {
  const [coinId, setCoinId] = useState('');
  const [amount, setAmount] = useState('');
  const [historicalDate, setHistoricalDate] = useState('');
  const [results, setResults] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // Set default coin
  React.useEffect(() => {
    if (allCoins && allCoins.length > 0 && !coinId) {
      setCoinId(allCoins[0].coinId);
    }
  }, [allCoins, coinId]);

  const handleCalculate = async (e) => {
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
    if (!historicalDate) {
      toast.error('Select a historical date.');
      return;
    }

    setCalculating(true);
    try {
      // 1. Fetch coin history (increases efficiency to fetch up to limit=365)
      const historyRes = await coinService.getCoinHistory(coinId, { limit: 365 });
      const historyList = historyRes.history || [];

      if (historyList.length === 0) {
        toast.error('No historical data found for this coin.');
        setCalculating(false);
        return;
      }

      // 2. Find closest date match
      const targetDate = new Date(historicalDate);
      let closestRecord = historyList[0];
      let minDiff = Math.abs(new Date(closestRecord.timestamp) - targetDate);

      for (let i = 1; i < historyList.length; i++) {
        const currentDiff = Math.abs(new Date(historyList[i].timestamp) - targetDate);
        if (currentDiff < minDiff) {
          minDiff = currentDiff;
          closestRecord = historyList[i];
        }
      }

      // 3. Get current price
      const selectedCoin = allCoins.find((c) => c.coinId === coinId);
      const currentPrice = selectedCoin ? selectedCoin.price : closestRecord.price;

      // 4. Calculate metrics
      const historicalPrice = closestRecord.price;
      const tokensBought = amt / historicalPrice;
      const currentValue = tokensBought * currentPrice;
      const profitLoss = currentValue - amt;
      const roi = (profitLoss / amt) * 100;
      const growth = ((currentPrice - historicalPrice) / historicalPrice) * 100;

      setResults({
        coinName: selectedCoin?.name || closestRecord.name,
        symbol: selectedCoin?.symbol || closestRecord.symbol,
        historicalPrice,
        currentPrice,
        tokensBought,
        currentValue,
        profitLoss,
        roi,
        growth,
        matchedDate: new Date(closestRecord.timestamp).toLocaleDateString(),
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to calculate. Try selecting another coin or date.');
    } finally {
      setCalculating(false);
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
        <h2>Investment Calculator</h2>
      </div>

      <div className="calc-grid">
        <form onSubmit={handleCalculate} className="simulator-form">
          <div className="form-group">
            <label htmlFor="calc-coin-select">Select Asset</label>
            <select
              id="calc-coin-select"
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
            <label htmlFor="calc-amount">Investment Amount (USD)</label>
            <input
              id="calc-amount"
              type="number"
              className="form-input"
              placeholder="e.g. 1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="calc-date">Purchase Date (Historical)</label>
            <input
              id="calc-date"
              type="date"
              className="form-input"
              value={historicalDate}
              onChange={(e) => setHistoricalDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }} disabled={calculating}>
            {calculating ? 'Calculating...' : 'Calculate Growth'}
          </button>
        </form>

        <div className="results-panel">
          {results ? (
            <div className="results-grid">
              <div className="result-item" style={{ gridColumn: '1 / span 2' }}>
                <span className="result-label">Asset Simulated</span>
                <span className="result-value" style={{ color: 'var(--accent-primary)' }}>
                  {results.coinName} ({results.symbol})
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Purchase Price</span>
                <span className="result-value">{formatCurrency(results.historicalPrice)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Current Price</span>
                <span className="result-value">{formatCurrency(results.currentPrice)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Tokens Purchased</span>
                <span className="result-value">{results.tokensBought.toFixed(4)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Current Value</span>
                <span className="result-value">{formatCurrency(results.currentValue)}</span>
              </div>
              <div className="result-item" style={{ gridColumn: '1 / span 2', background: 'rgba(255,255,255,0.02)' }}>
                <span className="result-label">Net Return (Profit/Loss)</span>
                <span className={`result-value ${results.profitLoss >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {formatCurrency(results.profitLoss)} ({formatPercentage(results.roi)})
                </span>
              </div>
              <div style={{ gridColumn: '1 / span 2', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Calculations based on closest matched database record dated {results.matchedDate}.
              </div>
            </div>
          ) : (
            <div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Enter details and click Calculate to simulate investment performance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvestmentCalculator;
