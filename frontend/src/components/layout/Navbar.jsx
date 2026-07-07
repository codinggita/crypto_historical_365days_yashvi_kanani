import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Clock,
} from 'lucide-react';
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

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

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  const formatDate = (date) =>
    date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <header className="navbar" role="banner">
      <button
        className="navbar-hamburger"
        onClick={() => dispatch(toggleSidebar())}
        aria-label="Toggle navigation menu"
        aria-expanded={false}
      >
        <Menu size={20} />
      </button>

      <div className="navbar-search" role="search">
        <div className="navbar-search-inner">
          <Search className="navbar-search-icon" aria-hidden="true" size={16} />
          <input
            id="navbar-search"
            type="search"
            className="navbar-search-input"
            placeholder="Search assets, analytics…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search cryptocurrencies"
          />
        </div>
      </div>

      <div className="navbar-market-status" title="Crypto Markets Connection Status">
        <span className="market-dot" />
        <span>Live Trading</span>
      </div>

      <div className="navbar-clock" title="System Time (UTC+05:30)">
        <Clock size={12} className="text-muted" />
        <span>{formatDate(currentTime)} • {formatTime(currentTime)}</span>
      </div>

      <div className="navbar-actions">
        <button
          className="navbar-icon-btn"
          onClick={handleThemeToggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="navbar-icon-btn"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="navbar-notif-dot" aria-hidden="true" />
        </button>

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
            <ChevronDown
              size={14}
              style={{
                color: 'var(--text-muted)',
                transition: 'transform 0.3s',
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
              aria-hidden="true"
            />
          </button>

          {dropdownOpen && (
            <div className="navbar-dropdown navbar-dropdown--open" role="menu">
              <div style={{ padding: '0.5rem 0.85rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Signed in as</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
              </div>

              <Link
                to="/profile"
                className="navbar-dropdown-item"
                role="menuitem"
                onClick={() => setDropdownOpen(false)}
              >
                <User size={14} aria-hidden="true" />
                Profile
              </Link>
              <Link
                to="/profile"
                className="navbar-dropdown-item"
                role="menuitem"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings size={14} aria-hidden="true" />
                Settings
              </Link>
              <div className="navbar-dropdown-divider" role="separator" />
              <button
                className="navbar-dropdown-item danger"
                role="menuitem"
                onClick={handleLogout}
              >
                <LogOut size={14} aria-hidden="true" />
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
