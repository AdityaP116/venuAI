import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Role → their dashboard URL
const ROLE_DASHBOARDS = {
  admin: '/admin/dashboard',
  guard: '/guard/dashboard',
  resident: '/resident/dashboard',
};

/**
 * ProtectedRoute — wraps role-gated pages.
 *
 * Props:
 *   allowedRole  — 'admin' | 'guard' | 'resident'
 *   children     — the page to render
 *   loginPath    — where to redirect if unauthenticated
 */
export default function ProtectedRoute({ allowedRole, loginPath, children }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#0a0a0f', color: '#8b5cf6',
        fontSize: '1rem', flexDirection: 'column', gap: '1rem'
      }}>
        <div style={{
          width: 40, height: 40, border: '3px solid #8b5cf620',
          borderTop: '3px solid #8b5cf6', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span>Verifying access…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not authenticated at all
  if (!user) {
    return <Navigate to={loginPath || '/'} replace />;
  }

  // Authenticated but wrong role — redirect to own dashboard
  if (role !== allowedRole) {
    const correctDashboard = ROLE_DASHBOARDS[role] || '/';
    return <Navigate to={correctDashboard} replace />;
  }

  return children;
}
