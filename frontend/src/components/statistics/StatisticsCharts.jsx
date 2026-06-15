import React from 'react';
import { FiPieChart, FiTrendingUp } from 'react-icons/fi';
import DistributionChart from './DistributionChart';

function StatisticsCharts({ distributions, monthly, yearly, marketSummary, highestMarketCap }) {
  // 1. Market Cap Distribution (Highest Market Cap vs Rest of Market)
  const highestCapVal = highestMarketCap?.marketCap || 0;
  const highestCapName = highestMarketCap?.name || 'Top Coin';
  const totalMarketCap = marketSummary?.totalMarketCap || 0;
  const restMarketCap = Math.max(0, totalMarketCap - highestCapVal);

  const marketCapData = [
    { name: highestCapName, value: highestCapVal },
    { name: 'Rest of Market', value: restMarketCap },
  ];

  // 2. Price Distribution
  const priceData = (distributions?.price || []).map((item) => ({
    name: item._id,
    value: item.count,
  }));

  // 3. Rank Distribution
  const rankData = (distributions?.rank || []).map((item) => ({
    name: item._id,
    value: item.count,
  }));

  // 4. Volatility Distribution
  const volatilityData = (distributions?.volatility || []).map((item) => ({
    name: item._id,
    value: item.count,
  }));

  // 5. Monthly Market Trend (chronological order)
  const monthlyTrendData = [...(monthly || [])]
    .reverse()
    .map((item) => ({
      name: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      value: item.averagePrice,
      volume: item.totalVolume,
    }));

  // 6. Yearly Market Trend
  const yearlyTrendData = [...(yearly || [])]
    .reverse()
    .map((item) => ({
      name: String(item._id.year),
      value: item.averagePrice,
      volume: item.totalVolume,
    }));

  return (
    <div className="statistics-charts-section">
      <div className="statistics-section-header">
        <h2 className="statistics-section-title">
          <FiPieChart className="section-title-icon" />
          Market Distribution & Trends
        </h2>
        <p className="statistics-section-subtitle">
          Database allocations, pricing structures, and historical trends
        </p>
      </div>

      <div className="statistics-charts-grid">
        {/* Market Cap Distribution */}
        <div className="statistics-chart-card">
          <h3>Market Cap Concentration</h3>
          <p className="chart-card-subtitle">Highest market cap vs remaining market capitalization</p>
          <DistributionChart
            data={marketCapData}
            type="pie"
            dataKey="value"
            nameKey="name"
            isVolume={true}
          />
        </div>

        {/* Rank Distribution */}
        <div className="statistics-chart-card">
          <h3>Rank Distribution</h3>
          <p className="chart-card-subtitle">Count of cryptocurrencies grouped by rank brackets</p>
          <DistributionChart
            data={rankData}
            type="pie"
            dataKey="value"
            nameKey="name"
            color="emerald"
          />
        </div>

        {/* Price Distribution */}
        <div className="statistics-chart-card">
          <h3>Price Distribution</h3>
          <p className="chart-card-subtitle">Asset counts categorized by market price ranges</p>
          <DistributionChart
            data={priceData}
            type="bar"
            dataKey="value"
            nameKey="name"
            color="blue"
          />
        </div>

        {/* Volatility Distribution */}
        <div className="statistics-chart-card">
          <h3>Volatility Distribution</h3>
          <p className="chart-card-subtitle">Asset counts classified by average daily volatility brackets</p>
          <DistributionChart
            data={volatilityData}
            type="bar"
            dataKey="value"
            nameKey="name"
            color="rose"
          />
        </div>

        {/* Monthly Trend */}
        <div className="statistics-chart-card full-width-chart">
          <h3>Monthly Price Performance</h3>
          <p className="chart-card-subtitle">Monthly average market pricing over time</p>
          <DistributionChart
            data={monthlyTrendData}
            type="area"
            dataKey="value"
            nameKey="name"
            isCurrency={true}
            color="indigo"
          />
        </div>

        {/* Yearly Trend */}
        <div className="statistics-chart-card full-width-chart">
          <h3>Yearly Volume Performance</h3>
          <p className="chart-card-subtitle">Yearly cumulative transaction volume over time</p>
          <DistributionChart
            data={yearlyTrendData}
            type="bar"
            dataKey="volume"
            nameKey="name"
            isVolume={true}
            color="violet"
          />
        </div>
      </div>
    </div>
  );
}

export default StatisticsCharts;
