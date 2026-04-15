import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Fingerprint, Scan, Radio, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './GuardLogin.css';
import '../GoogleAuth.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const GoogleIcon = () => (
  <svg className="google-icon" width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function GuardLogin() {
  const navigate = useNavigate();
  const { loginWithGoogle, logout, getIdToken, user, role, loading, authError } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      if (role === 'guard') {
        // Auto-start shift when guard logs in
        getIdToken().then(token => {
          fetch(`${API}/api/shifts/start`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => {}); // silent — shift may already be active
        });
        navigate('/guard/dashboard', { replace: true });
      } else {
        setLocalError(`Access Denied: This account is registered as a ${role.toUpperCase()}. Please use the correct portal or sign in with a different account.`);
        logout();
      }
    }
  }, [user, role, loading, navigate, getIdToken, logout]);

  const handleGoogleLogin = async () => {
    setLocalError('');
    setSigningIn(true);
    try {
      await loginWithGoogle('guard');
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
    (authError === 'no_user_record' ? 'Your Google account is not registered as a guard. Contact your administrator.' : '') ||
    (authError === 'google_sign_in_failed' ? 'Google sign-in failed. Please try again.' : '') ||
    (authError === 'fetch_error' ? 'Could not connect to server. Make sure the server is running.' : '') ||
    (authError ? `Error: ${authError}` : '');

  return (
    <div className="guard-login-page">
      <div className="guard-login-bg">
        <div className="guard-login-grid" />
        <div className="guard-orb guard-orb-1" />
        <div className="guard-orb guard-orb-2" />
        <div className="guard-orb guard-orb-3" />
        <div className="guard-scanline" />
      </div>

      <div className="guard-login-container">
        {/* Left panel */}
        <div className="guard-branding">
          <div className="guard-branding-content">
            <div className="guard-brand-logo">
              <div className="guard-brand-icon">
                <Zap size={32} />
              </div>
              <div>
                <h1>SentraAI</h1>
                <span className="guard-brand-badge">Guard Station</span>
              </div>
            </div>
            <p className="guard-brand-tagline">
              Verify visitors &amp; control access points
            </p>
            <div className="guard-brand-features">
              <div className="guard-brand-feature">
                <Fingerprint size={20} />
                <span>Face Verification</span>
              </div>
              <div className="guard-brand-feature">
                <Scan size={20} />
                <span>Gate Control</span>
              </div>
              <div className="guard-brand-feature">
                <Radio size={20} />
                <span>Instant Alerts</span>
              </div>
            </div>
            <div className="guard-brand-stats">
              <div className="guard-brand-stat">
                <span className="guard-stat-number">99.7%</span>
                <span className="guard-stat-label">Face Match</span>
              </div>
              <div className="guard-brand-stat">
                <span className="guard-stat-number">{'< 2s'}</span>
                <span className="guard-stat-label">Verify</span>
              </div>
              <div className="guard-brand-stat">
                <span className="guard-stat-number">Live</span>
                <span className="guard-stat-label">Feed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="guard-form-panel">
          <div className="guard-form-container">
            <div className="guard-form-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '10px',
                  background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Fingerprint size={20} color="#fff" />
                </div>
              </div>
              <h2>Guard Sign In</h2>
              <p>Access the security station</p>
            </div>

            {displayError && (
              <div className="auth-access-denied">
                <strong><AlertTriangle size={14} /> Access Denied</strong>
                <p>{displayError}</p>
              </div>
            )}

            <div className="auth-redirect-notice" style={{ borderColor: 'rgba(6, 182, 212, 0.3)', background: 'rgba(6, 182, 212, 0.08)' }}>
              <Shield size={14} color="#06b6d4" />
              <span>Secured with Firebase Authentication + Google OAuth 2.0</span>
            </div>

            <div className="auth-divider">
              <span>Sign in to continue</span>
            </div>

            <button
              id="guard-google-signin"
              className="google-signin-btn"
              onClick={handleGoogleLogin}
              disabled={signingIn || loading}
            >
              {signingIn ? <div className="google-btn-spinner" /> : <GoogleIcon />}
              <span>{signingIn ? 'Signing in…' : 'Continue with Google'}</span>
            </button>

            <div className="guard-back-link">
              <button onClick={() => navigate('/')} className="guard-back-btn" id="guard-back-gateway">
                ← Back to portal selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
