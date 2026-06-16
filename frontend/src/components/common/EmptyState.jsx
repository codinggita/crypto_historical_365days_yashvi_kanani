import React from 'react';
import { FiBriefcase, FiBookmark, FiSearch, FiBarChart2, FiInbox } from 'react-icons/fi';

/* Configurable Base EmptyState Component */
export function EmptyState({
  icon: Icon = FiInbox,
  title = 'No Data Available',
  description = 'There is currently no information to display here.',
  actionLabel,
  onActionClick,
  actionIcon: ActionIcon,
  style = {},
}) {
  return (
    <div
      className="empty-state-panel"
      role="status"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        background: 'rgba(255, 255, 255, 0.01)',
        backdropFilter: 'blur(12px)',
        border: '1px dashed rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        textAlign: 'center',
        gap: '1.25rem',
        ...style,
      }}
    >
      <div
        className="empty-state-icon-wrapper"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          color: 'var(--color-primary, #6366f1)',
          fontSize: '2rem',
        }}
      >
        <Icon aria-hidden="true" />
      </div>
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: '#f3f4f6' }}>{title}</h3>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af', maxWidth: '380px', margin: 0 }}>{description}</p>
      </div>
      {actionLabel && onActionClick && (
        <button
          className="btn-primary"
          onClick={onActionClick}
          aria-label={actionLabel}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.25rem',
          }}
        >
          {ActionIcon && <ActionIcon />}
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/* Preset: Watchlist / Bookmarks */
export function NoBookmarks({
  title = 'Watchlist is Empty',
  description = 'Explore cryptocurrencies and bookmark them to keep track of their price changes here.',
  actionLabel = 'Explore Coins',
  onActionClick,
}) {
  return (
    <EmptyState
      icon={FiBookmark}
      title={title}
      description={description}
      actionLabel={actionLabel}
      onActionClick={onActionClick}
      actionIcon={FiSearch}
    />
  );
}

/* Preset: Portfolio Simulator */
export function NoPortfolio({
  title = 'No Investments Simulated Yet',
  description = 'Add virtual holdings or simulate investments with custom quantities to start tracking performance.',
  actionLabel = 'Add Asset to Portfolio',
  onActionClick,
}) {
  return (
    <EmptyState
      icon={FiBriefcase}
      title={title}
      description={description}
      actionLabel={actionLabel}
      onActionClick={onActionClick}
      actionIcon={FiBriefcase}
    />
  );
}

/* Preset: Search/Filter Results */
export function NoResults({
  title = 'No Search Results Found',
  description = 'We couldn\'t find any coins matching your filters or search query. Try resetting filters or adjusting terms.',
  actionLabel = 'Reset All Filters',
  onActionClick,
}) {
  return (
    <EmptyState
      icon={FiSearch}
      title={title}
      description={description}
      actionLabel={actionLabel}
      onActionClick={onActionClick}
    />
  );
}

/* Preset: Analytics Available */
export function NoAnalytics({
  title = 'No Analytics Data Available',
  description = 'Select a valid currency asset or expand your date range filters to view predictive charts and tables.',
}) {
  return (
    <EmptyState
      icon={FiBarChart2}
      title={title}
      description={description}
    />
  );
}

export default EmptyState;
