import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, RefreshCw, Clock, User, Phone, MapPin, AlertTriangle } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import './ResidentApproval.css';

function ExpiryTimer({ expiresAt }) {
  const [remaining, setRemaining] = useState('');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = new Date(expiresAt) - Date.now();
      if (diff <= 0) { setRemaining('Expired'); setExpired(true); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${m}:${s.toString().padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return (
    <span className={`otp-timer ${expired ? 'expired-timer' : ''}`}>
      <Clock size={12} />
      {expired ? 'Expired' : `Expires in ${remaining}`}
    </span>
  );
}

function OtpCard({ otp, onAction }) {
  const [code, setCode]     = useState('');
  const [busy, setBusy]     = useState(false);
  const [result, setResult] = useState(null); // { type: 'success'|'error', msg }
  const api = useApi();

  const visitor = otp.visitors;
  const isPending = otp.status === 'pending';

  const handleApprove = async () => {
    if (!code || code.length !== 6) { setResult({ type: 'error', msg: 'Enter the 6-digit OTP code' }); return; }
    setBusy(true); setResult(null);
    try {
      await api.post(`/otps/${otp.id}/approve`, { code });
      setResult({ type: 'success', msg: '✅ Visitor approved!' });
      setTimeout(() => onAction(), 1500);
    } catch (err) {
      setResult({ type: 'error', msg: err.message });
    } finally { setBusy(false); }
  };

  const handleReject = async () => {
    if (!window.confirm(`Deny entry for ${visitor?.name}?`)) return;
    setBusy(true); setResult(null);
    try {
      await api.post(`/otps/${otp.id}/reject`, {});
      setResult({ type: 'success', msg: '❌ Visitor denied.' });
      setTimeout(() => onAction(), 1500);
    } catch (err) {
      setResult({ type: 'error', msg: err.message });
    } finally { setBusy(false); }
  };

  return (
    <div className={`otp-card ${otp.status}`}>
      <div className="otp-card-top">
        {/* Visitor photo */}
        <div className="otp-visitor-photo">
          {visitor?.photo_url
            ? <img src={visitor.photo_url} alt={visitor.name} />
            : <div className="otp-photo-fallback">👤</div>
          }
        </div>

        {/* Info */}
        <div className="otp-visitor-info">
          <h3 className="otp-visitor-name">{visitor?.name || '—'}</h3>
          <div className="otp-visitor-meta">
            {visitor?.target_flat && (
              <span className="otp-meta-tag"><MapPin size={11} />{visitor.target_flat}</span>
            )}
            {visitor?.purpose && (
              <span className="otp-meta-tag">{visitor.purpose}</span>
            )}
            {visitor?.trust_level && (
              <span className={`otp-trust-badge ${visitor.trust_level}`}>
                {visitor.trust_level} risk
              </span>
            )}
          </div>
          <div className="otp-time">
            {isPending && <ExpiryTimer expiresAt={otp.expires_at} />}
            {!isPending && (
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
                {new Date(otp.created_at).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Status */}
        <span className={`otp-status-badge ${otp.status}`}>
          {otp.status.charAt(0).toUpperCase() + otp.status.slice(1)}
        </span>
      </div>

      {/* OTP input — only for pending */}
      {isPending && (
        <div className="otp-card-bottom">
          <div className="otp-input-group">
            <label htmlFor={`otp-input-${otp.id}`}>Enter OTP:</label>
            <input
              id={`otp-input-${otp.id}`}
              className="otp-code-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="------"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              disabled={busy}
            />
          </div>

          {result && (
            <span className={`otp-result-msg ${result.type}`}>{result.msg}</span>
          )}

          <div className="otp-action-btns">
            <button
              className="otp-approve-btn"
              onClick={handleApprove}
              disabled={busy || code.length !== 6}
              id={`otp-approve-${otp.id}`}
            >
              <CheckCircle size={15} />
              Approve
            </button>
            <button
              className="otp-reject-btn"
              onClick={handleReject}
              disabled={busy}
              id={`otp-reject-${otp.id}`}
            >
              <XCircle size={15} />
              Deny
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResidentApproval() {
  const api = useApi();
  const [otps, setOtps]       = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOtps = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/otps');
      setOtps(data.otps || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOtps(); }, [fetchOtps]);

  const pending  = otps.filter(o => o.status === 'pending').length;
  const approved = otps.filter(o => o.status === 'approved').length;
  const rejected = otps.filter(o => o.status === 'rejected').length;

  return (
    <div className="res-approval-page">
      <div className="res-approval-header">
        <div className="res-approval-title">
          <h2><CheckCircle size={20} color="#10b981" /> Visitor Approvals</h2>
          <p>Approve or deny visitors at your door using the OTP sent by the guard</p>
        </div>
        <button className="res-refresh-btn" onClick={fetchOtps} disabled={loading} id="res-refresh">
          <RefreshCw size={14} className={loading ? 'spinning' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="res-stats">
        <div className="res-stat-card pending">
          <span className="stat-num">{pending}</span>
          <span className="stat-lbl">Pending</span>
        </div>
        <div className="res-stat-card approved">
          <span className="stat-num">{approved}</span>
          <span className="stat-lbl">Approved</span>
        </div>
        <div className="res-stat-card denied">
          <span className="stat-num">{rejected}</span>
          <span className="stat-lbl">Denied</span>
        </div>
        <div className="res-stat-card">
          <span className="stat-num">{otps.length}</span>
          <span className="stat-lbl">Total</span>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="res-loading">
          <div className="res-spinner" />
          Loading approvals…
        </div>
      ) : otps.length === 0 ? (
        <div className="res-empty">
          <div className="res-empty-icon">🛎️</div>
          <h3>No Visitor Requests</h3>
          <p>When a guard logs a visitor for your flat, the approval request will appear here.</p>
        </div>
      ) : (
        <div className="res-otp-list">
          {otps.map(otp => (
            <OtpCard key={otp.id} otp={otp} onAction={fetchOtps} />
          ))}
        </div>
      )}
    </div>
  );
}
