import { useState, useCallback, useEffect } from 'react';
import {
  CheckCircle, XCircle, Clock, Shield, Phone, MapPin, User,
  ThumbsUp, ThumbsDown, Send, Eye, RefreshCw, WifiOff
} from 'lucide-react';
import { getTrustColor } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import './Approval.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function Approval({ userUnit }) {
  const { getIdToken } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // id of visitor being actioned
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      const res = await fetch(`${API}/api/visitors?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVisitors(data.visitors || []);
    } catch {
      setError('Could not reach server.');
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => { fetchVisitors(); }, [fetchVisitors]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const token = await getIdToken();
      const res = await fetch(`${API}/api/visitors/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'approved' } : v));
        if (selectedVisitor?.id === id) setSelectedVisitor(prev => ({ ...prev, status: 'approved' }));
      }
    } catch {}
    setActionLoading(null);
  };

  const handleDeny = async (id) => {
    setActionLoading(id);
    try {
      const token = await getIdToken();
      const res = await fetch(`${API}/api/visitors/${id}/deny`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'denied' } : v));
        if (selectedVisitor?.id === id) setSelectedVisitor(prev => ({ ...prev, status: 'denied' }));
      }
    } catch {}
    setActionLoading(null);
  };

  // Filter by status
  const filtered = statusFilter === 'all'
    ? visitors
    : visitors.filter(v => v.status === statusFilter);

  const pendingCount = visitors.filter(v => v.status === 'pending').length;

  return (
    <div className="approval-page">
      <div className="approval-header">
        <div>
          <h2>Visitor Approvals</h2>
          <p>
            {loading ? 'Loading…' : `${pendingCount} pending approval${pendingCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="approval-filter-pills">
            {[
              { key: 'all',      label: 'All' },
              { key: 'pending',  label: `Pending (${pendingCount})` },
              { key: 'approved', label: 'Approved' },
              { key: 'denied',   label: 'Denied' },
            ].map(f => (
              <button
                key={f.key}
                className={`filter-pill ${statusFilter === f.key ? 'active' : ''}`}
                onClick={() => setStatusFilter(f.key)}
                id={`filter-${f.key}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            onClick={fetchVisitors}
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '0.45rem 0.75rem', color: '#a78bfa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            id="refresh-approvals"
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#f87171' }}>
          <WifiOff size={32} style={{ marginBottom: 8 }} />
          <p>{error}</p>
          <button onClick={fetchVisitors} style={{ marginTop: 12, padding: '8px 20px', borderRadius: 8, background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa', cursor: 'pointer' }}>
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.4)' }}>
          <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: 8 }} />
          <p>Loading visitors…</p>
        </div>
      )}

      {!loading && !error && (
        <div className="approval-layout">
          <div className="approval-list">
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
                <Shield size={40} style={{ marginBottom: 12 }} />
                <p>No {statusFilter !== 'all' ? statusFilter : ''} visitors</p>
                <span style={{ fontSize: '0.85rem' }}>
                  {statusFilter === 'pending' ? 'All visitors have been processed' : 'No records match this filter'}
                </span>
              </div>
            ) : filtered.map((v, i) => {
              const trust = getTrustColor(v.trust_level);
              const isActioning = actionLoading === v.id;
              return (
                <div
                  key={v.id}
                  className={`approval-card ${v.status} ${selectedVisitor?.id === v.id ? 'selected' : ''}`}
                  style={{ animationDelay: `${i * 0.06}s` }}
                  onClick={() => setSelectedVisitor(v)}
                >
                  <div className="approval-card-left">
                    <div className="approval-avatar">
                      {v.photo_url ? (
                        <img src={v.photo_url} alt={v.name} />
                      ) : (
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#a78bfa', fontWeight: 700 }}>
                          {v.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                      <span className={`status-indicator ${v.status}`} />
                    </div>
                    <div className="approval-info">
                      <span className="approval-name">{v.name}</span>
                      <span className="approval-purpose">
                        {v.purpose || '—'} → {v.target_flat || '—'}
                      </span>
                      <span className="approval-time">
                        {new Date(v.entry_time || v.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="approval-card-right">
                    <div className="trust-badge" style={{ color: trust.color, background: trust.bg }}>
                      {v.trust_score ?? '—'}
                    </div>
                    {v.status === 'pending' && !isActioning && (
                      <div className="quick-actions">
                        <button
                          className="quick-btn approve"
                          onClick={e => { e.stopPropagation(); handleApprove(v.id); }}
                          title="Approve"
                          id={`quick-approve-${v.id}`}
                        >
                          <ThumbsUp size={14} />
                        </button>
                        <button
                          className="quick-btn deny"
                          onClick={e => { e.stopPropagation(); handleDeny(v.id); }}
                          title="Deny"
                          id={`quick-deny-${v.id}`}
                        >
                          <ThumbsDown size={14} />
                        </button>
                      </div>
                    )}
                    {isActioning && (
                      <div style={{ padding: '0.4rem' }}>
                        <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite', color: '#a78bfa' }} />
                      </div>
                    )}
                    {v.status === 'approved' && <span className="status-pill approved"><CheckCircle size={12} /> Approved</span>}
                    {v.status === 'denied'   && <span className="status-pill denied"><XCircle size={12} /> Denied</span>}
                    {v.status === 'exited'   && <span className="status-pill approved"><Eye size={12} /> Exited</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail Panel */}
          {selectedVisitor && (
            <div className="approval-detail animate-fade-in">
              <div className="detail-header">
                {selectedVisitor.photo_url ? (
                  <img src={selectedVisitor.photo_url} alt={selectedVisitor.name} className="detail-photo" />
                ) : (
                  <div className="detail-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', fontSize: 28, fontWeight: 700 }}>
                    {selectedVisitor.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <h3>{selectedVisitor.name}</h3>
                <p>{selectedVisitor.purpose || '—'}</p>
              </div>

              <div className="detail-fields">
                <div className="detail-field">
                  <User size={14} />
                  <span className="detail-label">Visitor ID</span>
                  <span className="detail-value" style={{ fontFamily: 'monospace', fontSize: '0.82em', color: '#a78bfa' }}>
                    {selectedVisitor.visitor_unique_id || selectedVisitor.id?.slice(0, 8)}
                  </span>
                </div>
                {selectedVisitor.phone && (
                  <div className="detail-field">
                    <Phone size={14} />
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{selectedVisitor.phone}</span>
                  </div>
                )}
                <div className="detail-field">
                  <MapPin size={14} />
                  <span className="detail-label">Flat</span>
                  <span className="detail-value">{selectedVisitor.target_flat || '—'}</span>
                </div>
                <div className="detail-field">
                  <Shield size={14} />
                  <span className="detail-label">Trust Score</span>
                  <span className="detail-value" style={{ color: getTrustColor(selectedVisitor.trust_level).color }}>
                    {selectedVisitor.trust_score ?? '—'}/100 ({selectedVisitor.trust_level || 'N/A'} Risk)
                  </span>
                </div>
                {selectedVisitor.captured_at && (
                  <div className="detail-field">
                    <Eye size={14} />
                    <span className="detail-label">Photo taken</span>
                    <span className="detail-value" style={{ fontSize: '0.82em' }}>
                      {new Date(selectedVisitor.captured_at).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="detail-field">
                  <Clock size={14} />
                  <span className="detail-label">Entry Time</span>
                  <span className="detail-value">
                    {new Date(selectedVisitor.entry_time || selectedVisitor.created_at).toLocaleString()}
                  </span>
                </div>
                {selectedVisitor.resident && (
                  <div className="detail-field">
                    <User size={14} />
                    <span className="detail-label">Resident</span>
                    <span className="detail-value">{selectedVisitor.resident.name}</span>
                  </div>
                )}
              </div>

              {selectedVisitor.status === 'pending' && (
                <div className="detail-actions">
                  <button
                    className="detail-action-btn approve"
                    onClick={() => handleApprove(selectedVisitor.id)}
                    id="approve-visitor"
                    disabled={actionLoading === selectedVisitor.id}
                  >
                    <ThumbsUp size={16} />
                    {actionLoading === selectedVisitor.id ? 'Processing…' : 'Approve Entry'}
                  </button>
                  <button
                    className="detail-action-btn deny"
                    onClick={() => handleDeny(selectedVisitor.id)}
                    id="deny-visitor"
                    disabled={actionLoading === selectedVisitor.id}
                  >
                    <ThumbsDown size={16} />
                    Deny Entry
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
