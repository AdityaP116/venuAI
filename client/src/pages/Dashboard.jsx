import { useState, useEffect, useCallback } from 'react';
import {
  Users, AlertTriangle, ShieldCheck, Clock, TrendingUp,
  Eye, ChevronRight, ArrowUpRight,
  Zap, Shield, AlertCircle, CheckCircle, XCircle, BarChart3,
  RefreshCw, WifiOff, Camera, Phone, UserCheck, Activity,
  PhoneCall, MapPin, Timer
} from 'lucide-react';
import { getTrustColor } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function Dashboard({ userUnit }) {
  const { getIdToken, user, role } = useAuth();

  // Real data state
  const [visitors,     setVisitors]     = useState([]);
  const [stats,        setStats]        = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  // Guard-specific state
  const [checkpoints,  setCheckpoints]  = useState([]);
  const [pendingCalls, setPendingCalls] = useState([]);
  const [endingShift,  setEndingShift]  = useState(false);

  const [animatedStats, setAnimatedStats] = useState({
    totalVisitors: 0, todayVisitors: 0, activeAlerts: 0, pendingApprovals: 0
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      const fetches = [
        fetch(`${API}/api/visitors?limit=8`, { headers }),
        fetch(`${API}/api/admin/stats`,     { headers }),
      ];

      // Guard-specific: checkpoints + pending calls
      if (role === 'guard') {
        fetches.push(fetch(`${API}/api/checkpoints/active`, { headers }));
        fetches.push(fetch(`${API}/api/guards/calls`,       { headers }));
      }

      const [visRes, statsRes, cpRes, callsRes] = await Promise.all(fetches);

      const visData  = await visRes.json();
      const statData = statsRes.ok ? await statsRes.json() : null;

      setVisitors(visData.visitors || []);
      setStats(statData?.stats || null);

      if (role === 'guard') {
        const cpData    = cpRes?.ok    ? await cpRes.json()    : {};
        const callsData = callsRes?.ok ? await callsRes.json() : {};
        setCheckpoints(
          ((cpData.active || []).map(cp => ({
            ...cp,
            // server sends seconds_left, Dashboard template uses seconds_remaining
            seconds_remaining: cp.seconds_left ?? cp.seconds_remaining ?? 0,
          }))).slice(0, 5)
        );
        setPendingCalls((callsData.calls || []).filter(c => c.status === 'pending').slice(0, 5));
      }
    } catch (e) {
      setError('Could not reach server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [getIdToken, role]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const endShift = async () => {
    setEndingShift(true);
    try {
      const token = await getIdToken();
      await fetch(`${API}/api/shifts/end`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    setEndingShift(false);
  };

  const respondCall = async (callId, status) => {
    try {
      const token = await getIdToken();
      await fetch(`${API}/api/guards/call/${callId}/respond`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setPendingCalls(prev => prev.filter(c => c.id !== callId));
    } catch {}
  };

  // Animate counters when stats load
  useEffect(() => {
    if (!stats && visitors.length === 0) return;
    const targets = {
      totalVisitors:    stats?.total_visitors   ?? visitors.length,
      todayVisitors:    stats?.today_visitors   ?? visitors.filter(v => {
        const d = new Date(v.created_at || v.entry_time);
        return d.toDateString() === new Date().toDateString();
      }).length,
      activeAlerts:     stats?.active_alerts    ?? 0,
      pendingApprovals: stats?.pending_approvals ?? visitors.filter(v => v.status === 'pending').length,
    };
    const duration = 1200;
    const steps = 40;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedStats({
        totalVisitors:    Math.round(targets.totalVisitors * eased),
        todayVisitors:    Math.round(targets.todayVisitors * eased),
        activeAlerts:     Math.round(targets.activeAlerts * eased),
        pendingApprovals: Math.round(targets.pendingApprovals * eased),
      });
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [stats, visitors]);

  // Weekly chart — derive from real visitors if no stats
  const weeklyData = stats?.weekly_visitors || (() => {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const counts = { Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0,Sun:0 };
    visitors.forEach(v => {
      const d = new Date(v.created_at || v.entry_time);
      const label = days[d.getDay()];
      if (counts[label] !== undefined) counts[label]++;
    });
    return Object.entries(counts).map(([day,count]) => ({ day, count }));
  })();

  const maxBarValue = Math.max(...weeklyData.map(d => d.count), 1);

  // Risk distribution derived from real visitors
  const riskDist = {
    low:    visitors.filter(v => v.trust_level === 'Low').length,
    medium: visitors.filter(v => v.trust_level === 'Medium').length,
    high:   visitors.filter(v => v.trust_level === 'High').length,
  };
  const totalRisk = riskDist.low + riskDist.medium + riskDist.high || 1;

  if (loading) return (
    <div className="dashboard-page" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight: 400 }}>
      <div style={{ textAlign:'center', color:'rgba(255,255,255,0.5)' }}>
        <RefreshCw size={32} style={{ animation:'spin 1s linear infinite', marginBottom:12 }} />
        <p>Loading dashboard…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="dashboard-page" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight: 400 }}>
      <div style={{ textAlign:'center', color:'rgba(255,255,255,0.5)' }}>
        <WifiOff size={36} style={{ marginBottom:12, color:'#f87171' }} />
        <p style={{ color:'#f87171', marginBottom:8 }}>{error}</p>
        <button onClick={fetchData} style={{ padding:'8px 20px', borderRadius:8, background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.3)', color:'#a78bfa', cursor:'pointer' }}>
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard
          title={userUnit ? 'My Visitors' : 'Total Visitors'}
          value={animatedStats.totalVisitors.toLocaleString()}
          change={userUnit ? `Unit ${userUnit}` : 'All time'}
          trend={userUnit ? 'neutral' : 'up'}
          icon={<Users size={20} />}
          color="purple"
          index={0}
        />
        <StatCard
          title="Today's Visitors"
          value={animatedStats.todayVisitors}
          change="Today"
          trend="up"
          icon={<Eye size={20} />}
          color="blue"
          index={1}
        />
        <StatCard
          title="Active Alerts"
          value={animatedStats.activeAlerts}
          change={animatedStats.activeAlerts > 0 ? 'Needs attention' : 'All clear'}
          trend="alert"
          icon={<AlertTriangle size={20} />}
          color="red"
          index={2}
        />
        <StatCard
          title="Pending Approvals"
          value={animatedStats.pendingApprovals}
          change={animatedStats.pendingApprovals > 0 ? 'Action needed' : 'None pending'}
          trend="neutral"
          icon={<Clock size={20} />}
          color="amber"
          index={3}
        />
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Weekly Visitors Chart */}
        <div className="dash-card chart-card animate-fade-in-up stagger-2">
          <div className="card-header">
            <div>
              <h3>Weekly Visitors</h3>
              <p className="card-subtitle">Last 7 days activity</p>
            </div>
            <div className="card-header-badge">
              <BarChart3 size={14} />
              <span>Live data</span>
            </div>
          </div>
          <div className="bar-chart">
            {weeklyData.map((d, i) => (
              <div key={d.day} className="bar-group">
                <div className="bar-value">{d.count}</div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      height: `${(d.count / maxBarValue) * 100}%`,
                      animationDelay: `${i * 0.08}s`
                    }}
                  />
                </div>
                <div className="bar-label">{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed — derived from real visitor entries */}
        <div className="dash-card activity-card animate-fade-in-up stagger-3">
          <div className="card-header">
            <div>
              <h3>Live Activity</h3>
              <p className="card-subtitle">Real-time event feed</p>
            </div>
            <div className="live-indicator">
              <span className="live-dot" />
              LIVE
            </div>
          </div>
          <div className="activity-list">
            {visitors.slice(0, 6).length === 0 ? (
              <div style={{ textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.3)' }}>
                <Shield size={28} style={{ marginBottom: 8 }} />
                <p>No activity yet</p>
              </div>
            ) : visitors.slice(0, 6).map((v, i) => {
              const type = v.status === 'approved' ? 'success' : v.status === 'denied' ? 'danger' : 'info';
              const event = v.status === 'approved'
                ? `${v.name} approved for ${v.target_flat || 'N/A'}`
                : v.status === 'denied'
                ? `${v.name} denied entry`
                : `${v.name} pending approval at ${v.target_flat || 'N/A'}`;
              const when = new Date(v.created_at || v.entry_time);
              const diff = Math.round((Date.now() - when.getTime()) / 60000);
              const timeStr = diff < 1 ? 'just now' : diff < 60 ? `${diff} min ago` : new Date(when).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
              return (
                <div key={v.id} className="activity-item" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className={`activity-icon ${type}`}>
                    {type === 'success' && <CheckCircle size={14} />}
                    {type === 'info'    && <Zap size={14} />}
                    {type === 'danger'  && <XCircle size={14} />}
                  </div>
                  <div className="activity-content">
                    <p>{event}</p>
                    <span className="activity-time">{timeStr}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="dash-card trust-card animate-fade-in-up stagger-4">
          <div className="card-header">
            <div>
              <h3>Risk Distribution</h3>
              <p className="card-subtitle">AI Trust Score analysis</p>
            </div>
          </div>
          {visitors.length === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem 1rem', color:'rgba(255,255,255,0.3)' }}>
              <Shield size={32} style={{ marginBottom: 8 }} />
              <p>No visitor data yet</p>
            </div>
          ) : (
            <div className="trust-visual">
              <div className="trust-ring">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                  <circle
                    cx="60" cy="60" r="52" fill="none" stroke="var(--status-safe)" strokeWidth="12"
                    strokeDasharray={`${(riskDist.low / totalRisk) * 327} 327`}
                    strokeDashoffset="0" strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    className="ring-segment"
                  />
                  <circle
                    cx="60" cy="60" r="52" fill="none" stroke="var(--status-warning)" strokeWidth="12"
                    strokeDasharray={`${(riskDist.medium / totalRisk) * 327} 327`}
                    strokeDashoffset={`-${(riskDist.low / totalRisk) * 327}`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    className="ring-segment"
                  />
                  <circle
                    cx="60" cy="60" r="52" fill="none" stroke="var(--status-danger)" strokeWidth="12"
                    strokeDasharray={`${(riskDist.high / totalRisk) * 327} 327`}
                    strokeDashoffset={`-${((riskDist.low + riskDist.medium) / totalRisk) * 327}`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    className="ring-segment"
                  />
                </svg>
                <div className="trust-ring-center">
                  <span className="trust-ring-value">{visitors.length}</span>
                  <span className="trust-ring-label">Visitors</span>
                </div>
              </div>
              <div className="trust-legend">
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: 'var(--status-safe)' }} />
                  <span className="legend-label">Low Risk</span>
                  <span className="legend-value">{Math.round((riskDist.low / totalRisk) * 100)}%</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: 'var(--status-warning)' }} />
                  <span className="legend-label">Medium Risk</span>
                  <span className="legend-value">{Math.round((riskDist.medium / totalRisk) * 100)}%</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: 'var(--status-danger)' }} />
                  <span className="legend-label">High Risk</span>
                  <span className="legend-value">{Math.round((riskDist.high / totalRisk) * 100)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Visitors */}
        <div className="dash-card visitors-card animate-fade-in-up stagger-5">
          <div className="card-header">
            <div>
              <h3>{userUnit ? 'Your Recent Visitors' : 'Recent Visitors'}</h3>
              <p className="card-subtitle">{userUnit ? `Unit ${userUnit}` : 'Latest entries'}</p>
            </div>
            <button className="card-action-btn" id="view-all-visitors">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="recent-visitors-list">
            {visitors.length === 0 ? (
              <div className="no-data-message">
                <Shield size={24} />
                <p>No visitors logged yet</p>
              </div>
            ) : visitors.slice(0, 5).map((v, i) => {
              const trust = getTrustColor(v.trust_level);
              return (
                <div key={v.id} className="visitor-row" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="visitor-avatar-sm">
                    {v.photo_url
                      ? <img src={v.photo_url} alt={v.name} />
                      : <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(139,92,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'#a78bfa' }}>
                          {v.name?.[0]?.toUpperCase() || '?'}
                        </div>
                    }
                  </div>
                  <div className="visitor-info-sm">
                    <span className="visitor-name-sm">{v.name}</span>
                    <span className="visitor-purpose-sm">{v.purpose}</span>
                  </div>
                  <div className="visitor-unit-sm">{v.target_flat || '—'}</div>
                  <div className="visitor-trust-sm" style={{ color: trust.color, background: trust.bg }}>
                    {v.trust_score ?? '—'}
                  </div>
                  <div className={`visitor-status-sm ${v.status}`}>
                    {v.status === 'approved' && <CheckCircle size={12} />}
                    {v.status === 'pending'  && <Clock size={12} />}
                    {v.status === 'denied'   && <XCircle size={12} />}
                    {v.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Guard-Specific Panels ─────────────────────────────── */}
      {role === 'guard' && (
        <div className="guard-dashboard-panels">

          {/* Quick Actions */}
          <div className="dash-card guard-actions-card animate-fade-in-up">
            <div className="card-header">
              <div>
                <h3>Quick Actions</h3>
                <p className="card-subtitle">Guard station controls</p>
              </div>
            </div>
            <div className="guard-quick-actions">
              <a href="/guard/visitors" className="gqa-btn primary" id="gqa-new-visitor">
                <Users size={18} />
                <span>Log Visitor</span>
              </a>
              <a href="/guard/cameras" className="gqa-btn blue" id="gqa-cameras">
                <Camera size={18} />
                <span>View Cameras</span>
              </a>
              <a href="/guard/visitor-logs" className="gqa-btn green" id="gqa-logs">
                <Activity size={18} />
                <span>Visitor Logs</span>
              </a>
              <button
                className="gqa-btn red"
                onClick={endShift}
                disabled={endingShift}
                id="gqa-end-shift"
              >
                {endingShift ? <RefreshCw size={18} className="spin" /> : <Shield size={18} />}
                <span>{endingShift ? 'Ending…' : 'End Shift'}</span>
              </button>
            </div>
          </div>

          {/* Active Checkpoint Timers */}
          <div className="dash-card guard-checkpoints-card animate-fade-in-up">
            <div className="card-header">
              <div>
                <h3>Active Checkpoints</h3>
                <p className="card-subtitle">Visitors in transit — 21s timer</p>
              </div>
              <div className="live-indicator">
                <span className="live-dot" />
                LIVE
              </div>
            </div>
            <div className="guard-checkpoints-list">
              {checkpoints.length === 0 ? (
                <div className="no-data-message">
                  <Timer size={24} />
                  <p>No active visitor checkpoints</p>
                </div>
              ) : checkpoints.map((cp, i) => {
                const remaining = cp.seconds_remaining ?? 0;
                const pct       = Math.max(0, Math.min(100, (remaining / 21) * 100));
                const color     = remaining > 10 ? '#34d399' : remaining > 5 ? '#fbbf24' : '#f87171';
                return (
                  <div key={cp.id || i} className="gcp-item" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="gcp-icon" style={{ background: `${color}18`, color }}>
                      <MapPin size={14} />
                    </div>
                    <div className="gcp-info">
                      <span className="gcp-name">{cp.visitor?.name || 'Unknown'}</span>
                      <span className="gcp-checkpoint">{(cp.checkpoint || '').replace(/_/g, ' ')}</span>
                    </div>
                    <div className="gcp-timer" style={{ color }}>
                      <div
                        className="gcp-timer-bar"
                        style={{ width: `${pct}%`, background: color }}
                      />
                      <span>{Math.max(0, Math.round(remaining))}s</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Resident Calls */}
          <div className="dash-card guard-calls-card animate-fade-in-up">
            <div className="card-header">
              <div>
                <h3>Resident Calls</h3>
                <p className="card-subtitle">Pending requests from residents</p>
              </div>
              {pendingCalls.length > 0 && (
                <span className="pending-count-badge">{pendingCalls.length}</span>
              )}
            </div>
            <div className="guard-calls-list">
              {pendingCalls.length === 0 ? (
                <div className="no-data-message">
                  <Phone size={24} />
                  <p>No pending resident calls</p>
                </div>
              ) : pendingCalls.map((call, i) => (
                <div key={call.id} className="gcall-item" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="gcall-avatar">
                    {call.resident?.name?.[0]?.toUpperCase() || 'R'}
                  </div>
                  <div className="gcall-info">
                    <span className="gcall-name">{call.resident?.name || 'Resident'}</span>
                    <span className="gcall-meta">
                      Flat {call.resident?.flat_num || '—'} • {call.call_type?.replace(/_/g, ' ')}
                    </span>
                    {call.message && <span className="gcall-message">"{call.message}"</span>}
                  </div>
                  <div className="gcall-actions">
                    <button
                      className="gcall-btn accept"
                      onClick={() => respondCall(call.id, 'accepted')}
                      id={`gcall-accept-${call.id}`}
                    >
                      <PhoneCall size={12} /> Accept
                    </button>
                    <button
                      className="gcall-btn miss"
                      onClick={() => respondCall(call.id, 'missed')}
                      id={`gcall-miss-${call.id}`}
                    >
                      Miss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, change, trend, icon, color, index }) {
  const colorMap = {
    purple: { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.2)', text: '#a78bfa', icon: 'var(--accent-gradient)' },
    blue:   { bg: 'rgba(59, 130, 246, 0.1)',  border: 'rgba(59, 130, 246, 0.2)',  text: '#60a5fa', icon: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
    red:    { bg: 'rgba(248, 113, 113, 0.1)', border: 'rgba(248, 113, 113, 0.2)', text: '#f87171', icon: 'linear-gradient(135deg, #ef4444, #f87171)' },
    amber:  { bg: 'rgba(251, 191, 36, 0.1)',  border: 'rgba(251, 191, 36, 0.2)',  text: '#fbbf24', icon: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  };
  const c = colorMap[color];

  return (
    <div
      className="stat-card animate-fade-in-up"
      style={{ animationDelay: `${index * 0.08}s`, borderColor: c.border }}
    >
      <div className="stat-icon" style={{ background: c.icon }}>
        {icon}
      </div>
      <div className="stat-content">
        <span className="stat-title">{title}</span>
        <span className="stat-value" style={{ color: c.text }}>{value}</span>
        <span className={`stat-change ${trend}`}>
          {trend === 'up' && <ArrowUpRight size={12} />}
          {trend === 'alert' && <AlertCircle size={12} />}
          {change}
        </span>
      </div>
    </div>
  );
}
