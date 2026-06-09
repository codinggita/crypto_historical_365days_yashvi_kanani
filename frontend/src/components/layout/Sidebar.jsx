import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  FiGrid,
  FiBarChart2,
  FiDollarSign,
  FiBookmark,
  FiPieChart,
  FiUser,
  FiLogOut,
  FiLayers,
} from 'react-icons/fi';
import { setSidebarOpen } from '../../redux/slices/uiSlice';
import { logout } from '../../redux/slices/authSlice';
import authService from '../../services/auth.service';

const NAV_LINKS = [
  { to: '/dashboard',  label: 'Dashboard',  icon: <FiGrid /> },
  { to: '/coins',      label: 'Coins',       icon: <FiDollarSign /> },
  { to: '/analytics',  label: 'Analytics',   icon: <FiBarChart2 /> },
  { to: '/stats',      label: 'Statistics',  icon: <FiPieChart /> },
  { to: '/watchlist',  label: 'Watchlist',   icon: <FiBookmark /> },
  { to: '/profile',    label: 'Profile',     icon: <FiUser /> },
];

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

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
      {/* Overlay (mobile) */}
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
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <FiLayers size={16} />
          </div>
          <span className="sidebar-logo-text">CryptoVerseX</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Primary navigation">
          <span className="sidebar-section-label">Main Menu</span>
          {NAV_LINKS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `sidebar-link${isActive ? ' active' : ''}`
              }
              aria-label={label}
            >
              <span className="sidebar-link-icon" aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button
            className="sidebar-logout-btn"
            onClick={handleLogout}
            aria-label="Log out"
          >
            <span className="sidebar-link-icon" aria-hidden="true"><FiLogOut /></span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
