import React from 'react';
import { FiTrendingUp, FiActivity, FiAlertCircle, FiAward, FiInfo } from 'react-icons/fi';
import { formatPrice, formatPercent, formatLargeNumber } from '../../utils/format';

function InsightsPanel({ stats, distributions, monthly = [] }) {
  const insights = [];

  // Generate dynamic insights
  if (stats) {
    // 1. Market Breadth
    const coinCount = stats.coinCount || 0;
    const avgPrice = stats.averagePrice || 0;
    insights.push({
      title: 'Market Breadth',
      text: `The ecosystem aggregates ${coinCount} unique cryptocurrencies with a mean market valuation of ${formatPrice(avgPrice)}.`,
      icon: <FiInfo className="text-blue" />,
    });

    // 2. Market Cap Dominance
    const totalMarketCap = stats.totalMarketCap || 0;
    const highestCap = stats.highestMarketCap || stats.highestCap;
    if (highestCap && totalMarketCap > 0) {
      const share = (highestCap.marketCap / totalMarketCap) * 100;
      insights.push({
        title: 'Market Dominance',
        text: `Market cap concentration is concentrated: the top asset ${highestCap.name} (${highestCap.symbol}) holds ${share.toFixed(2)}% of the total ${formatLargeNumber(totalMarketCap)} market valuation.`,
        icon: <FiAward className="text-amber" />,
      });
    }

    // 3. Volatility Alert
    // Find highest volatility from distribution or stats
    const topLoser = stats.topLoser;
    const topGainer = stats.topGainer;
    const peakVolatile = topLoser && topGainer
      ? (parseFloat(topLoser.volatility) > parseFloat(topGainer.volatility) ? topLoser : topGainer)
      : (topLoser || topGainer);

    if (peakVolatile && peakVolatile.volatility) {
      insights.push({
        title: 'Volatility Indicator',
        text: `High volatility warning: ${peakVolatile.name} (${peakVolatile.symbol}) is showing extreme activity with standard deviation measurements reaching ${parseFloat(peakVolatile.volatility).toFixed(2)}%.`,
        icon: <FiAlertCircle className="text-rose" />,
      });
    }

    // 4. Performance Driver
    if (topGainer) {
      insights.push({
        title: 'Daily Rally Leader',
        text: `${topGainer.name} (${topGainer.symbol}) drives short-term performance, rallying ${formatPercent(topGainer.dailyReturn)} over the past 24 hours.`,
        icon: <FiTrendingUp className="text-green" />,
      });
    }

    // 5. Growth Macro Trend
    if (monthly && monthly.length > 1) {
      const sorted = [...monthly].sort((a, b) => {
        if (a._id.year !== b._id.year) return a._id.year - b._id.year;
        return a._id.month - b._id.month;
      });
      const last = sorted[sorted.length - 1]?.averagePrice || 0;
      const prev = sorted[sorted.length - 2]?.averagePrice || 0;
      if (prev > 0) {
        const change = ((last - prev) / prev) * 100;
        insights.push({
          title: 'Macro pricing trend',
          text: `Month-over-month averages indicate a ${change >= 0 ? 'growth' : 'contraction'} trend. Pricing averages changed by ${formatPercent(change)} in the latest period.`,
          icon: <FiActivity className={change >= 0 ? 'text-green' : 'text-red'} />,
        });
      }
    }
  }

  return (
    <div className="statistics-section">
      <div className="statistics-section-header">
        <h2 className="statistics-section-title">
          <FiInfo className="section-title-icon" />
          Market Insights Engine
        </h2>
        <p className="statistics-section-subtitle">
          Programmatic market intelligence computed dynamically from raw aggregation statistics
        </p>
      </div>

      <div className="insights-grid">
        {insights.length === 0 ? (
          <div className="statistics-empty">
            <FiInfo size={40} />
            <p>Insufficient metrics to generate market insights</p>
          </div>
        ) : (
          insights.map((item, idx) => (
            <div className="insight-card" key={idx}>
              <div className="insight-card-header">
                <span className="insight-card-icon-wrapper">{item.icon}</span>
                <h4 className="insight-card-title">{item.title}</h4>
              </div>
              <p className="insight-card-text">{item.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default InsightsPanel;
