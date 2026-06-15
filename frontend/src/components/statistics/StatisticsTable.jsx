import React, { useState } from 'react';
import { FiTrendingUp, FiTrendingDown, FiAward, FiDollarSign } from 'react-icons/fi';
import { formatPrice, formatLargeNumber, formatPercent } from '../../utils/format';

function StatisticsTable({ topGainers = [], topLosers = [], highestCap, highestVolume }) {
  const [activeTab, setActiveTab] = useState('performance');

  return (
    <div className="statistics-section">
      <div className="statistics-section-header">
        <h2 className="statistics-section-title">
          <FiAward className="section-title-icon" />
          Performance & Leaderboards
        </h2>
        <p className="statistics-section-subtitle">
          Database ranking summaries of market gainers, losers, and capital leaders
        </p>
      </div>

      <div className="statistics-table-card">
        {/* Tab Controls */}
        <div className="table-tabs">
          <button
            className={`table-tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            Daily Performance (Gainers & Losers)
          </button>
          <button
            className={`table-tab-btn ${activeTab === 'leaders' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaders')}
          >
            Market Limit Leaders
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'performance' ? (
          <div className="dual-tables-grid">
            {/* Top Gainers Table */}
            <div className="sub-table-container">
              <div className="sub-table-header positive">
                <FiTrendingUp />
                <h4>Top Gainers</h4>
              </div>
              <div className="responsive-table-wrapper">
                <table className="stats-data-table">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Price</th>
                      <th>24h Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topGainers.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="empty-cell">No gainers data available</td>
                      </tr>
                    ) : (
                      topGainers.slice(0, 5).map((coin) => (
                        <tr key={coin.coinId || coin._id}>
                          <td>
                            <div className="coin-cell">
                              <span className="coin-symbol">{coin.symbol}</span>
                              <span className="coin-name">{coin.name}</span>
                            </div>
                          </td>
                          <td>{formatPrice(coin.price)}</td>
                          <td className="positive-text">{formatPercent(coin.dailyReturn)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Losers Table */}
            <div className="sub-table-container">
              <div className="sub-table-header negative">
                <FiTrendingDown />
                <h4>Top Losers</h4>
              </div>
              <div className="responsive-table-wrapper">
                <table className="stats-data-table">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Price</th>
                      <th>24h Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topLosers.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="empty-cell">No losers data available</td>
                      </tr>
                    ) : (
                      topLosers.slice(0, 5).map((coin) => (
                        <tr key={coin.coinId || coin._id}>
                          <td>
                            <div className="coin-cell">
                              <span className="coin-symbol">{coin.symbol}</span>
                              <span className="coin-name">{coin.name}</span>
                            </div>
                          </td>
                          <td>{formatPrice(coin.price)}</td>
                          <td className="negative-text">{formatPercent(coin.dailyReturn)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="single-table-container">
            <div className="responsive-table-wrapper">
              <table className="stats-data-table">
                <thead>
                  <tr>
                    <th>Leader Class</th>
                    <th>Asset</th>
                    <th>Price</th>
                    <th>Market Cap</th>
                    <th>Trading Volume</th>
                    <th>Daily Return</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Highest Market Cap Row */}
                  {highestCap ? (
                    <tr>
                      <td>
                        <div className="leader-class-cell">
                          <FiAward className="leader-class-icon amber" />
                          <span>Highest Market Cap</span>
                        </div>
                      </td>
                      <td>
                        <div className="coin-cell">
                          <span className="coin-symbol">{highestCap.symbol}</span>
                          <span className="coin-name">{highestCap.name}</span>
                        </div>
                      </td>
                      <td>{formatPrice(highestCap.price)}</td>
                      <td>{formatLargeNumber(highestCap.marketCap)}</td>
                      <td>{formatLargeNumber(highestCap.volume)}</td>
                      <td className={parseFloat(highestCap.dailyReturn) >= 0 ? 'positive-text' : 'negative-text'}>
                        {formatPercent(highestCap.dailyReturn)}
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="6" className="empty-cell">No Highest Market Cap data available</td>
                    </tr>
                  )}

                  {/* Highest Volume Row */}
                  {highestVolume ? (
                    <tr>
                      <td>
                        <div className="leader-class-cell">
                          <FiDollarSign className="leader-class-icon blue" />
                          <span>Highest Traded Volume</span>
                        </div>
                      </td>
                      <td>
                        <div className="coin-cell">
                          <span className="coin-symbol">{highestVolume.symbol}</span>
                          <span className="coin-name">{highestVolume.name}</span>
                        </div>
                      </td>
                      <td>{formatPrice(highestVolume.price)}</td>
                      <td>{formatLargeNumber(highestVolume.marketCap)}</td>
                      <td>{formatLargeNumber(highestVolume.volume)}</td>
                      <td className={parseFloat(highestVolume.dailyReturn) >= 0 ? 'positive-text' : 'negative-text'}>
                        {formatPercent(highestVolume.dailyReturn)}
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="6" className="empty-cell">No Highest Volume data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatisticsTable;
