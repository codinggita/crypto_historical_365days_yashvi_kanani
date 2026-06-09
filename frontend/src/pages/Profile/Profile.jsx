import React from 'react';
import { useSelector } from 'react-redux';
import { FiUser, FiMail, FiCalendar, FiShield } from 'react-icons/fi';

function Profile() {
  const { user } = useSelector((state) => state.auth);

  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const displayName = user?.name || 'User';
  const emailAddress = user?.email || 'N/A';

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account preferences, configurations, and security settings.</p>
      </div>
      <div className="shell-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--card-border)' }}>
          <div className="navbar-avatar" style={{ width: '4rem', height: '4rem', fontSize: '1.5rem', borderRadius: '12px' }}>
            {getInitials()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)' }}>{displayName}</h2>
            <p style={{ color: 'var(--text-muted-layout)', fontSize: '0.9rem' }}>Member since June 2026</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="stat-card-icon indigo" style={{ width: '2rem', height: '2rem', fontSize: '1rem', flexShrink: 0 }}>
              <FiUser />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted-layout)', textTransform: 'uppercase' }}>Full Name</div>
              <div style={{ color: 'var(--text-heading)', fontWeight: 600 }}>{displayName}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="stat-card-icon green" style={{ width: '2rem', height: '2rem', fontSize: '1rem', flexShrink: 0 }}>
              <FiMail />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted-layout)', textTransform: 'uppercase' }}>Email Address</div>
              <div style={{ color: 'var(--text-heading)', fontWeight: 600 }}>{emailAddress}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="stat-card-icon amber" style={{ width: '2rem', height: '2rem', fontSize: '1rem', flexShrink: 0 }}>
              <FiCalendar />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted-layout)', textTransform: 'uppercase' }}>Joined Date</div>
              <div style={{ color: 'var(--text-heading)', fontWeight: 600 }}>June 9, 2026</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="stat-card-icon purple" style={{ width: '2rem', height: '2rem', fontSize: '1rem', flexShrink: 0 }}>
              <FiShield />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted-layout)', textTransform: 'uppercase' }}>Account Security</div>
              <div style={{ color: 'var(--text-heading)', fontWeight: 600 }}>Developer Access Role</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

