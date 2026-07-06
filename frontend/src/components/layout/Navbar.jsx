import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  FiMenu,
  FiSearch,
  FiSun,
  FiMoon,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
} from 'react-icons/fi';
import { toggleSidebar, changeTheme } from '../../redux/slices/uiSlice';
import { logout } from '../../redux/slices/authSlice';
import authService from '../../services/auth.service';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleThemeToggle = () => {
    dispatch(changeTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    try { await authService.logout(); } catch (_) {}
    localStorage.removeItem('token');
    dispatch(logout());
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  // Build avatar initials from user name or email
  const getInitials = () => {
    if (user?.name && typeof user.name === 'string') {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const displayName = user?.name || user?.email || 'User';

  return (
    <header className="navbar" role="banner">
      {/* Hamburger — mobile only */}
      <button
        className="navbar-hamburger"
        onClick={() => dispatch(toggleSidebar())}
        aria-label="Toggle navigation menu"
        aria-expanded={false}
      >
        <FiMenu />
      </button>

      {/* Search bar */}
      <div className="navbar-search" role="search">
        <div className="navbar-search-inner">
          <FiSearch className="navbar-search-icon" aria-hidden="true" />
          <input
            id="navbar-search"
            type="search"
            className="navbar-search-input"
            placeholder="Search coins, markets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search cryptocurrencies"
          />
        </div>
      </div>

      {/* Right-side actions */}
      <div className="navbar-actions">
        {/* Theme toggle */}
        <button
          className="navbar-icon-btn"
          onClick={handleThemeToggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>

        {/* Notification */}
        <button
          className="navbar-icon-btn"
          aria-label="Notifications"
          title="Notifications"
        >
          <FiBell />
          <span className="navbar-notif-dot" aria-hidden="true" />
        </button>

        {/* Profile dropdown */}
        <div className="navbar-profile" ref={dropdownRef}>
          <button
            className="navbar-avatar-btn"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-label="User menu"
          >
            <div className="navbar-avatar" aria-hidden="true">
              {getInitials()}
            </div>
            <span className="navbar-avatar-name">{displayName}</span>
            <FiChevronDown
              size={14}
              style={{
                color: 'var(--text-muted-layout)',
                transition: 'transform 0.2s',
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
              aria-hidden="true"
            />
          </button>

          {dropdownOpen && (
            <div className="navbar-dropdown" role="menu">
              <Link
                to="/profile"
                className="navbar-dropdown-item"
                role="menuitem"
                onClick={() => setDropdownOpen(false)}
              >
                <FiUser size={15} aria-hidden="true" />
                Profile
              </Link>
              <Link
                to="/profile"
                className="navbar-dropdown-item"
                role="menuitem"
                onClick={() => setDropdownOpen(false)}
              >
                <FiSettings size={15} aria-hidden="true" />
                Settings
              </Link>
              <div className="navbar-dropdown-divider" role="separator" />
              <button
                className="navbar-dropdown-item danger"
                role="menuitem"
                onClick={handleLogout}
              >
                <FiLogOut size={15} aria-hidden="true" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
