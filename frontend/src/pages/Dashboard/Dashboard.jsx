import React from 'react';
import { useSelector } from 'react-redux';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiActivity,
  FiBookmark,
  FiArrowUpRight,
  FiArrowDownRight,
  FiPieChart,
} from 'react-icons/fi';

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const displayName = user?.name || user?.email || 'User';

  const stats = [
    {
      label: 'Market Overview',
      value: '$2.41T',
      change: '+3.45%',
      isPositive: true,
      icon: <FiActivity />,
      iconClass: 'indigo',
    },
    {
      label: 'Top Gainers',
      value: 'Bitcoin SV',
      change: '+28.4%',
      isPositive: true,
      icon: <FiTrendingUp />,
      iconClass: 'green',
    },
    {
      label: 'Top Losers',
      value: 'Terra Classic',
      change: '-14.2%',
      isPositive: false,
      icon: <FiTrendingDown />,
      iconClass: 'red',
    },
    {
      label: 'Market Cap',
      value: '$1.12T',
      change: '+1.20%',
      isPositive: true,
      icon: <FiDollarSign />,
      iconClass: 'amber',
    },
    {
      label: 'Volume',
      value: '$84.3B',
      change: '-8.52%',
      isPositive: false,
      icon: <FiPieChart />,
      iconClass: 'blue',
    },
    {
      label: 'Watchlist Summary',
      value: '12 Coins',
      change: '+4 added',
      isPositive: true,
      icon: <FiBookmark />,
      iconClass: 'purple',
    },
  ];

  const topGainers = [
    { name: 'Bitcoin SV', symbol: 'BSV', change: '+28.4%' },
    { name: 'Solana', symbol: 'SOL', change: '+12.5%' },
    { name: 'Optimism', symbol: 'OP', change: '+9.8%' },
    { name: 'Arbitrum', symbol: 'ARB', change: '+8.2%' },
  ];

  const topLosers = [
    { name: 'Terra Classic', symbol: 'LUNC', change: '-14.2%' },
    { name: 'Pepe', symbol: 'PEPE', change: '-9.5%' },
    { name: 'Dogecoin', symbol: 'DOGE', change: '-6.8%' },
    { name: 'Avalanche', symbol: 'AVAX', change: '-5.4%' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {displayName}!</h1>
        <p className="page-subtitle">Here is what is happening in the crypto markets today.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-card-header">
              <span className="stat-card-label">{stat.label}</span>
              <div className={`stat-card-icon ${stat.iconClass}`}>{stat.icon}</div>
            </div>
            <div className="stat-card-value">{stat.value}</div>
            <div className={`stat-card-change ${stat.isPositive ? 'positive' : 'negative'}`}>
              {stat.isPositive ? <FiArrowUpRight /> : <FiArrowDownRight />}
              <span>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Top Gainers */}
        <div className="content-card">
          <h2 className="content-card-title">
            <FiTrendingUp style={{ color: 'var(--positive)' }} />
            Top Gainers
          </h2>
          <div className="placeholder-list">
            {topGainers.map((coin, i) => (
              <div className="placeholder-row" key={i}>
                <div className="placeholder-coin">
                  <div className="placeholder-coin-dot">{coin.symbol.slice(0, 2)}</div>
                  <div>
                    <div className="placeholder-coin-name">{coin.name}</div>
                    <div className="placeholder-coin-sym">{coin.symbol}</div>
                  </div>
                </div>
                <span className="placeholder-badge positive">{coin.change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="content-card">
          <h2 className="content-card-title">
            <FiTrendingDown style={{ color: 'var(--negative)' }} />
            Top Losers
          </h2>
          <div className="placeholder-list">
            {topLosers.map((coin, i) => (
              <div className="placeholder-row" key={i}>
                <div className="placeholder-coin">
                  <div className="placeholder-coin-dot">{coin.symbol.slice(0, 2)}</div>
                  <div>
                    <div className="placeholder-coin-name">{coin.name}</div>
                    <div className="placeholder-coin-sym">{coin.symbol}</div>
                  </div>
                </div>
                <span className="placeholder-badge negative">{coin.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


