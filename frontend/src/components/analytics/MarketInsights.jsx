import React from 'react';
import { FiZap, FiTrendingUp, FiTrendingDown, FiBarChart2, FiAlertTriangle, FiActivity } from 'react-icons/fi';
import { formatPercent, formatLargeNumber, formatPrice } from '../../utils/format';

function extractList(raw) {
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  return [];
}

function getSingleCoin(raw) {
  if (raw?.data && !Array.isArray(raw.data)) return raw.data;
  if (raw?.data?.data && !Array.isArray(raw.data.data)) return raw.data.data;
  return null;
}

function generateInsights({ topGainersData, topLosersData, highVolatility, highestVolume, highestPrice, averagePrice, cumulativeReturns }) {
  const insights = [];

  // Top gainer insight
  const topG = topGainersData?.[0];
  if (topG) {
    insights.push({
      icon: <FiTrendingUp />,
      color: 'green',
      title: 'Top Gainer',
      text: `${topG.name} (${topG.symbol}) leads the market with ${formatPercent(topG.dailyReturn)} daily return, making it the highest performing asset today.`,
    });
  }

  // Top loser insight
  const topL = topLosersData?.[0];
  if (topL) {
    insights.push({
      icon: <FiTrendingDown />,
      color: 'red',
      title: 'Biggest Drop',
      text: `${topL.name} (${topL.symbol}) is the worst performer with ${formatPercent(topL.dailyReturn)} daily return. Consider risk before investing.`,
    });
  }

  // Market sentiment
  const gainersCount = topGainersData?.length ?? 0;
  const losersCount  = topLosersData?.length ?? 0;
  const sentiment    = gainersCount > losersCount ? 'Bullish 🐂' : gainersCount < losersCount ? 'Bearish 🐻' : 'Neutral';
  insights.push({
    icon: <FiActivity />,
    color: 'indigo',
    title: 'Market Sentiment',
    text: `Current market sentiment is ${sentiment}. ${gainersCount} gainers vs ${losersCount} losers tracked in today's session.`,
  });

  // Highest volume
  const highVol = getSingleCoin(highestVolume);
  if (highVol) {
    insights.push({
      icon: <FiBarChart2 />,
      color: 'blue',
      title: 'Volume Leader',
      text: `${highVol.name} dominates trading volume at ${formatLargeNumber(highVol.volume)}, indicating high liquidity and market interest.`,
    });
  }

  // High volatility
  const volatileCoins = extractList(highVolatility);
  if (volatileCoins.length > 0) {
    insights.push({
      icon: <FiAlertTriangle />,
      color: 'amber',
      title: 'Volatility Alert',
      text: `${volatileCoins[0].name} is the most volatile asset with ${formatPercent(volatileCoins[0].volatility)} volatility. High risk, high reward scenario.`,
    });
  }

  // Average price
  const avgP = averagePrice?.data?.averagePrice ?? averagePrice?.data?.data?.averagePrice;
  if (avgP) {
    insights.push({
      icon: <FiZap />,
      color: 'purple',
      title: 'Market Average',
      text: `The average market price stands at ${formatPrice(avgP)}. Assets trading below this benchmark may represent value opportunities.`,
    });
  }

  // Cumulative returns
  const cum = cumulativeReturns?.data ?? cumulativeReturns?.data?.data;
  const avgRet = cum?.averageDailyReturn;
  if (avgRet !== undefined) {
    const direction = parseFloat(avgRet) >= 0 ? 'positive' : 'negative';
    insights.push({
      icon: <FiTrendingUp />,
      color: parseFloat(avgRet) >= 0 ? 'green' : 'red',
      title: 'Cumulative Returns',
      text: `Market-wide cumulative daily return is ${direction} at ${formatPercent(avgRet)}. Estimated monthly impact: ${formatPercent(parseFloat(avgRet) * 30)}.`,
    });
  }

  return insights;
}

function MarketInsights({ topGainers, topLosers, highVolatility, highestVolume, highestPrice, averagePrice, cumulativeReturns }) {
  const topGainersData = extractList(topGainers);
  const topLosersData  = extractList(topLosers);

  const insights = generateInsights({
    topGainersData,
    topLosersData,
    highVolatility,
    highestVolume,
    highestPrice,
    averagePrice,
    cumulativeReturns,
  });

  return (
    <div className="analytics-section">
      <div className="analytics-section-header">
        <h2 className="analytics-section-title">
          <FiZap className="section-title-icon" />
          Market Insights
        </h2>
        <p className="analytics-section-subtitle">
          AI-powered dynamic insights generated from live market data
        </p>
      </div>

      <div className="insights-grid">
        {insights.length === 0 ? (
          <div className="analytics-empty">
            <FiZap size={36} />
            <p>No insights available yet</p>
          </div>
        ) : (
          insights.map((insight, i) => (
            <div className={`insight-card insight-card--${insight.color}`} key={i}>
              <div className={`insight-icon insight-icon--${insight.color}`}>
                {insight.icon}
              </div>
              <div className="insight-body">
                <div className="insight-title">{insight.title}</div>
                <p className="insight-text">{insight.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MarketInsights;
