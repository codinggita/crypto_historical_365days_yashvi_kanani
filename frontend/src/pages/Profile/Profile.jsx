import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Lock, 
  Bell, 
  Key,
  CheckCircle,
  Activity,
  CreditCard
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const TIMELINE_EVENTS = [
  { action: 'User session verified (JWT Token)', date: 'Today at 10:30 AM', status: 'success' },
  { action: 'Watchlist synchronized with MongoDB', date: 'Yesterday at 08:15 PM', status: 'info' },
  { action: 'Dev privileges initialized', date: 'July 6, 2026', status: 'warning' },
  { action: 'Account created successfully', date: 'June 9, 2026', status: 'success' },
];

function Profile() {
  const { user } = useSelector((state) => state.auth);
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  });

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

  const displayName = user?.name || 'Explorer';
  const emailAddress = user?.email || 'N/A';
  const joinedDate = 'June 9, 2026';

  const handleUpdateSettings = (e) => {
    e.preventDefault();
    toast.success('Security settings saved successfully!');
    setProfileForm(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title"><span className="title-gradient">My Account</span></h1>
        <p className="page-subtitle">Manage your account preferences, configurations, and security settings.</p>
      </div>

      {/* Profile Overview Banner */}
      <motion.div 
        className="content-card"
        variants={itemVariants}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', padding: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="navbar-avatar" style={{ width: '4.5rem', height: '4.5rem', fontSize: '1.75rem', borderRadius: '16px', background: 'linear-gradient(135deg, #00e5ff 0%, #38bdf8 100%)', color: '#050816', boxShadow: '0 0 20px rgba(0, 229, 255, 0.25)' }}>
            {getInitials()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{displayName}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} /> Joined {joinedDate}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Status</div>
            <div style={{ color: 'var(--color-success)', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <CheckCircle size={14} /> Shield Active
            </div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Access Level</div>
            <div style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '1.1rem' }}>Developer</div>
          </div>
        </div>
      </motion.div>

      {/* Two Column Grid */}
      <div className="content-grid">
        {/* Profile Details & Security Form */}
        <motion.div className="content-card" variants={itemVariants}>
          <h3 className="content-card-title">
            <Shield size={18} className="text-primary" />
            Security &amp; Preferences
          </h3>

          <form onSubmit={handleUpdateSettings} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <div className="form-input-container">
                <input
                  id="profile-name"
                  type="text"
                  className="form-input"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">Email Address</label>
              <div className="form-input-container">
                <input
                  id="profile-email"
                  type="email"
                  className="form-input"
                  value={profileForm.email}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '1rem 0' }} />

            <div className="form-group">
              <label className="form-label" htmlFor="current-pw">Current Password</label>
              <div className="form-input-container">
                <input
                  id="current-pw"
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                  value={profileForm.currentPassword}
                  onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="new-pw">New Password</label>
              <div className="form-input-container">
                <input
                  id="new-pw"
                  type="password"
                  placeholder="At least 6 characters"
                  className="form-input"
                  value={profileForm.newPassword}
                  onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                />
              </div>
            </div>

            <motion.button 
              type="submit" 
              className="btn-submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ marginTop: '0.5rem' }}
            >
              Update Credentials
            </motion.button>
          </form>
        </motion.div>

        {/* Security Timeline */}
        <motion.div className="content-card" variants={itemVariants}>
          <h3 className="content-card-title">
            <Activity size={18} className="text-primary" />
            Security Activity Log
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem 0' }}>
            {TIMELINE_EVENTS.map((event, idx) => {
              const indicatorColor = event.status === 'success' ? '#00ff9d' : event.status === 'warning' ? '#ffc857' : '#38bdf8';
              
              return (
                <div key={idx} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                  {/* Timeline track line */}
                  {idx !== TIMELINE_EVENTS.length - 1 && (
                    <div style={{ position: 'absolute', left: '7px', top: '16px', bottom: '-20px', width: '2px', background: 'rgba(255,255,255,0.06)' }} />
                  )}

                  {/* Status dot indicator */}
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(5, 8, 22, 1)', border: `3px solid ${indicatorColor}`, boxShadow: `0 0 10px ${indicatorColor}`, flexShrink: 0, marginTop: '2px', zIndex: 2 }} />

                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>{event.action}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{event.date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Profile;
