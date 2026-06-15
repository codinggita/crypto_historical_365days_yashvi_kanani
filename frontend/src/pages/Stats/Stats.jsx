import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import {
  fetchStart,
  fetchSuccess,
  fetchFailure,
} from '../../redux/slices/statisticsSlice';
import statsService from '../../services/stats.service';

// Components
import StatisticsOverview from '../../components/statistics/StatisticsOverview';
import StatisticsCharts from '../../components/statistics/StatisticsCharts';
import StatisticsTable from '../../components/statistics/StatisticsTable';
import MonthlyReport from '../../components/statistics/MonthlyReport';
import YearlyReport from '../../components/statistics/YearlyReport';
import InsightsPanel from '../../components/statistics/InsightsPanel';
import ExportButtons from '../../components/statistics/ExportButtons';
import StatisticsSkeleton from '../../components/statistics/StatisticsSkeleton';

import '../../styles/statistics.css';

function Stats() {
  const dispatch = useDispatch();
  const { marketStats, monthlyStats, yearlyStats, distributionStats, loading, error } = useSelector((s) => s.statistics);

  const fetchAll = useCallback(async () => {
    dispatch(fetchStart());
    try {
      const [
        coinCount,
        totalMarketCap,
        averagePrice,
        averageVolume,
        highestMarketCap,
        highestVolume,
        topGainers,
        topLosers,
        rankDistribution,
        priceDistribution,
        volatilityDistribution,
        monthlyAnalysis,
        yearlyAnalysis,
        marketSummary,
      ] = await Promise.allSettled([
        statsService.getCoinCount(),
        statsService.getTotalMarketCap(),
        statsService.getAveragePrice(),
        statsService.getAverageVolume(),
        statsService.getHighestMarketCap(),
        statsService.getHighestVolume(),
        statsService.getTopGainers({ limit: 10 }),
        statsService.getTopLosers({ limit: 10 }),
        statsService.getRankDistribution(),
        statsService.getPriceDistribution(),
        statsService.getVolatilityDistribution(),
        statsService.getMonthlyAnalysis(),
        statsService.getYearlyAnalysis(),
        statsService.getMarketSummary(),
      ]);

      const resolved = (r) => (r.status === 'fulfilled' ? r.value?.data ?? r.value : null);

      const resolvedCoinCount = resolved(coinCount)?.coinCount ?? 0;
      const resolvedTotalMarketCap = resolved(totalMarketCap)?.totalMarketCap ?? 0;
      const resolvedAveragePrice = resolved(averagePrice)?.averagePrice ?? 0;
      const resolvedAverageVolume = resolved(averageVolume)?.averageVolume ?? 0;
      const resolvedHighestMarketCap = resolved(highestMarketCap);
      const resolvedHighestVolume = resolved(highestVolume);
      const resolvedTopGainers = resolved(topGainers) || [];
      const resolvedTopLosers = resolved(topLosers) || [];

      dispatch(
        fetchSuccess({
          marketStats: {
            coinCount: resolvedCoinCount,
            totalMarketCap: resolvedTotalMarketCap,
            averagePrice: resolvedAveragePrice,
            averageVolume: resolvedAverageVolume,
            highestMarketCap: resolvedHighestMarketCap,
            highestVolume: resolvedHighestVolume,
            topGainer: resolvedTopGainers?.[0],
            topLoser: resolvedTopLosers?.[0],
            topGainers: resolvedTopGainers,
            topLosers: resolvedTopLosers,
          },
          monthlyStats: resolved(monthlyAnalysis) || [],
          yearlyStats: resolved(yearlyAnalysis) || [],
          distributionStats: {
            rank: resolved(rankDistribution) || [],
            price: resolved(priceDistribution) || [],
            volatility: resolved(volatilityDistribution) || [],
          },
        })
      );
    } catch (err) {
      dispatch(fetchFailure(err?.message ?? 'Failed to load statistics data'));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Loading state
  if (loading && !marketStats) {
    return (
      <div>
        <div className="page-header" style={{ marginBottom: '1.5rem' }}>
          <h1 className="page-title">Historical Statistics</h1>
          <p className="page-subtitle">Loading advanced backend aggregates...</p>
        </div>
        <StatisticsSkeleton />
      </div>
    );
  }

  // Error state
  if (error && !marketStats) {
    return (
      <div>
        <div className="page-header" style={{ marginBottom: '1.5rem' }}>
          <h1 className="page-title">Historical Statistics</h1>
        </div>
        <div className="statistics-error-card">
          <div className="statistics-error-icon"><FiAlertTriangle /></div>
          <h3 className="statistics-error-title">Failed to load statistics</h3>
          <p className="statistics-error-msg">{error}</p>
          <button className="statistics-retry-btn" onClick={fetchAll}>
            <FiRefreshCw style={{ marginRight: '0.4rem' }} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-page-container">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Historical Statistics</h1>
          <p className="page-subtitle">
            Advanced multi-year database valuations, distributions, and aggregates
          </p>
        </div>
        <button
          className="statistics-retry-btn"
          style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          onClick={fetchAll}
          title="Refresh statistics"
        >
          <FiRefreshCw />
          <span>Refresh</span>
        </button>
      </div>

      {/* Section 1: Executive Summary */}
      <StatisticsOverview stats={marketStats} />

      {/* Section 2: Market Distribution & Trends */}
      <StatisticsCharts
        distributions={distributionStats}
        monthly={monthlyStats}
        yearly={yearlyStats}
        marketSummary={marketStats}
        highestMarketCap={marketStats?.highestMarketCap}
      />

      {/* Section 3: Performance Leaderboard Tables */}
      <StatisticsTable
        topGainers={marketStats?.topGainers}
        topLosers={marketStats?.topLosers}
        highestCap={marketStats?.highestMarketCap}
        highestVolume={marketStats?.highestVolume}
      />

      {/* Section 4: Monthly Reports */}
      <MonthlyReport monthly={monthlyStats} />

      {/* Section 5: Yearly Reports */}
      <YearlyReport yearly={yearlyStats} />

      {/* Section 6: Insights Engine */}
      <InsightsPanel
        stats={marketStats}
        distributions={distributionStats}
        monthly={monthlyStats}
      />

      {/* Section 7: Export Features */}
      <ExportButtons
        stats={marketStats}
        distributions={distributionStats}
        monthly={monthlyStats}
        yearly={yearlyStats}
      />
    </div>
  );
}

export default Stats;
