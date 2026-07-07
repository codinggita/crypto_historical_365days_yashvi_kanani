import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
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
          <div className="analytics-error-icon"><AlertTriangle size={48} /></div>
          <h3 className="analytics-error-title">Failed to load analytics</h3>
          <p className="analytics-error-msg">{error}</p>
          <button className="analytics-retry-btn" onClick={fetchAll}>
            <RefreshCw size={14} style={{ marginRight: '0.4rem', display: 'inline-block' }} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const d = analyticsData ?? {};

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1 className="page-title"><span className="title-gradient">Market Analytics</span></h1>
            <p className="page-subtitle">
              Real-time crypto intelligence — prices, volumes, returns &amp; risk metrics
            </p>
          </div>
          {lastUpdated && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Market Sentiment Strip */}
      <motion.div className="analytics-sentiment-strip" variants={itemVariants}>
        <div className="sentiment-item">
          <span className="sentiment-label">Market Sentiment</span>
          <span className={`sentiment-value ${isBullish ? 'bullish' : 'bearish'}`}>
            {isBullish ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
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
          <TrendingUp size={14} style={{ color: 'var(--color-success)' }} />
          <span className="sentiment-label">Bullish</span>
          <span className="sentiment-value bullish">{bullish.toLocaleString()}</span>
        </div>
        <div className="sentiment-item">
          <TrendingDown size={14} style={{ color: 'var(--color-danger)' }} />
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
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} style={{ marginRight: '0.25rem' }} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Time Range Selector */}
      <motion.div className="analytics-range-bar" variants={itemVariants}>
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
      </motion.div>

      {/* Section 1: Overview Cards */}
      <motion.div variants={itemVariants}>
        <AnalyticsOverview data={overviewData} />
      </motion.div>

      {/* Section 2: Market Trend Charts */}
      <motion.div variants={itemVariants}>
        <MarketTrendChart
          priceTrend={d.priceTrend}
          priceGrowth={d.priceGrowth}
          priceDrop={d.priceDrop}
        />
      </motion.div>

      {/* Section 3: Top Gainers & Losers Leaderboard */}
      <motion.div variants={itemVariants}>
        <LeaderboardTables
          topGainers={d.topReturns}
          topLosers={d.negativeReturns}
        />
      </motion.div>

      {/* Section 4: Volume Analytics */}
      <motion.div variants={itemVariants}>
        <VolumeAnalytics
          highestVolume={d.highestVolume}
          lowestVolume={d.lowestVolume}
          averageVolume={d.averageVolume}
          volumeSpike={d.volumeSpike}
        />
      </motion.div>

      {/* Section 5: Returns Analytics */}
      <motion.div variants={itemVariants}>
        <ReturnsAnalytics
          topReturns={d.topReturns}
          negativeReturns={d.negativeReturns}
          cumulativeReturns={d.cumulativeReturns}
        />
      </motion.div>

      {/* Section 6: Volatility Analysis */}
      <motion.div variants={itemVariants}>
        <VolatilityAnalytics highVolatility={d.highVolatility} />
      </motion.div>

      {/* Section 7: Market Insights */}
      <motion.div variants={itemVariants}>
        <MarketInsights
          topGainers={d.topReturns}
          topLosers={d.negativeReturns}
          highVolatility={d.highVolatility}
          highestVolume={d.highestVolume}
          highestPrice={d.highestPrice}
          averagePrice={d.averagePrice}
          cumulativeReturns={d.cumulativeReturns}
        />
      </motion.div>
    </motion.div>
  );
}

export default Analytics;
