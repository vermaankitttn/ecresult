import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar = ({ activeTab, countdown, refreshCount, totalCandidates, onTabChange, loading, error, lastRefresh, onRefresh, isCollapsed, onToggleCollapse }) => {
  const toggleSidebar = () => {
    onToggleCollapse(!isCollapsed);
  };

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        <h3>⚙️ Configuration</h3>
        <button 
          className={styles.sidebarToggleButton}
          onClick={toggleSidebar}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? '▶️' : '◀️'}
        </button>
      </div>
      
      <div className={styles.sidebarContent}>
        <div className={styles.sidebarSection}>
          <h4>🎥 Projector Mode</h4>
          <div className={`${styles.statusIndicator} ${styles.connected}`}>
            ✅ Enabled
          </div>
        </div>
        
        <div className={styles.sidebarSection}>
          <h4>🔗 Google Sheets Connection</h4>
          {loading ? (
            <div className={`${styles.statusIndicator} ${styles.loading}`}>
              ⏳ Loading data...
            </div>
          ) : error ? (
            <div className={`${styles.statusIndicator} ${styles.disconnected}`}>
              ❌ Connection Error
              <div style={{fontSize: '0.8em', marginTop: '5px'}}>
                {error.length > 50 ? error.substring(0, 50) + '...' : error}
              </div>
            </div>
          ) : (
            <div className={`${styles.statusIndicator} ${styles.connected}`}>
              ✅ Connected to Google Sheets
            </div>
          )}
          <p>📊 <strong>Total Candidates:</strong> {totalCandidates}</p>
          <p>🏆 <strong>Top 10 by Value:</strong> 10 candidates</p>
          <p>📊 <strong>Remaining by Value:</strong> {Math.max(0, totalCandidates - 10)} candidates</p>
          {lastRefresh && (
            <p>🕒 <strong>Last Updated:</strong> {new Date(lastRefresh).toLocaleTimeString()}</p>
          )}
        </div>
        
        <div className={styles.sidebarSection}>
          <h4>🔄 Tab Switching Status</h4>
          <p><strong>Current tab:</strong> {activeTab === 0 ? '🏆 Top 10' : '📊 Remaining'}</p>
          
          <div className={styles.countdownTimer}>
            ⏱️ Next switch in: {countdown} seconds
          </div>
          
          <div className={styles.tabButtons}>
            <button 
              className={`${styles.tabButton} ${activeTab === 0 ? styles.active : ''}`}
              onClick={() => onTabChange(0)}
            >
              🏆 Show Top 10
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 1 ? styles.active : ''}`}
              onClick={() => onTabChange(1)}
            >
              📊 Show Remaining
            </button>
          </div>
        </div>
        
        <div className={styles.sidebarSection}>
          <h4>📊 Refresh Status</h4>
          <p>🔄 <strong>Refresh count:</strong> {refreshCount}</p>
          <p>⏰ <strong>Auto-refresh:</strong> Every 1 minute</p>
          <button className={styles.refreshButton} onClick={onRefresh} disabled={loading}>
            {loading ? '⏳ Loading...' : '🔄 Refresh Data'}
          </button>
        </div>
        
        <div className={styles.sidebarSection}>
          <h4>🔍 Debug Info</h4>
          <p>Active tab: {activeTab}</p>
          <p>Countdown: {countdown}s</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;