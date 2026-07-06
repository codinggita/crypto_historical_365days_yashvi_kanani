import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiAlertTriangle, FiRefreshCw, FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi';
import {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  setSelectedRange,
} from '../../redux/slices/analyticsSlice';
import { analyticsService } from '../../services/analytics.service';

// Components
import AnalyticsSkeleton  from '../../components/analytics/AnalyticsSkeleton';
import AnalyticsOverview  from '../../components/analytics/AnalyticsOverview';
import MarketTrendChart   from '../../components/analytics/MarketTrendChart';
import VolumeAnalytics    from '../../components/analytics/VolumeAnalytics';
import ReturnsAnalytics   from '../../components/analytics/ReturnsAnalytics';
import VolatilityAnalytics from '../../components/analytics/VolatilityAnalytics';
import MarketInsights     from '../../components/analytics/MarketInsights';
import LeaderboardTables  from '../../components/analytics/LeaderboardTables';

import '../../styles/analytics.css';

const RANGE_OPTIONS = [
  { label: '7D',   value: '7' },
  { label: '30D',  value: '30' },
  { label: '90D',  value: '90' },
  { label: '180D', value: '180' },
  { label: '365D', value: '365' },
  { label: 'All',  value: 'all' },
];

function Analytics() {
  const dispatch = useDispatch();
  const { analyticsData, loading, error, selectedRange } = useSelector((s) => s.analytics);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAll = useCallback(async () => {
    dispatch(fetchStart());
    try {
      const [
        highestPrice,
        lowestPrice,
        averagePrice,
        priceTrend,
        priceGrowth,
        priceDrop,
        highestVolume,
        lowestVolume,
        averageVolume,
        volumeSpike,
        topReturns,
        negativeReturns,
        cumulativeReturns,
        highVolatility,
        statsMarketSummary,
        statsTopGainers,
        statsTopLosers,
      ] = await Promise.allSettled([
        analyticsService.getHighestPrice(),
        analyticsService.getLowestPrice(),
        analyticsService.getAveragePrice(),
        analyticsService.getPriceTrend(),
        analyticsService.getPriceGrowth(),
        analyticsService.getPriceDrop(),
        analyticsService.getHighestVolume(),
        analyticsService.getLowestVolume(),
        analyticsService.getAverageVolume(),
        analyticsService.getVolumeSpike(),
        analyticsService.getTopReturns(),
        analyticsService.getNegativeReturns(),
        analyticsService.getCumulativeReturns(),
        analyticsService.getHighVolatility(),
        analyticsService.getStatsMarketSummary(),
        analyticsService.getStatsTopGainers({ limit: 15 }),
        analyticsService.getStatsTopLosers({ limit: 15 }),
      ]);

      const resolved = (r) => (r.status === 'fulfilled' ? r.value : null);

      dispatch(
        fetchSuccess({
          analyticsData: {
            highestPrice:     resolved(highestPrice),
            lowestPrice:      resolved(lowestPrice),
            averagePrice:     resolved(averagePrice),
            priceTrend:       resolved(priceTrend),
            priceGrowth:      resolved(priceGrowth),
            priceDrop:        resolved(priceDrop),
            highestVolume:    resolved(highestVolume),
            lowestVolume:     resolved(lowestVolume),
            averageVolume:    resolved(averageVolume),
            volumeSpike:      resolved(volumeSpike),
            topReturns:       resolved(topReturns),
            negativeReturns:  resolved(negativeReturns),
            cumulativeReturns:resolved(cumulativeReturns),
            highVolatility:   resolved(highVolatility),
          },
          marketSummary: resolved(statsMarketSummary),
          topGainers:    resolved(statsTopGainers),
          topLosers:     resolved(statsTopLosers),
        })
      );
      setLastUpdated(new Date());
    } catch (err) {
      dispatch(fetchFailure(err?.message ?? 'Failed to load analytics data'));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /* ── Loading ── */
  if (loading && !analyticsData) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Market Analytics</h1>
          <p className="page-subtitle">Loading market intelligence data…</p>
        </div>
        <AnalyticsSkeleton />
      </div>
    );
  }

  /* ── Error ── */
  if (error && !analyticsData) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Market Analytics</h1>
        </div>
        <div className="analytics-error-card">
          <div className="analytics-error-icon"><FiAlertTriangle /></div>
          <h3 className="analytics-error-title">Failed to load analytics</h3>
          <p className="analytics-error-msg">{error}</p>
          <button className="analytics-retry-btn" onClick={fetchAll}>
            <FiRefreshCw style={{ marginRight: '0.4rem' }} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const d = analyticsData ?? {};

  // Extract cumulative summary for market sentiment bar
  const cumData = d.cumulativeReturns?.data ?? {};
  const avgReturn = cumData?.averageDailyReturn ?? 0;
  const bullish   = cumData?.bullishCoins ?? 0;
  const bearish   = cumData?.bearishCoins ?? 0;
  const isBullish = avgReturn >= 0;

  const overviewData = {
    highestPrice:   d.highestPrice,
    lowestPrice:    d.lowestPrice,
    averagePrice:   d.averagePrice,
    highestVolume:  d.highestVolume,
    topReturn:      d.topReturns,
    highVolatility: d.highVolatility,
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1 className="page-title">Market Analytics</h1>
            <p className="page-subtitle">
              Real-time crypto intelligence — prices, volumes, returns &amp; risk metrics
            </p>
          </div>
          {lastUpdated && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Market Sentiment Strip */}
      <div className="analytics-sentiment-strip">
        <div className="sentiment-item">
          <span className="sentiment-label">Market Sentiment</span>
          <span className={`sentiment-value ${isBullish ? 'bullish' : 'bearish'}`}>
            {isBullish ? <FiTrendingUp /> : <FiTrendingDown />}
            {isBullish ? ' Bullish' : ' Bearish'}
          </span>
        </div>
        <div className="sentiment-divider" />
        <div className="sentiment-item">
          <span className="sentiment-label">Avg Daily Return</span>
          <span className={`sentiment-value ${avgReturn >= 0 ? 'bullish' : 'bearish'}`}>
            {avgReturn >= 0 ? '+' : ''}{parseFloat(avgReturn).toFixed(2)}%
          </span>
        </div>
        <div className="sentiment-divider" />
        <div className="sentiment-item">
          <FiTrendingUp style={{ color: '#10b981', fontSize: '0.9rem' }} />
          <span className="sentiment-label">Bullish</span>
          <span className="sentiment-value bullish">{bullish.toLocaleString()}</span>
        </div>
        <div className="sentiment-item">
          <FiTrendingDown style={{ color: '#ef4444', fontSize: '0.9rem' }} />
          <span className="sentiment-label">Bearish</span>
          <span className="sentiment-value bearish">{bearish.toLocaleString()}</span>
        </div>
        <div className="sentiment-divider" />
        <div className="sentiment-item">
          <span className="sentiment-label">Est. Monthly</span>
          <span className={`sentiment-value ${(avgReturn * 30) >= 0 ? 'bullish' : 'bearish'}`}>
            {(avgReturn * 30) >= 0 ? '+' : ''}{(parseFloat(avgReturn) * 30).toFixed(1)}%
          </span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button className="analytics-refresh-btn" onClick={fetchAll} title="Refresh all data">
            <FiRefreshCw style={{ marginRight: '0.35rem' }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="analytics-range-bar">
        <span className="analytics-range-label">Range:</span>
        {RANGE_OPTIONS.map((r) => (
          <button
            key={r.value}
            className={`range-btn ${selectedRange === r.value ? 'active' : ''}`}
            onClick={() => dispatch(setSelectedRange(r.value))}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Section 1: Overview Cards */}
      <AnalyticsOverview data={overviewData} />

      {/* Section 2: Market Trend Charts */}
      <MarketTrendChart
        priceTrend={d.priceTrend}
        priceGrowth={d.priceGrowth}
        priceDrop={d.priceDrop}
      />

      {/* Section 3: Top Gainers & Losers Leaderboard */}
      <LeaderboardTables
        topGainers={d.topReturns}
        topLosers={d.negativeReturns}
      />

      {/* Section 4: Volume Analytics */}
      <VolumeAnalytics
        highestVolume={d.highestVolume}
        lowestVolume={d.lowestVolume}
        averageVolume={d.averageVolume}
        volumeSpike={d.volumeSpike}
      />

      {/* Section 5: Returns Analytics */}
      <ReturnsAnalytics
        topReturns={d.topReturns}
        negativeReturns={d.negativeReturns}
        cumulativeReturns={d.cumulativeReturns}
      />

      {/* Section 6: Volatility Analysis */}
      <VolatilityAnalytics highVolatility={d.highVolatility} />

      {/* Section 7: Market Insights */}
      <MarketInsights
        topGainers={d.topReturns}
        topLosers={d.negativeReturns}
        highVolatility={d.highVolatility}
        highestVolume={d.highestVolume}
        highestPrice={d.highestPrice}
        averagePrice={d.averagePrice}
        cumulativeReturns={d.cumulativeReturns}
      />
    </div>
  );
}

export default Analytics;
