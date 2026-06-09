import React, { useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiTrendingUp } from 'react-icons/fi';

// Redux Actions
import {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  setSelectedRange,
  setChartMode,
  setChartType,
  resetDetailsState,
} from '../../redux/slices/coinDetailsSlice';

// Services
import coinService from '../../services/coin.service';

// Components
import CoinHeader from '../../components/coins/CoinHeader';
import CoinChart from '../../components/coins/CoinChart';
import PerformanceCards from '../../components/coins/PerformanceCards';
import CoinStatistics from '../../components/coins/CoinStatistics';
import HistoricalTable from '../../components/coins/HistoricalTable';
import RangeSelector from '../../components/coins/RangeSelector';
import CoinDetailsSkeleton from '../../components/coins/CoinDetailsSkeleton';
import CoinDetailsErrorState from '../../components/coins/CoinDetailsErrorState';

// Styles
import '../../styles/coinDetails.css';

function CoinDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    coinDetails,
    history,
    performance,
    returns,
    volatility,
    loading,
    error,
    selectedRange,
    chartMode,
    chartType,
  } = useSelector((state) => state.coinDetails);

  const loadCoinData = useCallback(async () => {
    if (!id) return;
    dispatch(fetchStart());

    const safeFetch = (promise, fallback = null) =>
      promise.catch((err) => {
        console.warn('Secondary coin details API failed:', err);
        return fallback;
      });

    try {
      const [detailsRes, historyRes, perfRes, returnsRes, volRes] = await Promise.all([
        coinService.getCoinById(id),
        coinService.getCoinHistory(id, { limit: 1000 }),
        safeFetch(coinService.getCoinPerformance(id), null),
        safeFetch(coinService.getCoinReturns(id), null),
        safeFetch(coinService.getCoinVolatility(id), null),
      ]);

      const coin = detailsRes?.data || detailsRes;
      const hist = historyRes?.data?.history || historyRes?.history || [];
      const perf = perfRes?.data || perfRes;
      const ret = returnsRes?.data || returnsRes;
      const vol = volRes?.data || volRes;

      dispatch(
        fetchSuccess({
          coinDetails: coin,
          history: hist,
          performance: perf,
          returns: ret,
          volatility: vol,
        })
      );
    } catch (err) {
      console.error('Core details API error:', err);
      dispatch(fetchFailure(err?.response?.data?.message || err.message || 'Failed to load details'));
    }
  }, [id, dispatch]);

  useEffect(() => {
    loadCoinData();
    return () => {
      dispatch(resetDetailsState());
    };
  }, [loadCoinData, dispatch]);

  // Client-side date range filtering for timeline consistency & chart zoom
  const filteredHistory = useMemo(() => {
    if (!Array.isArray(history) || history.length === 0) return [];
    if (selectedRange === 'all') return history;

    const daysLimit = parseInt(selectedRange, 10);
    if (isNaN(daysLimit)) return history;

    // Find the latest timestamp in the dataset to act as "now" for relative offset
    const timestamps = history.map(h => new Date(h.timestamp).getTime());
    const latestTimestamp = Math.max(...timestamps);
    
    const cutoffTime = latestTimestamp - daysLimit * 24 * 60 * 60 * 1000;

    return history.filter((h) => new Date(h.timestamp).getTime() >= cutoffTime);
  }, [history, selectedRange]);

  // Handlers
  const handleRangeChange = (range) => dispatch(setSelectedRange(range));
  const handleChartModeChange = (mode) => dispatch(setChartMode(mode));
  const handleChartTypeChange = (type) => dispatch(setChartType(type));

  if (loading) {
    return <CoinDetailsSkeleton />;
  }

  if (error || !coinDetails) {
    return <CoinDetailsErrorState message={error} onRetry={loadCoinData} />;
  }

  return (
    <div className="coin-details-page">
      {/* Back to list */}
      <button className="back-link-btn" onClick={() => navigate('/coins')} id="coin-details-back">
        <FiArrowLeft /> Back to Cryptocurrencies
      </button>

      {/* Section 1: Overview */}
      <CoinHeader coin={coinDetails} />

      {/* Section 2: Price Analytics (Interactive Chart & Range Selector) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 className="details-section-title" style={{ margin: 0 }}>
            <FiTrendingUp style={{ color: '#818cf8' }} />
            Historical Price & Volume Chart
          </h2>
          <RangeSelector selected={selectedRange} onChange={handleRangeChange} />
        </div>
        <CoinChart
          data={filteredHistory}
          mode={chartMode}
          type={chartType}
          onModeChange={handleChartModeChange}
          onTypeChange={handleChartTypeChange}
        />
      </div>

      {/* Section 3: Performance Metrics */}
      <PerformanceCards
        coin={coinDetails}
        performance={performance}
        returns={returns}
        volatility={volatility}
        history={filteredHistory}
      />

      {/* Section 4: Market Statistics */}
      <div>
        <h2 className="details-section-title">
          Summary & Circulating Metrics
        </h2>
        <CoinStatistics coin={coinDetails} history={filteredHistory} />
      </div>

      {/* Section 5: Historical Records Table */}
      <HistoricalTable history={filteredHistory} />
    </div>
  );
}

export default CoinDetails;
