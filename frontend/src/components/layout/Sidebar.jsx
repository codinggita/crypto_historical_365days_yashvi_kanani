import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
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
  { to: '/dashboard',  label: 'Dashboard',  icon: LayoutGrid },
  { to: '/coins',      label: 'Coins',       icon: Coins },
  { to: '/analytics',  label: 'Analytics',   icon: TrendingUp },
  { to: '/watchlist',  label: 'Watchlist',   icon: Bookmark },
  { to: '/portfolio',  label: 'Portfolio',   icon: Briefcase },
  { to: '/profile',    label: 'Profile',     icon: User },
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
            <Hexagon size={18} className="animate-pulse" />
          </div>
          <span className="sidebar-logo-text title-gradient">CryptoVerseX</span>
          
          {/* Close button on mobile */}
          <button 
            onClick={closeSidebar} 
            className="navbar-hamburger" 
            style={{ display: 'none', marginLeft: 'auto', padding: '0.2rem' }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Primary navigation">
          <span className="sidebar-section-label">Main Menu</span>
          {NAV_LINKS.map(({ to, label, icon: IconComponent }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `sidebar-link${isActive ? ' active' : ''}`
              }
              aria-label={label}
            >
              {({ isActive }) => (
                <>
                  <motion.span 
                    className="sidebar-link-icon" 
                    aria-hidden="true"
                    whileHover={{ scale: 1.12, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <IconComponent size={18} color={isActive ? "#00e5ff" : undefined} />
                  </motion.span>
                  {label}
                  {isActive && (
                    <motion.div 
                      layoutId="activeGlow" 
                      className="absolute inset-0 w-full h-full rounded-xl"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0, 229, 255, 0.04)',
                        border: '1px solid rgba(0, 229, 255, 0.12)',
                        zIndex: -1,
                        pointerEvents: 'none'
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Admin link — visible only to admins */}
          {user?.role === 'admin' && (
            <>
              <span className="sidebar-section-label" style={{ marginTop: '1.25rem' }}>Admin</span>
              <NavLink
                to="/admin"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `sidebar-link sidebar-link--admin${isActive ? ' active' : ''}`
                }
                aria-label="Admin Panel"
              >
                {({ isActive }) => (
                  <>
                    <motion.span 
                      className="sidebar-link-icon" 
                      aria-hidden="true"
                      whileHover={{ scale: 1.12, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <Shield size={18} color={isActive ? "#00e5ff" : undefined} />
                    </motion.span>
                    Admin Panel
                    {isActive && (
                      <motion.div 
                        layoutId="activeGlow" 
                        className="absolute inset-0 w-full h-full rounded-xl"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0, 229, 255, 0.04)',
                          border: '1px solid rgba(0, 229, 255, 0.12)',
                          zIndex: -1,
                          pointerEvents: 'none'
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </>
          )}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <motion.button
            className="sidebar-logout-btn"
            onClick={handleLogout}
            aria-label="Log out"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="sidebar-link-icon" aria-hidden="true">
              <LogOut size={18} />
            </span>
            Logout
          </motion.button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
