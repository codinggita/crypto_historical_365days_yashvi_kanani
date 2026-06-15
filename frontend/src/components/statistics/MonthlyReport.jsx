import React from 'react';
import { FiCalendar, FiTrendingUp, FiTrendingDown, FiBookOpen } from 'react-icons/fi';
import { formatPrice, formatLargeNumber, formatPercent } from '../../utils/format';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function MonthlyReport({ monthly = [] }) {
  // Compute analytics from monthly data
  let bestMonth = null;
  let worstMonth = null;
  let averageMonthlyGrowth = 0;

  if (monthly && monthly.length > 0) {
    // Best Month (highest average price)
    bestMonth = monthly.reduce((max, item) => 
      (!max || item.averagePrice > max.averagePrice) ? item : max, null
    );

    // Worst Month (lowest average price)
    worstMonth = monthly.reduce((min, item) => 
      (!min || item.averagePrice < min.averagePrice) ? item : min, null
    );

    // MoM Average Growth
    const sorted = [...monthly].sort((a, b) => {
      if (a._id.year !== b._id.year) return a._id.year - b._id.year;
      return a._id.month - b._id.month;
    });

    let totalGrowth = 0;
    let growthCount = 0;
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1].averagePrice;
      const curr = sorted[i].averagePrice;
      if (prev > 0) {
        totalGrowth += ((curr - prev) / prev) * 100;
        growthCount++;
      }
    }
    averageMonthlyGrowth = growthCount > 0 ? (totalGrowth / growthCount) : 0;
  }

  const getMonthLabel = (m) => {
    if (!m) return '—';
    const idx = m._id.month - 1;
    return `${MONTH_NAMES[idx] || 'Month ' + m._id.month} ${m._id.year}`;
  };

  return (
    <div className="statistics-section">
      <div className="statistics-section-header">
        <h2 className="statistics-section-title">
          <FiCalendar className="section-title-icon" />
          Monthly Aggregation Reports
        </h2>
        <p className="statistics-section-subtitle">
          Cyclical performance metrics grouped by calendar months
        </p>
      </div>

      <div className="report-dashboard-grid">
        {/* Metric cards */}
        <div className="report-overview-cards">
          {/* Best Month */}
          <div className="report-metric-card positive">
            <div className="card-top">
              <FiTrendingUp className="report-card-icon" />
              <span>Best Performance Month</span>
            </div>
            <div className="card-value">{getMonthLabel(bestMonth)}</div>
            <div className="card-sub">
              Peak Avg Price: {bestMonth ? formatPrice(bestMonth.averagePrice) : '—'}
            </div>
          </div>

          {/* Worst Month */}
          <div className="report-metric-card negative">
            <div className="card-top">
              <FiTrendingDown className="report-card-icon" />
              <span>Worst Performance Month</span>
            </div>
            <div className="card-value">{getMonthLabel(worstMonth)}</div>
            <div className="card-sub">
              Floor Avg Price: {worstMonth ? formatPrice(worstMonth.averagePrice) : '—'}
            </div>
          </div>

          {/* Average Growth */}
          <div className="report-metric-card neutral">
            <div className="card-top">
              <FiBookOpen className="report-card-icon" />
              <span>Average MoM Growth</span>
            </div>
            <div className="card-value">
              {averageMonthlyGrowth !== 0 ? formatPercent(averageMonthlyGrowth) : '—'}
            </div>
            <div className="card-sub">Mean monthly pricing variation</div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="report-table-card">
          <h4 className="report-table-title">Monthly Market Summary</h4>
          <div className="responsive-table-wrapper">
            <table className="stats-data-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Average Price</th>
                  <th>Total Traded Volume</th>
                  <th>Entries Logged</th>
                </tr>
              </thead>
              <tbody>
                {monthly.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-cell">No monthly analysis records found</td>
                  </tr>
                ) : (
                  monthly.map((item, idx) => (
                    <tr key={`${item._id.year}-${item._id.month}-${idx}`}>
                      <td>
                        <strong>
                          {MONTH_NAMES[item._id.month - 1] || `Month ${item._id.month}`} {item._id.year}
                        </strong>
                      </td>
                      <td>{formatPrice(item.averagePrice)}</td>
                      <td>{formatLargeNumber(item.totalVolume)}</td>
                      <td>{item.count} items</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyReport;
