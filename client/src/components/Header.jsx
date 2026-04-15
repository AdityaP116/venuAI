import { Search, Shield, Menu, X, AlertTriangle, User, Clock } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';
import './Header.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Format elapsed seconds into HH:MM:SS
function formatElapsed(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function useShiftTimer(role, getIdToken) {
  const [elapsed, setElapsed] = useState(null);   // seconds
  const [shiftData, setShiftData] = useState(null);
  const intervalRef = useRef(null);

  const fetchShift = useCallback(async () => {
    if (role !== 'guard') return;
    try {
      const token = await getIdToken();
      const res   = await fetch(`${API}/api/shifts/current`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      if (data.shift) {
        setShiftData(data.shift);
        setElapsed(data.elapsed_seconds || 0);
      } else {
        setShiftData(null);
        setElapsed(null);
      }
    } catch {}
  }, [role, getIdToken]);

  // Start local ticker once we have elapsed
  useEffect(() => {
    if (elapsed === null) return;
    intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(intervalRef.current);
  }, [elapsed !== null]);   // only restart if we transition from null→number

  // Fetch shift on mount and every 60s
  useEffect(() => {
    fetchShift();
    const poll = setInterval(fetchShift, 60000);
    return () => clearInterval(poll);
  }, [fetchShift]);

  return { elapsed, shiftData };
}

export default function Header({ onMenuClick, title, subtitle, role }) {
  const { getIdToken } = useAuth();
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching,     setSearching]     = useState(false);
  const searchRef  = useRef(null);
  const debounceId = useRef(null);

  const { elapsed, shiftData } = useShiftTimer(role, getIdToken);

  const isOvertime = elapsed !== null && elapsed >= 12 * 3600;
  const isWarning  = elapsed !== null && elapsed >= 11 * 3600;
  const shiftColor = isOvertime ? '#f87171' : isWarning ? '#fbbf24' : '#34d399';

  useEffect(() => {
    const handler = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        !e.target.closest('#search-toggle')
      ) setSearchResults([]);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (!query.trim()) { setSearchResults([]); return; }
    clearTimeout(debounceId.current);
    debounceId.current = setTimeout(async () => {
      setSearching(true);
      try {
        const token = await getIdToken();
        const res = await fetch(
          `${API}/api/visitors?search=${encodeURIComponent(query)}&limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        const visitors = (data.visitors || []).map(v => ({
          type: 'visitor',
          label: v.name,
          sub: `${v.purpose || '—'} → ${v.target_flat || '—'}`,
          id: v.id,
        }));
        setSearchResults(visitors);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  }, [getIdToken]);

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuClick} id="mobile-menu-btn">
          <Menu size={20} />
        </button>
        <div className="header-title-group">
          <h1 className="header-title">{title || 'Dashboard'}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header-right">
        {/* Guard shift timer */}
        {role === 'guard' && elapsed !== null && (
          <div
            className={`shift-timer-badge ${isOvertime ? 'overtime' : isWarning ? 'warning' : 'active'}`}
            title={`Shift started at ${shiftData?.shift_start ? new Date(shiftData.shift_start).toLocaleTimeString() : '?'}`}
          >
            <Clock size={13} />
            <span className="shift-timer-time" style={{ color: shiftColor }}>
              {formatElapsed(elapsed)}
            </span>
            {isOvertime && <span className="shift-overtime-chip">OVERTIME</span>}
          </div>
        )}

        {/* Search */}
        <div className={`header-search ${searchOpen ? 'open' : ''}`} ref={searchRef}>
          <Search size={16} className="search-icon" style={{ opacity: searching ? 0.5 : 1, transition: 'opacity 0.2s' }} />
          <input
            type="text"
            placeholder="Search visitors..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            className="search-input"
            id="global-search"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => { setSearchQuery(''); setSearchResults([]); }}>
              <X size={14} />
            </button>
          )}
          {searchResults.length > 0 && (
            <div className="search-results-dropdown">
              {searchResults.map((r, i) => (
                <div key={r.id + i} className="search-result-item">
                  <div className={`search-result-icon ${r.type}`}>
                    {r.type === 'visitor' ? <User size={13} /> : <AlertTriangle size={13} />}
                  </div>
                  <div className="search-result-content">
                    <span className="search-result-label">{r.label}</span>
                    <span className="search-result-sub">{r.sub}</span>
                  </div>
                  <span className="search-result-type">{r.type}</span>
                </div>
              ))}
            </div>
          )}
          {searching && searchQuery && searchResults.length === 0 && (
            <div className="search-results-dropdown">
              <div className="search-result-item" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', padding: '0.75rem 1rem' }}>
                Searching…
              </div>
            </div>
          )}
        </div>

        <button className="header-icon-btn" onClick={() => setSearchOpen(!searchOpen)} id="search-toggle" title="Search">
          <Search size={18} />
        </button>

        <NotificationPanel />

        <div className="header-divider" />

        <div className="header-status">
          <Shield size={14} />
          <span>System Active</span>
          <span className="status-pulse" />
        </div>
      </div>
    </header>
  );
}
