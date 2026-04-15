import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Video, Wifi, WifiOff, Maximize2, Minimize2, AlertTriangle,
  Camera, RefreshCw, Clock, Shield, Eye, ZoomIn,
  Circle, Filter, Grid3X3, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './CameraMonitor.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const CAMERA_TYPE_COLORS = {
  gate:     '#22d3ee',
  lift:     '#a78bfa',
  corridor: '#34d399',
  door:     '#fbbf24',
  lobby:    '#f472b6',
};

export default function CameraMonitor() {
  const { getIdToken } = useAuth();

  const [cameras,       setCameras]       = useState([]);
  const [activeVisitors, setActiveVisitors] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedCam,   setSelectedCam]   = useState(null);
  const [fullscreen,    setFullscreen]    = useState(false);
  const [gridMode,      setGridMode]      = useState('2x2');  // '2x2' | '3x3' | 'single'
  const [filterType,    setFilterType]    = useState('all');
  const [breachAlerts,  setBreachAlerts]  = useState([]);

  const videoRef    = useRef(null);
  const streamRef   = useRef(null);
  const pollRef     = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const token = await getIdToken();
      const h     = { Authorization: `Bearer ${token}` };
      const [camRes, liftRes] = await Promise.all([
        fetch(`${API}/api/cameras`, { headers: h }),
        fetch(`${API}/api/cameras/lift`, { headers: h }),
      ]);
      const camData  = await camRes.json();
      const liftData = liftRes.ok ? await liftRes.json() : { active_visitors: [] };
      setCameras(camData.cameras || []);
      setActiveVisitors(liftData.active_visitors || []);
    } catch {}
    setLoading(false);
  }, [getIdToken]);

  // Periodic breach check
  const runBreachCheck = useCallback(async () => {
    try {
      const token = await getIdToken();
      const res   = await fetch(`${API}/api/checkpoints/breach-check`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.breaches > 0) {
        setBreachAlerts(prev => [...prev, { id: Date.now(), count: data.breaches, time: new Date() }]);
      }
    } catch {}
  }, [getIdToken]);

  useEffect(() => {
    fetchData();
    pollRef.current = setInterval(() => { fetchData(); runBreachCheck(); }, 5000);
    return () => { clearInterval(pollRef.current); stopStream(); };
  }, [fetchData, runBreachCheck]);

  // Start webcam for the selected/primary camera feed
  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {}
  };

  const stopStream = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    if (selectedCam) startStream();
    else stopStream();
    return stopStream;
  }, [selectedCam]);

  const filteredCameras = filterType === 'all'
    ? cameras
    : cameras.filter(c => c.type === filterType);

  const visibleCams = filteredCameras.slice(0, gridMode === '2x2' ? 4 : gridMode === '3x3' ? 9 : 1);

  // Get visitor tracked by lift cameras
  const getVisitorForLiftCam = () => activeVisitors[0] || null;

  return (
    <div className={`camera-monitor ${fullscreen ? 'fullscreen' : ''}`}>
      {/* Breach alert banner */}
      {breachAlerts.length > 0 && (
        <div className="breach-banner">
          <AlertTriangle size={18} />
          <span>🚨 INFILTRATION ALERT — {breachAlerts.length} checkpoint breach(es) detected!</span>
          <button onClick={() => setBreachAlerts([])} className="breach-dismiss">✕</button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="cam-controls">
        <div className="cam-controls-left">
          <div className="cam-live-indicator">
            <span className="cam-live-dot" />
            LIVE
          </div>
          <span className="cam-count">{cameras.filter(c => c.status === 'online').length}/{cameras.length} Online</span>
          <span className="cam-visitors-count">
            <Users size={14} /> {activeVisitors.length} in transit
          </span>
        </div>

        <div className="cam-controls-center">
          {/* Filter by type */}
          <div className="cam-filter-group">
            {['all','gate','lift','corridor','lobby','door'].map(t => (
              <button
                key={t}
                className={`cam-filter-btn ${filterType === t ? 'active' : ''}`}
                onClick={() => setFilterType(t)}
                style={filterType === t && t !== 'all' ? { background: `${CAMERA_TYPE_COLORS[t]}22`, color: CAMERA_TYPE_COLORS[t], borderColor: `${CAMERA_TYPE_COLORS[t]}55` } : {}}
              >
                {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="cam-controls-right">
          <button
            className={`cam-grid-btn ${gridMode === '2x2' ? 'active' : ''}`}
            onClick={() => setGridMode('2x2')}
            title="2×2 grid"
          >
            <Grid3X3 size={16} />
          </button>
          <button
            className={`cam-grid-btn ${gridMode === '3x3' ? 'active' : ''}`}
            onClick={() => setGridMode('3x3')}
            title="3×3 grid"
          >
            <Filter size={16} />
          </button>
          <button
            className="cam-grid-btn"
            onClick={() => setFullscreen(f => !f)}
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button className="cam-refresh-btn" onClick={fetchData} title="Refresh">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      <div className="cam-body">
        {/* Camera Grid */}
        <div className={`cam-grid cam-grid-${gridMode}`}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="cam-feed loading">
                <div className="cam-feed-inner">
                  <RefreshCw size={24} className="spin" />
                  <span>Loading…</span>
                </div>
              </div>
            ))
          ) : visibleCams.length === 0 ? (
            <div className="cam-empty">
              <Camera size={36} />
              <p>No cameras found</p>
            </div>
          ) : visibleCams.map((cam, i) => {
            const isLift          = cam.type === 'lift';
            const visitor         = isLift ? getVisitorForLiftCam() : null;
            const isSelected      = selectedCam?.id === cam.id;
            const typeColor       = CAMERA_TYPE_COLORS[cam.type] || '#fff';
            const isOffline       = cam.status !== 'online';

            // Compute timer countdown for lift cams
            let timerSeconds = null;
            if (isLift && visitor) {
              // Active visitors don't have seconds in this endpoint but we show they're tracked
              timerSeconds = 21; // default display; real countdown shown in lift overlay
            }

            return (
              <div
                key={cam.id}
                className={`cam-feed ${isOffline ? 'offline' : ''} ${isSelected ? 'selected' : ''} ${isLift && visitor ? 'lift-active' : ''}`}
                onClick={() => setSelectedCam(isSelected ? null : cam)}
              >
                {/* Feed video or placeholder */}
                <div className="cam-feed-inner">
                  {isSelected && !isOffline ? (
                    <video ref={videoRef} autoPlay playsInline muted className="cam-video" />
                  ) : (
                    <div className="cam-placeholder-feed">
                      <div className="cam-noise" />
                      {isOffline ? (
                        <div className="cam-offline-overlay">
                          <WifiOff size={28} />
                          <span>Offline</span>
                        </div>
                      ) : (
                        <div className="cam-online-overlay">
                          <Eye size={16} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Lift cam visitor timer overlay */}
                  {isLift && visitor && !isOffline && (
                    <LiftTimerOverlay visitor={visitor} />
                  )}
                </div>

                {/* Camera label bar */}
                <div className="cam-label-bar">
                  <div className="cam-label-left">
                    <span
                      className="cam-type-dot"
                      style={{ background: typeColor, boxShadow: `0 0 6px ${typeColor}` }}
                    />
                    <span className="cam-name">{cam.name}</span>
                  </div>
                  <div className="cam-label-right">
                    <span className="cam-location">{cam.location}</span>
                    {cam.floor !== null && (
                      <span className="cam-floor">F{cam.floor}</span>
                    )}
                    <span className={`cam-status-dot ${cam.status}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar — active visitor tracking */}
        <div className="cam-sidebar">
          <div className="cam-sidebar-header">
            <Shield size={16} />
            <h3>Visitor Tracking</h3>
          </div>

          {activeVisitors.length === 0 ? (
            <div className="cam-sidebar-empty">
              <Shield size={24} />
              <p>No visitors in transit</p>
            </div>
          ) : activeVisitors.map((v, i) => (
            <div key={v.id} className="cam-visitor-card" style={{ animationDelay: `${i * 0.1}s` }}>
              {v.guard_photo_url || v.photo_url ? (
                <img src={v.guard_photo_url || v.photo_url} alt={v.name} className="cam-visitor-photo" />
              ) : (
                <div className="cam-visitor-avatar">{v.name?.[0]?.toUpperCase() || '?'}</div>
              )}
              <div className="cam-visitor-info">
                <span className="cam-visitor-name">{v.name}</span>
                <span className="cam-visitor-flat">→ {v.target_flat}</span>
                <span className="cam-visitor-time">
                  <Clock size={11} />
                  {new Date(v.entry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="cam-visitor-status tracking">
                <span className="tracking-dot" />
                Tracking
              </div>
            </div>
          ))}

          {/* Camera list */}
          <div className="cam-sidebar-section">
            <h4>All Cameras</h4>
            {cameras.map(cam => {
              const color = CAMERA_TYPE_COLORS[cam.type] || '#fff';
              return (
                <button
                  key={cam.id}
                  className={`cam-list-item ${selectedCam?.id === cam.id ? 'active' : ''} ${cam.status}`}
                  onClick={() => setSelectedCam(prev => prev?.id === cam.id ? null : cam)}
                >
                  <span className="cam-list-dot" style={{ background: color }} />
                  <div className="cam-list-info">
                    <span className="cam-list-name">{cam.name}</span>
                    <span className="cam-list-loc">{cam.location}</span>
                  </div>
                  <span className={`cam-list-status ${cam.status}`}>
                    {cam.status === 'online' ? <Wifi size={12} /> : <WifiOff size={12} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Lift cam timer overlay with countdown
function LiftTimerOverlay({ visitor }) {
  const [seconds, setSeconds] = useState(21);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const pct      = (seconds / 21) * 100;
  const color    = seconds > 14 ? '#34d399' : seconds > 7 ? '#fbbf24' : '#f87171';
  const isBreach = seconds === 0;

  return (
    <div className={`lift-timer-overlay ${isBreach ? 'breach' : ''}`}>
      {isBreach ? (
        <div className="lift-breach-alert">
          <AlertTriangle size={24} />
          <span>INFILTRATION ALERT</span>
          <span className="breach-name">{visitor.name}</span>
        </div>
      ) : (
        <>
          <div className="lift-timer-header">
            <Clock size={12} />
            <span>Visitor in Lift</span>
          </div>
          <div className="lift-visitor-name">{visitor.name}</div>
          <div className="lift-timer-ring">
            <svg viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
              <circle
                cx="30" cy="30" r="26" fill="none"
                stroke={color}
                strokeWidth="5"
                strokeDasharray={`${(pct / 100) * 163} 163`}
                strokeDashoffset="0"
                transform="rotate(-90 30 30)"
                strokeLinecap="round"
                style={{ transition: 'stroke 0.5s ease' }}
              />
            </svg>
            <span className="lift-timer-count" style={{ color }}>{seconds}s</span>
          </div>
          <div className="lift-timer-dest">→ {visitor.target_flat}</div>
        </>
      )}
    </div>
  );
}
