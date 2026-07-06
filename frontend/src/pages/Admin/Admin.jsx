import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiUsers, FiActivity, FiBookmark, FiBriefcase, FiSearch,
  FiRefreshCw, FiAlertCircle, FiDatabase, FiShield, FiTrendingUp,
  FiList, FiGrid, FiServer,
} from 'react-icons/fi';
import {
  fetchAdminOverviewThunk,
  fetchAdminUsersThunk,
  fetchAdminLogsThunk,
  fetchAdminAnalyticsThunk,
} from '../../redux/thunks/adminThunks';
import { setActiveSection } from '../../redux/slices/adminSlice';
import { formatDate } from '../../utils/format';
import '../../styles/admin.css';

const NAV = [
  { id: 'overview',   label: 'Overview',   icon: <FiGrid /> },
  { id: 'users',      label: 'Users',      icon: <FiUsers /> },
  { id: 'activity',   label: 'Activity Logs', icon: <FiActivity /> },
  { id: 'analytics',  label: 'Analytics',  icon: <FiTrendingUp /> },
  { id: 'health',     label: 'System Health', icon: <FiServer /> },
];

function KpiCard({ label, value, icon, colorClass, loading }) {
  return (
    <div className={`admin-kpi-card admin-kpi-card--${colorClass}`}>
      <div className="admin-kpi-icon">{icon}</div>
      {loading
        ? <div className="admin-skeleton" style={{ height: '1.8rem', width: '60%', marginBottom: '0.35rem' }} />
        : <div className="admin-kpi-value">{value ?? '—'}</div>
      }
      <div className="admin-kpi-label">{label}</div>
    </div>
  );
}

