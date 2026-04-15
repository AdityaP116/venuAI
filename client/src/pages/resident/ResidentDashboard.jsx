import { useState, useEffect, useCallback } from 'react';
import {
  Users, Bell, Shield, Clock, CheckCircle, XCircle, Eye,
  Key, Home, ArrowUpRight, Zap,
  UserPlus, QrCode, RefreshCw, ChevronRight,
  Package, Wrench, Coffee, Phone, PhoneCall
} from 'lucide-react';
import { getTrustColor } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import './ResidentDashboard.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const PURPOSE_ICONS = {
  'Package Delivery': Package,
  'Meeting': Users,
  'Maintenance': Wrench,
  'Guest Visit': Coffee,
  'Food Delivery': Package,
  'Service Request': Wrench,
  'House Help': Home,
  'Medical Visit': Shield,
};

export default function ResidentDashboard({ user }) {
  const { getIdToken } = useAuth();

  // Derive unit display from user profile
  const wing    = user?.b_wing_alphabet || '';
  const flatNum = user?.flat_num || user?.b_num || '';
  const userUnit = wing && flatNum ? `${wing}-${flatNum}` : flatNum || wing || '—';

  const [visitors, setVisitors]     = useState([]);
  const [alerts, setAlerts]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', purpose: 'Guest Visit', date: '', phone: '' });
  const [sentInvites, setSentInvites] = useState([]);
  const [animatedStats, setAnimatedStats] = useState({ total: 0, pending: 0, approved: 0, alerts: 0 });
  const [otpTarget, setOtpTarget]   = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  // Guard availability
  const [availableGuards, setAvailableGuards] = useState([]);
  const [callingGuardId, setCallingGuardId]   = useState(null);
  const [guardCallSent, setGuardCallSent]     = useState(null);


  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getIdToken();
      const headers = { Authorization: `Bearer ${token}` };
      const [visRes, altRes] = await Promise.all([
        fetch(`${API}/api/visitors?limit=50`, { headers }),
        fetch(`${API}/api/alerts`,           { headers }),
      ]);
      const visData = await visRes.json();
      const altData = altRes.ok ? await altRes.json() : { alerts: [] };
      setVisitors(visData.visitors || []);
      setAlerts((altData.alerts || []).filter(a => !a.resolved).slice(0, 4));
    } catch {}
    setLoading(false);
  }, [getIdToken]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Fetch available guards ────────────────────────────────
  const fetchGuards = useCallback(async () => {
    try {
      const token = await getIdToken();
      const res   = await fetch(`${API}/api/guards/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAvailableGuards(data.guards || []);
    } catch {}
  }, [getIdToken]);

  useEffect(() => {
    fetchGuards();
    const timer = setInterval(fetchGuards, 30000);
    return () => clearInterval(timer);
  }, [fetchGuards]);

  const callGuard = async (guardId) => {
    setCallingGuardId(guardId);
    try {
      const token = await getIdToken();
      await fetch(`${API}/api/guards/call`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ guard_id: guardId, call_type: 'general' }),
      });
      setGuardCallSent(guardId);
      setTimeout(() => setGuardCallSent(null), 8000);
    } catch {}
    setCallingGuardId(null);
  };

  const shiftElapsed = (guard) => {
    if (!guard?.updated_at) return 'On duty';
    const mins = Math.floor((Date.now() - new Date(guard.updated_at)) / 60000);
    if (mins < 60) return `${mins}m on shift`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m on shift`;
  };



  // ── Real-time visitor arrival infotainment popup ─────────
  const [arrivalPopup,    setArrivalPopup]    = useState(null);  // pending visitor object
  const [respondingId,    setRespondingId]    = useState(null);
  const [shownVisitorIds, setShownVisitorIds] = useState(new Set());
  const [popupCountdown,  setPopupCountdown]  = useState(60);

  // Auto-dismiss countdown when popup is active
  useEffect(() => {
    if (!arrivalPopup) { setPopupCountdown(60); return; }
    setPopupCountdown(60);
    const ticker = setInterval(() => {
      setPopupCountdown(prev => {
        if (prev <= 1) {
          setArrivalPopup(null);
          clearInterval(ticker);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(ticker);
  }, [arrivalPopup?.id]);

  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const token = await getIdToken();
        // Filter by resident's flat if known
        const flatParam = userUnit && userUnit !== '—' ? `&flat=${encodeURIComponent(userUnit)}` : '';
        const res   = await fetch(`${API}/api/visitors?status=pending&limit=5${flatParam}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const pending = (data.visitors || []).filter(v => {
          if (shownVisitorIds.has(v.id)) return false;
          // Only show if targeting this resident's flat (or flat unknown)
          if (userUnit && userUnit !== '—' && v.target_flat && v.target_flat !== userUnit) return false;
          return true;
        });
        if (pending.length > 0 && !arrivalPopup) {
          const newest = pending[0];
          setArrivalPopup(newest);
          setShownVisitorIds(prev => new Set([...prev, newest.id]));
        }
      } catch {}
    }, 5000);
    return () => clearInterval(poll);
  }, [getIdToken, arrivalPopup, shownVisitorIds, userUnit]);

  const respondToArrival = async (action) => {
    if (!arrivalPopup) return;
    setRespondingId(arrivalPopup.id);
    try {
      const token = await getIdToken();
      await fetch(`${API}/api/visitors/${arrivalPopup.id}/${action}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setVisitors(prev => prev.map(v =>
        v.id === arrivalPopup.id ? { ...v, status: action === 'approve' ? 'approved' : 'denied' } : v
      ));
      setArrivalPopup(null);
    } catch {}
    setRespondingId(null);
  };

  // Animate stats
  useEffect(() => {
    const pending  = visitors.filter(v => v.status === 'pending').length;
    const approved = visitors.filter(v => v.status === 'approved').length;
    const targets  = { total: visitors.length, pending, approved, alerts: alerts.length };
    let step = 0; const steps = 35;
    const interval = setInterval(() => {
      step++;
      const p = step / steps;
      const e = 1 - Math.pow(1 - p, 3);
      setAnimatedStats({
        total:    Math.round(targets.total * e),
        pending:  Math.round(targets.pending * e),
        approved: Math.round(targets.approved * e),
        alerts:   Math.round(targets.alerts * e),
      });
      if (step >= steps) clearInterval(interval);
    }, 1200 / steps);
    return () => clearInterval(interval);
  }, [visitors, alerts]);

  const pendingVisitors = visitors.filter(v => v.status === 'pending').slice(0, 5);
  const recentVisitors  = visitors.filter(v => v.status === 'approved' || v.status === 'exited').slice(0, 6);

  const approveVisitor = useCallback(async (id) => {
    setApprovingId(id);
    try {
      const token = await getIdToken();
      await fetch(`${API}/api/visitors/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'approved' } : v));
    } catch {}
    setApprovingId(null);
  }, [getIdToken]);

  const denyVisitor = useCallback(async (id) => {
    setApprovingId(id);
    try {
      const token = await getIdToken();
      await fetch(`${API}/api/visitors/${id}/deny`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'denied' } : v));
    } catch {}
    setApprovingId(null);
  }, [getIdToken]);

  const sendInvite = () => {
    if (!inviteForm.name || !inviteForm.date) return;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentInvites(prev => [{
      id: 'INV-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      ...inviteForm, otp, status: 'pending', sentAt: new Date().toISOString(),
    }, ...prev]);
    setInviteForm({ name: '', purpose: 'Guest Visit', date: '', phone: '' });
    setShowInviteModal(false);
  };

  const generateOtp = (visitor) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpTarget(visitor);
    setGeneratedOtp(otp);
  };

  const severityColor = {
    critical: '#ef4444', high: '#f87171', medium: '#fbbf24', low: '#60a5fa',
  };

  return (
    <div className="resident-dashboard">
      {/* ── Emergency Infotainment: Visitor Arrival Popup ── */}
      {arrivalPopup && (
        <div className="sentra-emergency-overlay" style={{ zIndex: 9990 }}>
          <div className="sentra-emergency-popup visitor-arrival">
            <div className="sentra-popup-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>🚪 Visitor at Gate</span>
              <span style={{
                fontSize: '0.75rem', fontWeight: 600,
                background: popupCountdown <= 10 ? 'rgba(248,113,113,0.15)' : 'rgba(34,211,238,0.1)',
                color: popupCountdown <= 10 ? '#f87171' : '#22d3ee',
                border: `1px solid ${popupCountdown <= 10 ? 'rgba(248,113,113,0.3)' : 'rgba(34,211,238,0.25)'}`,
                borderRadius: 8, padding: '2px 10px', fontVariantNumeric: 'tabular-nums',
              }}>
                {popupCountdown}s
              </span>
            </div>
            <p className="sentra-popup-subtitle">
              Someone is at the gate requesting entry to your flat
              {userUnit !== '—' ? ` (${userUnit})` : ''}. Accept or deny access.
            </p>

            <div className="sentra-popup-visitor-card">
              {(arrivalPopup.guard_photo_url || arrivalPopup.photo_url) ? (
                <img
                  src={arrivalPopup.guard_photo_url || arrivalPopup.photo_url}
                  alt={arrivalPopup.name}
                  className="sentra-popup-visitor-photo"
                />
              ) : (
                <div className="sentra-popup-visitor-avatar">
                  {arrivalPopup.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div className="sentra-popup-visitor-info">
                <span className="sentra-popup-visitor-name">{arrivalPopup.name}</span>
                <span className="sentra-popup-visitor-detail">
                  Purpose: {arrivalPopup.purpose || 'Not specified'}<br />
                  {arrivalPopup.phone && `Phone: ${arrivalPopup.phone}`}
                </span>
              </div>
            </div>

            <div className="sentra-popup-actions">
              <button
                className="sentra-popup-btn accept"
                onClick={() => respondToArrival('approve')}
                disabled={!!respondingId}
                id="popup-accept-visitor"
              >
                <CheckCircle size={18} />
                {respondingId === arrivalPopup.id ? 'Accepting…' : 'Allow Entry'}
              </button>
              <button
                className="sentra-popup-btn deny"
                onClick={() => respondToArrival('deny')}
                disabled={!!respondingId}
                id="popup-deny-visitor"
              >
                <XCircle size={18} />
                Deny
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="resident-welcome">
        <div className="welcome-text">
          <div className="welcome-unit-badge">
            <Home size={14} />
            {userUnit !== '—' ? `Unit ${userUnit}` : 'My Unit'}
          </div>
          <h2>Welcome back, <span>{user?.name?.split(' ')[0] || 'Resident'}</span></h2>
          <p>Here's your security overview for today</p>
        </div>
        <div className="welcome-actions">
          <button className="invite-btn" onClick={() => setShowInviteModal(true)} id="invite-visitor-btn">
            <UserPlus size={16} />
            Invite Visitor
          </button>
          <button className="otp-quick-btn" onClick={() => generateOtp({ name: 'Quick OTP', id: 'quick' })} id="quick-otp-btn">
            <Key size={16} />
            Generate OTP
          </button>
          <button
            onClick={fetchData}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.6rem 0.85rem', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="resident-stats">
        <div className="res-stat-card blue">
          <div className="res-stat-icon"><Users size={18} /></div>
          <div className="res-stat-body">
            <span className="res-stat-val">{animatedStats.total}</span>
            <span className="res-stat-label">Total Visitors</span>
          </div>
          <ArrowUpRight size={14} className="res-stat-arrow" />
        </div>
        <div className="res-stat-card amber">
          <div className="res-stat-icon"><Clock size={18} /></div>
          <div className="res-stat-body">
            <span className="res-stat-val">{animatedStats.pending}</span>
            <span className="res-stat-label">Awaiting Approval</span>
          </div>
          {animatedStats.pending > 0 && <span className="res-stat-pulse" />}
        </div>
        <div className="res-stat-card green">
          <div className="res-stat-icon"><CheckCircle size={18} /></div>
          <div className="res-stat-body">
            <span className="res-stat-val">{animatedStats.approved}</span>
            <span className="res-stat-label">Approved</span>
          </div>
        </div>
        <div className="res-stat-card red">
          <div className="res-stat-icon"><Bell size={18} /></div>
          <div className="res-stat-body">
            <span className="res-stat-val">{animatedStats.alerts}</span>
            <span className="res-stat-label">Active Alerts</span>
          </div>
          {animatedStats.alerts > 0 && <span className="res-stat-pulse red" />}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="resident-grid">
        {/* Pending Approvals */}
        <div className="res-card pending-card">
          <div className="res-card-header">
            <div>
              <h3>Pending Approvals</h3>
              <p>Visitors waiting for your confirmation</p>
            </div>
            {pendingVisitors.length > 0 && (
              <span className="pending-count-badge">{pendingVisitors.length}</span>
            )}
          </div>

          {loading ? (
            <div className="res-empty-state">
              <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite' }} />
              <p>Loading…</p>
            </div>
          ) : pendingVisitors.length === 0 ? (
            <div className="res-empty-state">
              <Shield size={32} />
              <p>No pending approvals</p>
              <span>All visitors have been processed</span>
            </div>
          ) : (
            <div className="pending-list">
              {pendingVisitors.map((v, i) => {
                const trust = getTrustColor(v.trust_level);
                const Icon = PURPOSE_ICONS[v.purpose] || Users;
                const isActioning = approvingId === v.id;
                return (
                  <div key={v.id} className="pending-item" style={{ animationDelay: `${i * 0.07}s` }}>
                    {v.photo_url ? (
                      <img src={v.photo_url} alt={v.name} className="pending-photo" />
                    ) : (
                      <div className="pending-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', fontSize: 18, fontWeight: 700 }}>
                        {v.name?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div className="pending-info">
                      <span className="pending-name">{v.name}</span>
                      <div className="pending-meta">
                        <Icon size={12} />
                        <span>{v.purpose || '—'}</span>
                        <span className="meta-dot">•</span>
                        <Clock size={11} />
                        <span>
                          {new Date(v.entry_time || v.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="trust-chip" style={{ color: trust.color, background: trust.bg }}>
                      {v.trust_score ?? '—'}
                    </div>
                    <div className="pending-actions">
                      <button
                        className="quick-approve"
                        onClick={() => approveVisitor(v.id)}
                        id={`approve-${v.id}`}
                        title="Approve"
                        disabled={isActioning}
                      >
                        {isActioning ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={16} />}
                        {!isActioning && 'Approve'}
                      </button>
                      <button
                        className="quick-deny"
                        onClick={() => denyVisitor(v.id)}
                        id={`deny-${v.id}`}
                        title="Deny"
                        disabled={isActioning}
                      >
                        <XCircle size={16} />
                      </button>
                      <button
                        className="quick-otp"
                        onClick={() => generateOtp(v)}
                        id={`otp-${v.id}`}
                        title="View OTP"
                      >
                        <Key size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Visitor History */}
        <div className="res-card">
          <div className="res-card-header">
            <div>
              <h3>Recent Visitors</h3>
              <p>Past entries to {userUnit !== '—' ? `Unit ${userUnit}` : 'your unit'}</p>
            </div>
            <button className="res-view-all" id="view-all-history">
              All <ChevronRight size={14} />
            </button>
          </div>
          <div className="recent-visitor-list">
            {!loading && recentVisitors.length === 0 ? (
              <div className="res-empty-state small">
                <Eye size={24} />
                <p>No approved visitors yet</p>
              </div>
            ) : recentVisitors.map((v, i) => {
              const trust = getTrustColor(v.trust_level);
              return (
                <div key={v.id} className="recent-visitor-item" style={{ animationDelay: `${i * 0.06}s` }}>
                  {v.photo_url ? (
                    <img src={v.photo_url} alt={v.name} />
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontSize: 15, fontWeight: 700, flexShrink: 0 }}>
                      {v.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="rv-info">
                    <span className="rv-name">{v.name}</span>
                    <span className="rv-purpose">{v.purpose || '—'}</span>
                  </div>
                  <div className="rv-time">
                    {new Date(v.entry_time || v.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="rv-trust" style={{ color: trust.color, background: trust.bg }}>
                    {v.trust_score ?? '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="res-card alerts-card">
          <div className="res-card-header">
            <div>
              <h3>Security Alerts</h3>
              <p>Recent unresolved alerts</p>
            </div>
            <div className="live-badge-sm">
              <span className="live-dot-sm" />
              Live
            </div>
          </div>
          <div className="res-alerts-list">
            {!loading && alerts.length === 0 ? (
              <div className="res-empty-state small">
                <Shield size={24} />
                <p>All clear — no active alerts</p>
              </div>
            ) : alerts.map((a, i) => (
              <div key={a.id} className="res-alert-item" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="res-alert-icon">{a.icon || '🔔'}</span>
                <div className="res-alert-content">
                  <span className="res-alert-title">{a.title}</span>
                  <span className="res-alert-meta">
                    {a.location || 'Premises'} • {new Date(a.created_at || a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="res-alert-severity" style={{ color: severityColor[a.severity] }}>
                  {a.severity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sent Invites */}
        <div className="res-card invites-card">
          <div className="res-card-header">
            <div>
              <h3>Sent Invites</h3>
              <p>Pre-approved visitor passes</p>
            </div>
            <button className="invite-btn-sm" onClick={() => setShowInviteModal(true)} id="new-invite-btn">
              <UserPlus size={14} />
              New
            </button>
          </div>
          {sentInvites.length === 0 ? (
            <div className="res-empty-state">
              <QrCode size={32} />
              <p>No invites sent yet</p>
              <span>Invite a visitor to pre-generate their pass</span>
            </div>
          ) : (
            <div className="invites-list">
              {sentInvites.map((inv, i) => (
                <div key={inv.id} className="invite-item" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="invite-info">
                    <span className="invite-name">{inv.name}</span>
                    <span className="invite-purpose">{inv.purpose}</span>
                    <span className="invite-date">{inv.date}</span>
                  </div>
                  <div className="invite-otp">
                    <Key size={12} />
                    {inv.otp}
                  </div>
                  <span className="invite-status pending">Pending</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Guards on Duty ── */}
      <div className="res-guard-availability">
        <div className="res-card-header" style={{ marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Guards on Duty</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Currently available security personnel</p>
          </div>
          <div className="live-badge-sm">
            <span className="live-dot-sm" />
            Live
          </div>
        </div>

        {availableGuards.length === 0 ? (
          <div className="res-empty-state small" style={{ padding: '1.25rem' }}>
            <Shield size={24} />
            <p>No guards currently on duty</p>
          </div>
        ) : (
          <div className="res-guards-list">
            {availableGuards.map(guard => {
              const isCalling = callingGuardId === guard.id;
              const isSent    = guardCallSent   === guard.id;
              const avatar    = guard.profile_image_url || guard.avatar_url;
              return (
                <div key={guard.id} className="res-guard-card">
                  <div className="res-guard-avatar-wrap">
                    {avatar
                      ? <img src={avatar} alt={guard.name} className="res-guard-avatar" />
                      : <div className="res-guard-avatar-placeholder">{guard.name?.[0]?.toUpperCase() || 'G'}</div>
                    }
                    <span className="res-guard-online-dot" />
                  </div>
                  <div className="res-guard-info">
                    <span className="res-guard-name">{guard.name}</span>
                    <span className="res-guard-shift">
                      <Clock size={10} /> {shiftElapsed(guard)}
                    </span>
                  </div>
                  <button
                    className={`res-call-guard-btn ${isSent ? 'sent' : ''}`}
                    onClick={() => callGuard(guard.id)}
                    disabled={!!callingGuardId || isSent}
                    id={`call-guard-${guard.id}`}
                    title="Call this guard"
                  >
                    {isCalling ? <RefreshCw size={13} className="spin" /> : isSent ? <CheckCircle size={13} /> : <PhoneCall size={13} />}
                    <span>{isCalling ? 'Calling…' : isSent ? 'Called!' : 'Call'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (

        <div className="res-modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="res-modal animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="res-modal-header">
              <h3><UserPlus size={18} /> Invite a Visitor</h3>
              <button className="res-modal-close" onClick={() => setShowInviteModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="res-modal-body">
              <div className="res-form-group">
                <label>Visitor Name *</label>
                <input type="text" placeholder="Full name" value={inviteForm.name}
                  onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })} id="invite-name" />
              </div>
              <div className="res-form-group">
                <label>Purpose</label>
                <select value={inviteForm.purpose}
                  onChange={e => setInviteForm({ ...inviteForm, purpose: e.target.value })} id="invite-purpose">
                  {['Guest Visit','Package Delivery','Maintenance','Food Delivery','House Help','Medical Visit','Meeting'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="res-form-row">
                <div className="res-form-group">
                  <label>Expected Date *</label>
                  <input type="date" value={inviteForm.date}
                    onChange={e => setInviteForm({ ...inviteForm, date: e.target.value })} id="invite-date" />
                </div>
                <div className="res-form-group">
                  <label>Phone (optional)</label>
                  <input type="tel" placeholder="+91 XXXXXXXXXX" value={inviteForm.phone}
                    onChange={e => setInviteForm({ ...inviteForm, phone: e.target.value })} id="invite-phone" />
                </div>
              </div>
            </div>
            <div className="res-modal-footer">
              <button className="res-cancel-btn" onClick={() => setShowInviteModal(false)}>Cancel</button>
              <button className="res-submit-btn" onClick={sendInvite} id="submit-invite-btn">
                <Key size={14} />
                Send Invite & Generate OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {generatedOtp && (
        <div className="res-modal-overlay" onClick={() => { setGeneratedOtp(null); setOtpTarget(null); }}>
          <div className="res-modal otp-modal animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="res-modal-header">
              <h3><Key size={18} /> One-Time Password</h3>
              <button className="res-modal-close" onClick={() => { setGeneratedOtp(null); setOtpTarget(null); }}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="otp-display">
              <p className="otp-for">OTP for <strong>{otpTarget?.name}</strong></p>
              <div className="otp-code">
                {generatedOtp.split('').map((digit, i) => (
                  <span key={i} className="otp-digit">{digit}</span>
                ))}
              </div>
              <p className="otp-note">
                <Shield size={12} />
                Valid for 10 minutes. Share only with your visitor.
              </p>
            </div>
            <div className="res-modal-footer">
              <button className="res-submit-btn" onClick={() => { setGeneratedOtp(null); setOtpTarget(null); }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
