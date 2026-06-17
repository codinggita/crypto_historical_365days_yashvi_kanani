import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiBarChart2, FiCompass } from 'react-icons/fi';
import '../../styles/notFound.css';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page" role="main" aria-label="Page not found">
      <div className="notfound-bg" />
      <div className="notfound-content">
        <div className="notfound-code" aria-hidden="true">404</div>

        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-subtitle">
          The page you are looking for doesn&apos;t exist or has been moved.
          Try navigating back or return to the home page.
        </p>

        <div className="notfound-actions">
          <Link to="/" className="notfound-btn-primary">
            <FiHome /> Back to Home
          </Link>
          <button
            className="notfound-btn-secondary"
            onClick={() => navigate(-1)}
            aria-label="Go back to previous page"
          >
            <FiArrowLeft /> Go Back
          </button>
        </div>

        <nav className="notfound-links" aria-label="Helpful links">
          <Link to="/dashboard" className="notfound-link"><FiBarChart2 style={{ marginRight: 4 }} />Dashboard</Link>
          <Link to="/coins" className="notfound-link"><FiCompass style={{ marginRight: 4 }} />Coins</Link>
          <Link to="/analytics" className="notfound-link">Analytics</Link>
          <Link to="/portfolio" className="notfound-link">Portfolio</Link>
          <Link to="/watchlist" className="notfound-link">Watchlist</Link>
        </nav>
      </div>
    </div>
  );
}

export default NotFound;
