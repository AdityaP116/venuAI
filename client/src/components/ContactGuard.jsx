import { useState, useEffect, useCallback } from 'react';
import { Phone, X, ShieldCheck, Clock, AlertTriangle, CheckCircle, PhoneCall, PhoneOff, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ContactGuard.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function ContactGuard() {
  const { getIdToken, user } = useAuth();
  const [open,       setOpen]       = useState(false);
  const [guards,     setGuards]     = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [calling,    setCalling]    = useState(null);  // guard id being called
  const [callSent,   setCallSent]   = useState(null);  // guard id call was sent to
  const [callType,   setCallType]   = useState('general');
  const [message,    setMessage]    = useState('');
  const [error,      setError]      = useState('');

  const fetchGuards = useCallback(async () => {
    if (!open) return;
    setLoading(true);
    setError('');
    try {
      const token = await getIdToken();
      const res   = await fetch(`${API}/api/guards/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      setGuards(data.guards || []);
    } catch {
      setError('Could not load guard availability');
    } finally {
      setLoading(false);
    }
  }, [getIdToken, open]);

  useEffect(() => { fetchGuards(); }, [fetchGuards]);

  const callGuard = async (guard) => {
    setCalling(guard.id);
    setError('');
    try {
      const token = await getIdToken();
      const res   = await fetch(`${API}/api/guards/call`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ guard_id: guard.id, call_type: callType, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Call failed');
      setCallSent(guard.id);
      setMessage('');
      setTimeout(() => setCallSent(null), 8000);
    } catch (e) {
      setError(e.message);
    } finally {
      setCalling(null);
    }
  };

  const shiftElapsed = (shift) => {
    if (!shift?.shift_start) return '';
    const mins = Math.floor((Date.now() - new Date(shift.shift_start)) / 60000);
    if (mins < 60) return `${mins}m into shift`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m into shift`;
  };

  return (
    <>
      {/* FAB */}
      <button
        className={`contact-guard-fab ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        id="contact-guard-fab"
        title="Contact Guard"
      >
        {open ? <X size={22} /> : <Phone size={22} />}
      </button>

      {/* Modal */}
      {open && (
        <>
          <div className="contact-guard-overlay" onClick={() => setOpen(false)} />
          <div className="contact-guard-modal animate-fade-in-up">
            <div className="contact-guard-header">
              <ShieldCheck size={20} />
              <div>
                <h3>Contact Guard</h3>
                <p>Choose an available guard on duty</p>
              </div>
              <button className="cg-close-btn" onClick={() => setOpen(false)}><X size={16} /></button>
            </div>

            {/* Call type selector */}
            <div className="cg-call-type">
              {[
                { v: 'general',       l: 'General' },
                { v: 'emergency',     l: '🚨 Emergency' },
                { v: 'visitor_query', l: 'Visitor Query' },
                { v: 'maintenance',   l: 'Maintenance' },
              ].map(({ v, l }) => (
                <button
                  key={v}
                  className={`cg-type-pill ${callType === v ? 'active' : ''} ${v === 'emergency' ? 'emergency' : ''}`}
                  onClick={() => setCallType(v)}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Optional message */}
            <div className="cg-message-wrap">
              <input
                type="text"
                className="cg-message-input"
                placeholder="Optional message (e.g. package at gate)"
                value={message}
                onChange={e => setMessage(e.target.value)}
                maxLength={120}
                id="cg-message"
              />
            </div>

            {error && (
              <div className="cg-error">
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            {/* Guard list */}
            <div className="cg-guards-list">
              {loading ? (
                <div className="cg-loading">
                  <Loader size={20} className="spin" />
                  <span>Finding available guards…</span>
                </div>
              ) : guards.length === 0 ? (
                <div className="cg-no-guards">
                  <PhoneOff size={28} />
                  <p>No guards currently on duty</p>
                  <span>Please try again shortly or call the main security line</span>
                </div>
              ) : guards.map(guard => {
                const avatar   = guard.profile_image_url || guard.avatar_url;
                const isCalling = calling === guard.id;
                const isSuccess = callSent === guard.id;

                return (
                  <div key={guard.id} className={`cg-guard-card ${isSuccess ? 'call-sent' : ''}`}>
                    <div className="cg-guard-avatar-wrap">
                      {avatar
                        ? <img src={avatar} alt={guard.name} className="cg-guard-avatar" />
                        : <div className="cg-guard-avatar-placeholder">{guard.name?.[0]?.toUpperCase() || 'G'}</div>
                      }
                      <span className="cg-online-dot" />
                    </div>

                    <div className="cg-guard-info">
                      <span className="cg-guard-name">{guard.name}</span>
                      {guard.username && <span className="cg-guard-username">@{guard.username}</span>}
                      <span className="cg-guard-shift">
                        <Clock size={10} />
                        {shiftElapsed(guard.current_shift) || 'On duty'}
                      </span>
                    </div>

                    <button
                      className={`cg-call-btn ${isSuccess ? 'sent' : ''}`}
                      onClick={() => callGuard(guard)}
                      disabled={!!calling || isSuccess}
                      id={`call-guard-${guard.id}`}
                    >
                      {isCalling  ? <Loader size={14} className="spin" />       : null}
                      {isSuccess  ? <CheckCircle size={14} />                   : null}
                      {!isCalling && !isSuccess ? <PhoneCall size={14} />       : null}
                      <span>{isCalling ? 'Calling…' : isSuccess ? 'Called!' : 'Call'}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="guard-duty-schedule">
              <Clock size={13} />
              <span>Guards work 12-hour shifts. Availability updates in real-time.</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
