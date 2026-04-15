import { Sun, Moon, Bell, BellOff, Globe, Shield, Zap, Info } from 'lucide-react';
import './Settings.css';

export default function Settings({ theme, toggleTheme, user }) {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Settings</h2>
        <p>Manage your preferences</p>
      </div>

      <div className="settings-grid">
        {/* Theme Toggle */}
        <div className="settings-card theme-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <h3>Appearance</h3>
              <p>Choose your preferred theme</p>
            </div>
          </div>
          <div className="theme-toggle-section">
            <button
              className={`theme-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => theme === 'dark' && toggleTheme()}
              id="theme-light-btn"
            >
              <Sun size={18} />
              <span>Light</span>
            </button>
            <button
              className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => theme === 'light' && toggleTheme()}
              id="theme-dark-btn"
            >
              <Moon size={18} />
              <span>Dark</span>
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              <Bell size={20} />
            </div>
            <div>
              <h3>Notifications</h3>
              <p>Configure alert preferences</p>
            </div>
          </div>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-item-info">
                <h4>Push Notifications</h4>
                <p>Receive alerts for security events</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked id="toggle-push" />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-item-info">
                <h4>Email Alerts</h4>
                <p>Get notified via email for critical events</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked id="toggle-email" />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-item-info">
                <h4>Sound Alerts</h4>
                <p>Play sound for incoming notifications</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" id="toggle-sound" />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              <Shield size={20} />
            </div>
            <div>
              <h3>Security</h3>
              <p>Account security settings</p>
            </div>
          </div>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-item-info">
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" id="toggle-2fa" />
                <span className="toggle-slider" />
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-item-info">
                <h4>Session Timeout</h4>
                <p>Auto-logout after inactivity</p>
              </div>
              <select className="settings-select" id="session-timeout" defaultValue="30">
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              <Info size={20} />
            </div>
            <div>
              <h3>Profile</h3>
              <p>Your account information</p>
            </div>
          </div>
          <div className="settings-list">
            <div className="setting-item readonly">
              <span className="setting-label">Name</span>
              <span className="setting-value">{user?.name || 'User'}</span>
            </div>
            <div className="setting-item readonly">
              <span className="setting-label">Email</span>
              <span className="setting-value">{user?.email || 'user@sentraai.com'}</span>
            </div>
            <div className="setting-item readonly">
              <span className="setting-label">Role</span>
              <span className="setting-value capitalize">{user?.role || 'admin'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
