import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, Lock, BarChart3, Users, Settings, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';
import '../GoogleAuth.css';

// Google SVG icon
const GoogleIcon = () => (
  <svg className="google-icon" width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginWithGoogle, logout, user, role, loading, authError } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [localError, setLocalError] = useState('');

  // Already logged in as admin → redirect
  useEffect(() => {
    if (!loading && user) {
      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setLocalError(`Access Denied: This account is registered as a ${role.toUpperCase()}. Please use the correct portal or sign in with a different account.`);
        logout();
      }
    }
  }, [user, role, loading, navigate, logout]);

  const handleGoogleLogin = async () => {
    setLocalError('');
    setSigningIn(true);
    try {
      await loginWithGoogle('admin');
      // Navigation handled by useEffect once role confirmed
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setLocalError('Sign-in popup was closed. Please try again.');
      } else {
        setLocalError('Sign-in failed. Please try again.');
      }
    } finally {
      setSigningIn(false);
    }
  };

  const displayError = localError ||
    (authError === 'no_user_record' ? 'Your Google account does not have admin access. Contact your system administrator.' : '') ||
    (authError === 'google_sign_in_failed' ? 'Google sign-in failed. Please try again.' : '') ||
    (authError === 'fetch_error' ? 'Could not connect to server. Make sure the server is running.' : '') ||
    (authError ? `Error: ${authError}` : '');

  return (
    <div className="admin-login-page">
      {/* Animated background */}
      <div className="admin-login-bg">
        <div className="admin-login-grid" />
        <div className="admin-orb admin-orb-1" />
        <div className="admin-orb admin-orb-2" />
        <div className="admin-orb admin-orb-3" />
      </div>

      <div className="admin-login-container">
        {/* Left panel — Branding */}
        <div className="admin-branding">
          <div className="admin-branding-content">
            <div className="admin-brand-logo">
              <div className="admin-brand-icon">
                <Zap size={32} />
              </div>
              <div>
                <h1>SentraAI</h1>
                <span className="admin-brand-badge">Command Center</span>
              </div>
            </div>
            <p className="admin-brand-tagline">
              Full system control &amp; security management
            </p>
            <div className="admin-brand-features">
              <div className="admin-brand-feature">
                <Settings size={20} />
                <span>System Management</span>
              </div>
              <div className="admin-brand-feature">
                <BarChart3 size={20} />
                <span>Analytics Dashboard</span>
              </div>
              <div className="admin-brand-feature">
                <Users size={20} />
                <span>User Administration</span>
              </div>
            </div>
            <div className="admin-brand-stats">
              <div className="admin-brand-stat">
                <span className="admin-stat-number">99.7%</span>
                <span className="admin-stat-label">Uptime</span>
              </div>
              <div className="admin-brand-stat">
                <span className="admin-stat-number">{'< 2s'}</span>
                <span className="admin-stat-label">Response</span>
              </div>
              <div className="admin-brand-stat">
                <span className="admin-stat-number">24/7</span>
                <span className="admin-stat-label">Monitoring</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — Login Form */}
        <div className="admin-form-panel">
          <div className="admin-form-container">
            <div className="admin-form-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '10px',
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Lock size={20} color="#fff" />
                </div>
              </div>
              <h2>Admin Sign In</h2>
              <p>Access the command center dashboard</p>
            </div>

            {/* Error / Access Denied */}
            {displayError && (
              <div className="auth-access-denied">
                <strong><AlertTriangle size={14} /> Access Denied</strong>
                <p>{displayError}</p>
              </div>
            )}

            {/* Secure badge */}
            <div className="auth-redirect-notice" style={{ borderColor: 'rgba(139, 92, 246, 0.3)', background: 'rgba(139, 92, 246, 0.08)' }}>
              <Shield size={14} color="#8b5cf6" />
              <span>Secured with Firebase Authentication + Google OAuth 2.0</span>
            </div>

            <div className="auth-divider">
              <span>Sign in to continue</span>
            </div>

            {/* Google Sign-In button */}
            <button
              id="admin-google-signin"
              className="google-signin-btn"
              onClick={handleGoogleLogin}
              disabled={signingIn || loading}
            >
              {signingIn ? (
                <div className="google-btn-spinner" />
              ) : (
                <GoogleIcon />
              )}
              <span>{signingIn ? 'Signing in…' : 'Continue with Google'}</span>
            </button>

            <div className="admin-back-link">
              <button
                onClick={() => navigate('/')}
                className="admin-back-btn"
                id="admin-back-gateway"
              >
                ← Back to portal selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
