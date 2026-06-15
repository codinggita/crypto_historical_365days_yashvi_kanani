import React from 'react';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiActivity,
  FiBriefcase,
  FiTrendingUp as FiUpIcon,
  FiTrendingDown as FiDownIcon,
  FiBox,
} from 'react-icons/fi';
import { formatPrice, formatLargeNumber, formatPercent } from '../../utils/format';

function StatisticsOverview({ stats }) {
  const totalCoins = stats?.coinCount ?? '—';
  const totalMarketCap = stats?.totalMarketCap ? formatLargeNumber(stats.totalMarketCap) : '—';
  const averagePrice = stats?.averagePrice ? formatPrice(stats.averagePrice) : '—';
  const averageVolume = stats?.averageVolume ? formatLargeNumber(stats.averageVolume) : '—';

  const topGainer = stats?.topGainer;
  const topLoser = stats?.topLoser;

  const cards = [
    {
      label: 'Total Cryptocurrencies',
      value: totalCoins,
      sub: 'Active database assets',
      icon: <FiBox />,
      colorClass: 'blue',
    },
    {
      label: 'Total Market Cap',
      value: totalMarketCap,
      sub: 'Cumulative evaluation',
      icon: <FiBriefcase />,
      colorClass: 'indigo',
    },
    {
      label: 'Average Market Price',
      value: averagePrice,
      sub: 'Mean token value',
      icon: <FiActivity />,
      colorClass: 'amber',
    },
    {
      label: 'Average Trading Volume',
      value: averageVolume,
      sub: 'Mean transactional volume',
      icon: <FiDollarSign />,
      colorClass: 'purple',
    },
    {
      label: 'Top Daily Gainer',
      value: topGainer ? topGainer.name : '—',
      sub: topGainer ? `${formatPrice(topGainer.price)} (${formatPercent(topGainer.dailyReturn)})` : 'No daily gain data',
      icon: <FiTrendingUp />,
      colorClass: 'green',
      change: topGainer?.dailyReturn,
    },
    {
      label: 'Top Daily Loser',
      value: topLoser ? topLoser.name : '—',
      sub: topLoser ? `${formatPrice(topLoser.price)} (${formatPercent(topLoser.dailyReturn)})` : 'No daily loss data',
      icon: <FiTrendingDown />,
      colorClass: 'red',
      change: topLoser?.dailyReturn,
    },
  ];

  return (
    <div className="statistics-section">
      <div className="statistics-section-header">
        <h2 className="statistics-section-title">
          <FiActivity className="section-title-icon" />
          Executive Market Summary
        </h2>
        <p className="statistics-section-subtitle">
          High-level overview computed via MongoDB database aggregations
        </p>
      </div>
      <div className="statistics-overview-grid">
        {cards.map((card, idx) => {
          const isPositive = card.change !== undefined ? parseFloat(card.change) >= 0 : null;

          return (
            <div className="statistics-overview-card" key={idx}>
              <div className="statistics-card-header">
                <span className="statistics-card-label">{card.label}</span>
                <div className={`stat-card-icon ${card.colorClass}`}>{card.icon}</div>
              </div>
              <div className="statistics-card-value">{card.value}</div>
              <div className="statistics-card-sub">{card.sub}</div>
              {card.change !== undefined && (
                <div className={`stat-card-change ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? <FiUpIcon /> : <FiDownIcon />}
                  <span>{formatPercent(card.change)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatisticsOverview;
