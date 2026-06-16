import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPercent, FiAward } from 'react-icons/fi';
import '../../styles/portfolio.css';

export function PortfolioOverview({ summary }) {
  const {
    totalInvested = 0,
    totalCurrentValue = 0,
    totalProfitLoss = 0,
    bestPerformingCoin = null,
    worstPerformingCoin = null,
  } = summary || {};

  const totalROI = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;
  const isProfit = totalProfitLoss >= 0;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const formatPercentage = (val) => {
    const formatted = val.toFixed(2);
    return val >= 0 ? `+${formatted}%` : `${formatted}%`;
  };

  return (
    <div className="portfolio-overview-grid">
      {/* Total Invested */}
      <div className="overview-card">
        <div>
          <div className="card-label">Total Investment</div>
          <div className="card-value">{formatCurrency(totalInvested)}</div>
        </div>
        <div className="card-subtext text-neutral">
          <FiDollarSign /> Principal Capital
        </div>
      </div>

      {/* Current Value */}
      <div className="overview-card">
        <div>
          <div className="card-label">Current Value</div>
          <div className="card-value">{formatCurrency(totalCurrentValue)}</div>
        </div>
        <div className="card-subtext text-neutral">
          <FiDollarSign /> Live Market valuation
        </div>
      </div>

      {/* Total Profit/Loss */}
      <div className="overview-card">
        <div>
          <div className="card-label">Total Profit/Loss</div>
          <div className={`card-value ${isProfit ? 'text-profit' : 'text-loss'}`}>
            {formatCurrency(totalProfitLoss)}
          </div>
        </div>
        <div className={`card-subtext ${isProfit ? 'text-profit' : 'text-loss'}`}>
          {isProfit ? <FiTrendingUp /> : <FiTrendingDown />} {isProfit ? 'Net Gain' : 'Net Loss'}
        </div>
      </div>

      {/* ROI Percentage */}
      <div className="overview-card">
        <div>
          <div className="card-label">ROI Percentage</div>
          <div className={`card-value ${isProfit ? 'text-profit' : 'text-loss'}`}>
            {formatPercentage(totalROI)}
          </div>
        </div>
        <div className={`card-subtext ${isProfit ? 'text-profit' : 'text-loss'}`}>
          <FiPercent /> Rate of Return
        </div>
      </div>

      {/* Best Performing Coin */}
      <div className="overview-card">
        <div>
          <div className="card-label">Best Performing Coin</div>
          {bestPerformingCoin ? (
            <>
              <div className="card-value text-profit">
                {formatPercentage(bestPerformingCoin.profitLossPercentage)}
              </div>
              <div className="card-coin-info">
                <span className="card-coin-name">
                  {bestPerformingCoin.coinName} ({bestPerformingCoin.symbol})
                </span>
              </div>
            </>
          ) : (
            <div className="card-value text-neutral" style={{ fontSize: '1.1rem' }}>
              N/A
            </div>
          )}
        </div>
        <div className="card-subtext text-profit" style={{ marginTop: '0.25rem' }}>
          <FiAward /> Top Performer
        </div>
      </div>

      {/* Worst Performing Coin */}
      <div className="overview-card">
        <div>
          <div className="card-label">Worst Performing Coin</div>
          {worstPerformingCoin ? (
            <>
              <div className="card-value text-loss">
                {formatPercentage(worstPerformingCoin.profitLossPercentage)}
              </div>
              <div className="card-coin-info">
                <span className="card-coin-name">
                  {worstPerformingCoin.coinName} ({worstPerformingCoin.symbol})
                </span>
              </div>
            </>
          ) : (
            <div className="card-value text-neutral" style={{ fontSize: '1.1rem' }}>
              N/A
            </div>
          )}
        </div>
        <div className="card-subtext text-loss" style={{ marginTop: '0.25rem' }}>
          <FiAward /> Bottom Performer
        </div>
      </div>
    </div>
  );
}

export default PortfolioOverview;