function Admin() {
  const dispatch = useDispatch();
  const { overview, users, logs, analytics, health, loading, error, activeSection } = useSelector(s => s.admin);
  const [userSearch, setUserSearch] = useState('');
  const [logPage, setLogPage] = useState(1);

  const load = useCallback(() => {
    dispatch(fetchAdminOverviewThunk());
    dispatch(fetchAdminUsersThunk({ page: 1, limit: 20 }));
    dispatch(fetchAdminLogsThunk({ page: logPage, limit: 20 }));
    dispatch(fetchAdminAnalyticsThunk());
  }, [dispatch, logPage]);

  useEffect(() => { load(); }, [load]);

  const kpis = [
    { label: 'Total Users',       value: overview?.totalUsers      ?? overview?.users,      icon: <FiUsers />,     colorClass: 'indigo' },
    { label: 'Total Coins',       value: overview?.totalCoins      ?? overview?.coins,      icon: <FiDatabase />,  colorClass: 'cyan' },
    { label: 'Total Bookmarks',   value: overview?.totalBookmarks  ?? overview?.bookmarks,  icon: <FiBookmark />,  colorClass: 'purple' },
    { label: 'Total Portfolios',  value: overview?.totalPortfolios ?? overview?.portfolios, icon: <FiBriefcase />, colorClass: 'emerald' },
    { label: 'Total Logs',        value: overview?.totalLogs       ?? logs?.meta?.total,    icon: <FiActivity />,  colorClass: 'amber' },
    { label: 'Admin Users',       value: overview?.adminCount      ?? overview?.admins,     icon: <FiShield />,    colorClass: 'rose' },
  ];

  const filteredUsers = (users?.list || []).filter(u =>
    !userSearch || u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <FiAlertCircle style={{ fontSize: '2.5rem', color: '#ef4444' }} />
        <h3 style={{ color: '#f3f4f6' }}>Failed to load admin data</h3>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{error}</p>
        <button className="admin-btn admin-btn--primary" onClick={load}><FiRefreshCw /> Retry</button>
      </div>
    );
  }

  return (
    <div className="admin-shell" role="main">
      {/* Sidebar */}
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-title">
            <FiShield />
            Admin Panel
            <span className="admin-sidebar-badge">ADMIN</span>
          </div>
        </div>
        <div className="admin-sidebar-section-label">Dashboard</div>
        {NAV.map(item => (
          <button
            key={item.id}
            className={`admin-nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => dispatch(setActiveSection(item.id))}
            aria-current={activeSection === item.id ? 'page' : undefined}
          >
            <span className="admin-nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </aside>

      {/* Content */}
      <main className="admin-content">

        {/* ── Overview ── */}
        {activeSection === 'overview' && (
          <>
            <div className="admin-page-header">
              <h1 className="admin-page-title">Overview</h1>
              <p className="admin-page-subtitle">Platform-wide statistics and key metrics at a glance.</p>
            </div>
            <div className="admin-kpi-grid">
              {kpis.map((k, i) => <KpiCard key={i} {...k} loading={loading} />)}
            </div>

            {/* Search Analytics */}
            {analytics?.search && (
              <div className="admin-table-card">
                <div className="admin-table-header">
                  <div className="admin-table-title"><FiSearch style={{ marginRight: '0.4rem' }} />Top Search Queries</div>
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead><tr><th>#</th><th>Query</th><th>Count</th></tr></thead>
                    <tbody>
                      {Array.isArray(analytics.search.topQueries || analytics.search) && (analytics.search.topQueries || analytics.search).slice(0, 10).map((q, i) => (
                        <tr key={i}>
                          <td style={{ color: '#4b5563' }}>{i + 1}</td>
                          <td style={{ fontFamily: 'monospace' }}>{q.query || q.term || q._id || '—'}</td>
                          <td><span className="admin-pill admin-pill--auth">{q.count || q.frequency || '—'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Users ── */}
        {activeSection === 'users' && (
          <>
            <div className="admin-page-header">
              <h1 className="admin-page-title">User Management</h1>
              <p className="admin-page-subtitle">View and manage all registered users.</p>
            </div>
            <div className="admin-table-card">
              <div className="admin-table-header">
                <div className="admin-table-title"><FiUsers style={{ marginRight: '0.4rem' }} />All Users</div>
                <input
                  className="admin-search-input"
                  type="text"
                  placeholder="Search name or email…"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  aria-label="Search users"
                />
              </div>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th></tr>
                  </thead>
                  <tbody>
                    {loading
                      ? Array.from({ length: 6 }).map((_, i) => (
                          <tr key={i}>
                            {Array.from({ length: 6 }).map((__, j) => (
                              <td key={j}><div className="admin-skeleton" style={{ height: '1rem', borderRadius: '4px' }} /></td>
                            ))}
                          </tr>
                        ))
                      : filteredUsers.length === 0
                        ? <tr><td colSpan={6}><div className="admin-empty"><div className="admin-empty-icon"><FiUsers /></div><div className="admin-empty-text">No users found.</div></div></td></tr>
                        : filteredUsers.map((u, i) => (
                            <tr key={u._id || i}>
                              <td style={{ color: '#4b5563' }}>{i + 1}</td>
                              <td style={{ fontWeight: 600, color: '#e5e7eb' }}>{u.name || '—'}</td>
                              <td style={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: '0.8rem' }}>{u.email}</td>
                              <td><span className={`admin-pill admin-pill--${u.role === 'admin' ? 'admin' : 'user'}`}>{u.role || 'user'}</span></td>
                              <td><span className={`admin-pill admin-pill--${u.isActive !== false ? 'active' : 'inactive'}`}>{u.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                              <td style={{ color: '#6b7280' }}>{formatDate(u.createdAt)}</td>
                            </tr>
                          ))
                    }
                  </tbody>
                </table>
              </div>
              <div className="admin-pagination">
                <span>{filteredUsers.length} of {users?.meta?.total ?? filteredUsers.length} users</span>
              </div>
            </div>
          </>
        )}

        {/* ── Activity Logs ── */}
        {activeSection === 'activity' && (
          <>
            <div className="admin-page-header">
              <h1 className="admin-page-title">Activity Logs</h1>
              <p className="admin-page-subtitle">Recent system activity and user action history.</p>
            </div>
            <div className="admin-table-card">
              <div className="admin-table-header">
                <div className="admin-table-title"><FiList style={{ marginRight: '0.4rem' }} />Recent Activity</div>
                <button className="admin-btn admin-btn--neutral" onClick={load}><FiRefreshCw /> Refresh</button>
              </div>
              {loading
                ? <div style={{ padding: '1.5rem' }}>{Array.from({ length: 8 }).map((_, i) => <div key={i} className="admin-skeleton" style={{ height: '2.5rem', borderRadius: '8px', marginBottom: '0.5rem' }} />)}</div>
                : (logs?.list || []).length === 0
                  ? <div className="admin-empty"><div className="admin-empty-icon"><FiActivity /></div><div className="admin-empty-text">No activity logs found.</div></div>
                  : (logs.list || []).map((log, i) => (
                      <div key={log._id || i} className="admin-log-row">
                        <span className="admin-log-time">{formatDate(log.createdAt || log.timestamp)}</span>
                        <span className="admin-log-action">{log.action || log.method || '—'}</span>
                        <span className="admin-log-resource">{log.resource || log.url || log.path || '—'}</span>
                        <span className="admin-log-user">{log.userId?.email || log.user?.email || log.userEmail || '—'}</span>
                        <span>
                          <span className={`admin-pill admin-pill--${(log.status || 200) >= 400 ? 'error' : 'auth'}`}>
                            {log.status || log.statusCode || '200'}
                          </span>
                        </span>
                      </div>
                    ))
              }
              <div className="admin-pagination">
                <span>Page {logPage}</span>
                <div className="admin-pagination-btns">
                  <button className="admin-pagination-btn" disabled={logPage <= 1} onClick={() => setLogPage(p => p - 1)}>← Prev</button>
                  <button className="admin-pagination-btn" onClick={() => setLogPage(p => p + 1)}>Next →</button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Analytics ── */}
        {activeSection === 'analytics' && (
          <>
            <div className="admin-page-header">
              <h1 className="admin-page-title">Platform Analytics</h1>
              <p className="admin-page-subtitle">Aggregated watchlist, portfolio, and search data across all users.</p>
            </div>
            <div className="admin-charts-grid">
              {['watchlist', 'portfolio'].map(key => (
                <div className="admin-chart-card" key={key}>
                  <div className="admin-chart-header">
                    <div>
                      <div className="admin-chart-title" style={{ textTransform: 'capitalize' }}>{key} Analytics</div>
                      <div className="admin-chart-subtitle">Aggregated across all users</div>
                    </div>
                  </div>
                  {loading
                    ? <div className="admin-skeleton" style={{ height: '6rem', borderRadius: '10px' }} />
                    : analytics?.[key] && typeof analytics[key] === 'object'
                      ? (
                          <div className="admin-health-card" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                            {Object.entries(analytics[key]).slice(0, 6).map(([k, v]) => (
                              <div className="admin-health-row" key={k}>
                                <span className="admin-health-key" style={{ textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                                <span className="admin-health-val">{typeof v === 'number' ? v.toLocaleString() : String(v)}</span>
                              </div>
                            ))}
                          </div>
                        )
                      : <div className="admin-empty"><div className="admin-empty-text">No {key} analytics data.</div></div>
                  }
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── System Health ── */}
        {activeSection === 'health' && (
          <>
            <div className="admin-page-header">
              <h1 className="admin-page-title">System Health</h1>
              <p className="admin-page-subtitle">Backend service status and database connectivity.</p>
            </div>
            <div className="admin-health-grid">
              <div className="admin-health-card">
                <div style={{ fontWeight: 700, color: '#e5e7eb', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                  <FiServer style={{ marginRight: '0.4rem' }} />Service Status
                </div>
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="admin-skeleton" style={{ height: '1rem', borderRadius: '4px', marginBottom: '0.6rem' }} />)
                  : (
                      <>
                        <div className="admin-health-row">
                          <span className="admin-health-key">API Server</span>
                          <span className="admin-health-val">
                            <span className="admin-status-dot admin-status-dot--connected" />Online
                          </span>
                        </div>
                        <div className="admin-health-row">
                          <span className="admin-health-key">Database</span>
                          <span className="admin-health-val">
                            <span className={`admin-status-dot admin-status-dot--${health?.database === 'connected' ? 'connected' : 'unknown'}`} />
                            {health?.database || 'Checking…'}
                          </span>
                        </div>
                        <div className="admin-health-row">
                          <span className="admin-health-key">Uptime</span>
                          <span className="admin-health-val">{health?.uptime ? `${Math.floor(health.uptime / 3600)}h ${Math.floor((health.uptime % 3600) / 60)}m` : '—'}</span>
                        </div>
                        <div className="admin-health-row">
                          <span className="admin-health-key">Environment</span>
                          <span className="admin-health-val">{health?.environment || health?.env || 'production'}</span>
                        </div>
                        <div className="admin-health-row">
                          <span className="admin-health-key">Memory Usage</span>
                          <span className="admin-health-val">{health?.memoryMB ? `${health.memoryMB} MB` : '—'}</span>
                        </div>
                      </>
                    )
                }
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Admin;
