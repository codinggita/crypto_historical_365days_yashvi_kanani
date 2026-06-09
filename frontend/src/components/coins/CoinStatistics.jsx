import React from 'react';
import { FiDollarSign, FiActivity, FiLayers, FiTrendingUp } from 'react-icons/fi';
import { formatCurrency, formatLargeNumber, formatNumber } from '../../utils/format';

function CoinStatistics({ coin, history }) {
  // Compute metrics from history
  const stats = React.useMemo(() => {
    if (!Array.isArray(history) || history.length === 0) {
      return {
        priceHigh: coin?.price ?? 0,
        priceLow: coin?.price ?? 0,
        priceAvg: coin?.price ?? 0,
        volHigh: coin?.volume ?? 0,
        volLow: coin?.volume ?? 0,
        volAvg: coin?.volume ?? 0,
        mcapHigh: coin?.marketCap ?? 0,
        mcapLow: coin?.marketCap ?? 0,
      };
    }

    let pMin = Infinity, pMax = -Infinity, pSum = 0;
    let vMin = Infinity, vMax = -Infinity, vSum = 0;
    let mMin = Infinity, mMax = -Infinity;

    history.forEach((h) => {
      const p = h.price ?? h.close ?? h.open ?? 0;
      const v = h.volume ?? h.volume_24h ?? 0;
      const m = h.marketCap ?? h.market_cap ?? 0;

      if (p < pMin) pMin = p;
      if (p > pMax) pMax = p;
      pSum += p;

      if (v < vMin) vMin = v;
      if (v > vMax) vMax = v;
      vSum += v;

      if (m < mMin) mMin = m;
      if (m > mMax) mMax = m;
    });

    return {
      priceHigh: pMax,
      priceLow: pMin,
      priceAvg: pSum / history.length,
      volHigh: vMax,
      volLow: vMin,
      volAvg: vSum / history.length,
      mcapHigh: mMax,
      mcapLow: mMin,
    };
  }, [history, coin]);

  const circSupply = coin?.circulatingSupply ?? 0;
  const totalSupply = coin?.totalSupply ?? 0;
  const maxSupply = coin?.maxSupply ?? 0;

  return (
    <div className="details-stats-layout">
      {/* Price & Vol stats */}
      <div className="stats-card-box">
        <h3 className="details-section-title" style={{ marginBottom: '0.5rem' }}>
          <FiDollarSign style={{ color: '#818cf8' }} /> Price & Volume Statistics
        </h3>
        <div className="stats-table">
          <div className="stats-row">
            <span className="stats-label">Timeline High Price</span>
            <span className="stats-value">{formatCurrency(stats.priceHigh, stats.priceHigh < 1 ? 5 : 2)}</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Timeline Low Price</span>
            <span className="stats-value">{formatCurrency(stats.priceLow, stats.priceLow < 1 ? 5 : 2)}</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Timeline Average Price</span>
            <span className="stats-value">{formatCurrency(stats.priceAvg, stats.priceAvg < 1 ? 5 : 2)}</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Timeline High Volume</span>
            <span className="stats-value">{formatLargeNumber(stats.volHigh)}</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Timeline Low Volume</span>
            <span className="stats-value">{formatLargeNumber(stats.volLow)}</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Timeline Average Volume</span>
            <span className="stats-value">{formatLargeNumber(stats.volAvg)}</span>
          </div>
        </div>
      </div>

      {/* Cap & Supply stats */}
      <div className="stats-card-box">
        <h3 className="details-section-title" style={{ marginBottom: '0.5rem' }}>
          <FiLayers style={{ color: '#818cf8' }} /> Supply & Cap Summary
        </h3>
        <div className="stats-table">
          <div className="stats-row">
            <span className="stats-label">Peak Market Cap</span>
            <span className="stats-value">{formatLargeNumber(stats.mcapHigh)}</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Lowest Market Cap</span>
            <span className="stats-value">{formatLargeNumber(stats.mcapLow)}</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Circulating Supply</span>
            <span className="stats-value">
              {circSupply > 0 ? `${formatNumber(circSupply)} ${coin?.symbol || ''}` : '—'}
            </span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Total Supply</span>
            <span className="stats-value">
              {totalSupply > 0 ? `${formatNumber(totalSupply)} ${coin?.symbol || ''}` : '—'}
            </span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Max Supply</span>
            <span className="stats-value">
              {maxSupply > 0 ? `${formatNumber(maxSupply)} ${coin?.symbol || ''}` : 'Infinity'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoinStatistics;
