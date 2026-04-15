import { useState, useEffect, useCallback } from 'react';
import {
  Bell, AlertTriangle, Shield, CheckCircle, XCircle, Clock,
  MapPin, User, BellRing, AlertOctagon, Volume2, RefreshCw, WifiOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Alerts.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function Alerts({ userUnit }) {
  const { getIdToken } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [emergencyResult, setEmergencyResult] = useState(null); // { ok, msg }
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const SEVERITY_ICONS = {
    '⚠️': '⚠️', '🚫': '🚫', '🔍': '🔍', '🚨': '🚨',
    '🔄': '🔄', '🎭': '🎭', '👥': '👥', '⏰': '⏰', default: '🔔'
  };

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      const res = await fetch(`${API}/api/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAlerts(data.alerts || []);
      setLastUpdated(new Date());
    } catch {
      setError('Could not reach server.');
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  // Auto-refresh every 30 seconds for "live" feel
  useEffect(() => {
    const id = setInterval(() => setLastUpdated(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAlerts().finally(() => setRefreshing(false));
  };

  const severityConfig = {
    critical: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)',  label: 'CRITICAL', icon: <AlertOctagon size={14} /> },
    high:     { color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)', label: 'HIGH',     icon: <AlertTriangle size={14} /> },
    medium:   { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', label: 'MEDIUM',   icon: <Shield size={14} /> },
    low:      { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)', label: 'LOW',      icon: <Bell size={14} /> },
  };

  const filtered = filter === 'all'      ? alerts :
    filter === 'unread'   ? alerts.filter(a => !a.read) :
    filter === 'resolved' ? alerts.filter(a => a.resolved) :
    alerts.filter(a => a.severity === filter);

  const unreadCount   = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.resolved).length;

  const markAsRead = async (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    // persist to backend
    try {
      const token = await getIdToken();
      await fetch(`${API}/api/alerts/${id}/read`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
    } catch {}
  };

  const resolveAlert = async (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true, read: true } : a));
    setSelectedAlert(null);
    try {
      const token = await getIdToken();
      await fetch(`${API}/api/alerts/${id}/resolve`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
    } catch {}
  };

  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })));

  return (
    <div className="alerts-page">
      {/* Top Bar */}
      <div className="alerts-topbar">
        <div className="alerts-title-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2>{userUnit ? `Alerts — Unit ${userUnit}` : 'Security Alerts'}</h2>
            <div className="alerts-live-badge">
              <span className="alerts-live-dot" />
              Live
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="alert-counters">
              <span className="counter unread">
                <BellRing size={12} /> {unreadCount} unread
              </span>
              {criticalCount > 0 && (
                <span className="counter critical">
                  <AlertOctagon size={12} /> {criticalCount} critical
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
              Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <div className="alerts-actions">
          <button
            className="mark-read-btn" onClick={handleRefresh}
            id="refresh-alerts-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
            Refresh
          </button>
          <button className="mark-read-btn" onClick={markAllRead} id="mark-all-read">
            <CheckCircle size={14} />
            Mark All Read
          </button>
          <button className="emergency-btn" onClick={() => setEmergencyModalOpen(true)} id="emergency-alert-btn">
            <Volume2 size={16} />
            Emergency Alert
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="alerts-filters">
        {['all', 'unread', 'critical', 'high', 'medium', 'low', 'resolved'].map(f => (
          <button
            key={f}
            className={`alert-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
            id={`filter-${f}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'unread' && unreadCount > 0 && <span className="filter-count">{unreadCount}</span>}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div style={{ textAlign:'center', padding:'3rem', color:'#f87171' }}>
          <WifiOff size={36} style={{ marginBottom: 8 }} />
          <p>{error}</p>
          <button onClick={fetchAlerts} style={{ marginTop: 12, padding:'8px 20px', borderRadius:8, background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.3)', color:'#a78bfa', cursor:'pointer' }}>
            Retry
          </button>
        </div>
      )}

      {/* Alert List */}
      <div className="alerts-layout">
        <div className="alerts-list">
          {loading && (
            <div style={{ textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.4)' }}>
              <RefreshCw size={28} style={{ animation:'spin 1s linear infinite', marginBottom: 8 }} />
              <p>Loading alerts…</p>
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className="no-alerts">
              <Shield size={40} />
              <h3>All Clear</h3>
              <p>No security alerts at the moment</p>
            </div>
          )}
          {!loading && filtered.map((alert, i) => {
            const sev = severityConfig[alert.severity] || severityConfig.low;
            return (
              <div
                key={alert.id}
                className={`alert-card ${!alert.read ? 'unread' : ''} ${alert.resolved ? 'resolved' : ''} ${selectedAlert?.id === alert.id ? 'selected' : ''}`}
                onClick={() => { setSelectedAlert(alert); markAsRead(alert.id); }}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="alert-icon-col" style={{ color: sev.color }}>
                  <div className="alert-icon-bg" style={{ background: sev.bg }}>
                    {alert.icon || sev.icon}
                  </div>
                </div>

                <div className="alert-content-col">
                  <div className="alert-title-row">
                    <span className="alert-title">{alert.title}</span>
                    {!alert.read && <span className="unread-dot" />}
                  </div>
                  <p className="alert-meta">
                    {alert.visitor_id && <><User size={11} /> Visitor Alert<span className="meta-sep">•</span></>}
                    <MapPin size={11} /> {alert.location || 'Main Gate'}
                  </p>
                  <span className="alert-time">
                    <Clock size={11} />
                    {new Date(alert.created_at || alert.timestamp).toLocaleString([], {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="alert-severity-col">
                  <span className="severity-badge" style={{ color: sev.color, background: sev.bg }}>
                    {sev.icon}
                    {sev.label}
                  </span>
                  {alert.resolved && (
                    <span className="resolved-badge">
                      <CheckCircle size={10} /> Resolved
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Panel */}
        {selectedAlert && (
          <div className="alert-detail-panel animate-fade-in">
            <div className="alert-detail-header" style={{
              background: (severityConfig[selectedAlert.severity] || severityConfig.low).bg,
              borderLeft: `4px solid ${(severityConfig[selectedAlert.severity] || severityConfig.low).color}`
            }}>
              <span className="alert-detail-icon" style={{ fontSize: '28px' }}>
                {selectedAlert.icon || '🔔'}
              </span>
              <div>
                <h3>{selectedAlert.title}</h3>
                <span className="severity-badge" style={{
                  color: (severityConfig[selectedAlert.severity] || severityConfig.low).color,
                  background: 'rgba(0,0,0,0.2)'
                }}>
                  {(severityConfig[selectedAlert.severity] || severityConfig.low).label}
                </span>
              </div>
            </div>

            <div className="alert-detail-body">
              <div className="alert-detail-field">
                <span><MapPin size={13} /> Location</span>
                <strong>{selectedAlert.location || 'Main Gate'}</strong>
              </div>
              <div className="alert-detail-field">
                <span><Clock size={13} /> Time</span>
                <strong>{new Date(selectedAlert.created_at || selectedAlert.timestamp).toLocaleString()}</strong>
              </div>
              <div className="alert-detail-field">
                <span><Shield size={13} /> Type</span>
                <strong>{(selectedAlert.type || '').replace(/_/g, ' ')}</strong>
              </div>
              <div className="alert-detail-field">
                <span><Bell size={13} /> Status</span>
                <strong>{selectedAlert.resolved ? '✅ Resolved' : '⚠️ Active'}</strong>
              </div>
            </div>

            {!selectedAlert.resolved && (
              <div className="alert-detail-actions">
                <button
                  className="resolve-btn"
                  onClick={() => resolveAlert(selectedAlert.id)}
                  id="resolve-alert-btn"
                >
                  <CheckCircle size={16} />
                  Mark as Resolved
                </button>
                <button className="escalate-btn" id="escalate-alert-btn"
                  onClick={async () => {
                    try {
                      const token = await getIdToken();
                      await fetch(`${API}/api/alerts/emergency`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ location: selectedAlert.location || 'Main Gate' }),
                      });
                      fetchAlerts();
                    } catch {}
                  }}>
                  <AlertTriangle size={16} />
                  Escalate
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Emergency Modal */}
      {emergencyModalOpen && (
        <div className="emergency-overlay" onClick={() => { if (!emergencyLoading) { setEmergencyModalOpen(false); setEmergencyResult(null); } }}>
          <div className="emergency-modal animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="emergency-modal-icon">
              <AlertOctagon size={48} />
            </div>
            <h2>Trigger Emergency Alert</h2>
            <p>This will send an immediate alert to all security personnel and lock down all entry points.</p>
            {emergencyResult && (
              <p style={{ color: emergencyResult.ok ? '#34d399' : '#f87171', fontWeight: 600, margin: '0.5rem 0' }}>
                {emergencyResult.msg}
              </p>
            )}
            <div className="emergency-modal-actions">
              {!emergencyResult?.ok && (
                <button
                  className="emergency-confirm"
                  disabled={emergencyLoading}
                  onClick={async () => {
                    setEmergencyLoading(true);
                    setEmergencyResult(null);
                    try {
                      const token = await getIdToken();
                      const res = await fetch(`${API}/api/alerts/emergency`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ location: 'All Zones' }),
                      });
                      if (res.ok) {
                        setEmergencyResult({ ok: true, msg: '🚨 Emergency alert triggered! All security notified.' });
                        fetchAlerts();
                        setTimeout(() => { setEmergencyModalOpen(false); setEmergencyResult(null); }, 2000);
                      } else {
                        const d = await res.json();
                        setEmergencyResult({ ok: false, msg: d.error || 'Failed to trigger emergency.' });
                      }
                    } catch {
                      setEmergencyResult({ ok: false, msg: 'Server unreachable.' });
                    } finally {
                      setEmergencyLoading(false);
                    }
                  }}
                  id="confirm-emergency"
                >
                  <Volume2 size={18} />
                  {emergencyLoading ? 'Sending…' : 'Confirm Emergency'}
                </button>
              )}
              <button className="emergency-cancel" onClick={() => { setEmergencyModalOpen(false); setEmergencyResult(null); }} id="cancel-emergency">
                {emergencyResult?.ok ? 'Close' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
