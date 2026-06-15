import React from 'react';
import { FiCalendar, FiArrowUpRight, FiArrowDownRight, FiAward } from 'react-icons/fi';
import { formatPrice, formatLargeNumber, formatPercent } from '../../utils/format';

function YearlyReport({ yearly = [] }) {
  let peakYear = null;
  let floorYear = null;
  let annualGrowthRate = 0;

  if (yearly && yearly.length > 0) {
    // Peak average price year
    peakYear = yearly.reduce((max, item) => 
      (!max || item.averagePrice > max.averagePrice) ? item : max, null
    );

    // Floor average price year
    floorYear = yearly.reduce((min, item) => 
      (!min || item.averagePrice < min.averagePrice) ? item : min, null
    );

    // YoY Growth Rate
    const sorted = [...yearly].sort((a, b) => a._id.year - b._id.year);
    let totalYoYGrowth = 0;
    let yoyCount = 0;

    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1].averagePrice;
      const curr = sorted[i].averagePrice;
      if (prev > 0) {
        totalYoYGrowth += ((curr - prev) / prev) * 100;
        yoyCount++;
      }
    }
    annualGrowthRate = yoyCount > 0 ? (totalYoYGrowth / yoyCount) : 0;
  }

  return (
    <div className="statistics-section">
      <div className="statistics-section-header">
        <h2 className="statistics-section-title">
          <FiCalendar className="section-title-icon" />
          Yearly Aggregation Reports
        </h2>
        <p className="statistics-section-subtitle">
          Long-term annual market cycles and performance valuations
        </p>
      </div>

      <div className="report-dashboard-grid">
        {/* Metric cards */}
        <div className="report-overview-cards">
          {/* Best Year */}
          <div className="report-metric-card positive">
            <div className="card-top">
              <FiArrowUpRight className="report-card-icon" />
              <span>Highest Performance Year</span>
            </div>
            <div className="card-value">{peakYear ? `Year ${peakYear._id.year}` : '—'}</div>
            <div className="card-sub">
              Peak Avg: {peakYear ? formatPrice(peakYear.averagePrice) : '—'}
            </div>
          </div>

          {/* Worst Year */}
          <div className="report-metric-card negative">
            <div className="card-top">
              <FiArrowDownRight className="report-card-icon" />
              <span>Lowest Performance Year</span>
            </div>
            <div className="card-value">{floorYear ? `Year ${floorYear._id.year}` : '—'}</div>
            <div className="card-sub">
              Floor Avg: {floorYear ? formatPrice(floorYear.averagePrice) : '—'}
            </div>
          </div>

          {/* Average Growth */}
          <div className="report-metric-card neutral">
            <div className="card-top">
              <FiAward className="report-card-icon" />
              <span>Average YoY Growth</span>
            </div>
            <div className="card-value">
              {annualGrowthRate !== 0 ? formatPercent(annualGrowthRate) : '—'}
            </div>
            <div className="card-sub">Mean annual pricing variation</div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="report-table-card">
          <h4 className="report-table-title">Annual Performance Summary</h4>
          <div className="responsive-table-wrapper">
            <table className="stats-data-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Average Price</th>
                  <th>Total Traded Volume</th>
                  <th>Data Points</th>
                </tr>
              </thead>
              <tbody>
                {yearly.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-cell">No yearly aggregation records found</td>
                  </tr>
                ) : (
                  yearly.map((item, idx) => (
                    <tr key={`${item._id.year}-${idx}`}>
                      <td>
                        <strong>Year {item._id.year}</strong>
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

export default YearlyReport;
