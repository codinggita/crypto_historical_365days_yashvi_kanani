import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  LayoutGrid,
  Coins,
  TrendingUp,
  Bookmark,
  Briefcase,
  User,
  LogOut,
  Hexagon,
  Shield,
  X
} from 'lucide-react';
import { setSidebarOpen } from '../../redux/slices/uiSlice';
import { logout } from '../../redux/slices/authSlice';
import authService from '../../services/auth.service';

const NAV_LINKS = [
  { to: '/dashboard',  label: 'Dashboard',  icon: LayoutGrid, prefetch: () => import('../../pages/Dashboard/Dashboard') },
  { to: '/coins',      label: 'Coins',       icon: Coins, prefetch: () => import('../../pages/Coins/Coins') },
  { to: '/analytics',  label: 'Analytics',   icon: TrendingUp, prefetch: () => import('../../pages/Analytics/Analytics') },
  { to: '/watchlist',  label: 'Watchlist',   icon: Bookmark, prefetch: () => import('../../pages/Watchlist/Watchlist') },
  { to: '/portfolio',  label: 'Portfolio',   icon: Briefcase, prefetch: () => import('../../pages/Portfolio/Portfolio') },
  { to: '/profile',    label: 'Profile',     icon: User, prefetch: () => import('../../pages/Profile/Profile') },
];

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const user = useSelector((state) => state.auth.user);

  const closeSidebar = () => dispatch(setSidebarOpen(false));

  const handleLogout = async () => {
    try { await authService.logout(); } catch (_) {}
    localStorage.removeItem('token');
    dispatch(logout());
    closeSidebar();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar${sidebarOpen ? ' sidebar-open' : ''}`}
        aria-label="Main navigation"
      >
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Hexagon size={18} className="animate-pulse" />
          </div>
          <span className="sidebar-logo-text title-gradient">CryptoVerseX</span>

          <button
            onClick={closeSidebar}
            className="navbar-hamburger"
            style={{ display: 'none', marginLeft: 'auto', padding: '0.2rem' }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          <span className="sidebar-section-label">Main Menu</span>
          {NAV_LINKS.map(({ to, label, icon: IconComponent, prefetch }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeSidebar}
              onMouseEnter={() => prefetch?.()}
              className={({ isActive }) =>
                `sidebar-link${isActive ? ' active' : ''}`
              }
              aria-label={label}
            >
              {({ isActive }) => (
                <>
                  <span className="sidebar-link-icon" aria-hidden="true">
                    <IconComponent size={18} color={isActive ? '#00e5ff' : undefined} />
                  </span>
                  {label}
                  {isActive && (
                    <div
                      className="sidebar-active-glow"
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <>
              <span className="sidebar-section-label" style={{ marginTop: '1.25rem' }}>Admin</span>
              <NavLink
                to="/admin"
                onClick={closeSidebar}
                onMouseEnter={() => import('../../pages/Admin/Admin')}
                className={({ isActive }) =>
                  `sidebar-link sidebar-link--admin${isActive ? ' active' : ''}`
                }
                aria-label="Admin Panel"
              >
                {({ isActive }) => (
                  <>
                    <span className="sidebar-link-icon" aria-hidden="true">
                      <Shield size={18} color={isActive ? '#00e5ff' : undefined} />
                    </span>
                    Admin Panel
                    {isActive && (
                      <div className="sidebar-active-glow" aria-hidden="true" />
                    )}
                  </>
                )}
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button
            className="sidebar-logout-btn"
            onClick={handleLogout}
            aria-label="Log out"
          >
            <span className="sidebar-link-icon" aria-hidden="true">
              <LogOut size={18} />
            </span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
