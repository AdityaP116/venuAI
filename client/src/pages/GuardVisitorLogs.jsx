import { useState, useEffect, useCallback } from 'react';
import {
  ScrollText, User, Clock, Phone, MapPin, FileText,
  ChevronDown, ChevronRight, Camera, Shield, Search,
  Filter, RefreshCw, Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './GuardVisitorLogs.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function GuardVisitorLogs() {
  const { getIdToken } = useAuth();

  const [visitors,    setVisitors]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [expanded,    setExpanded]    = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getIdToken();
      const res   = await fetch(`${API}/api/visitors?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      setVisitors(data.visitors || []);
    } catch {}
    setLoading(false);
  }, [getIdToken]);

  useEffect(() => { fetchVisitors(); }, [fetchVisitors]);

  const filtered = visitors.filter(v => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      v.name?.toLowerCase().includes(q) ||
      v.target_flat?.toLowerCase().includes(q) ||
      v.phone?.includes(q) ||
      v.purpose?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const exportCSV = () => {
    const headers = ['Visitor Name', 'Entry Time', 'Phone', 'Purpose', 'Visited Flat', 'Status'];
    const rows    = filtered.map(v => [
      v.name,
      new Date(v.entry_time || v.created_at).toLocaleString(),
      v.phone || '-',
      v.purpose || '-',
      v.target_flat || '-',
      v.status,
    ]);
    const csv  = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'visitor-logs.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const STATUS_COLORS = {
    pending:  { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
    approved: { color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
    denied:   { color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
    exited:   { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
  };

  return (
    <div className="gvl-page">
      {/* Header */}
      <div className="gvl-header">
        <div className="gvl-header-left">
          <div className="gvl-icon">
            <ScrollText size={20} />
          </div>
          <div>
            <h2>Visitor Logs</h2>
            <p>{filtered.length} of {visitors.length} entries</p>
          </div>
        </div>

        <div className="gvl-header-actions">
          <button className="gvl-export-btn" onClick={exportCSV} id="export-csv">
            <Download size={15} /> Export CSV
          </button>
          <button className="gvl-refresh-btn" onClick={fetchVisitors} title="Refresh">
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="gvl-filters">
        <div className="gvl-search">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search by name, flat, phone, purpose…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="gvl-search"
          />
        </div>

        <div className="gvl-status-filter">
          {['all','pending','approved','denied','exited'].map(s => (
            <button
              key={s}
              className={`gvl-filter-pill ${statusFilter === s ? 'active' : ''}`}
              onClick={() => setStatusFilter(s)}
              style={statusFilter === s && s !== 'all' ? {
                background: STATUS_COLORS[s]?.bg,
                color:      STATUS_COLORS[s]?.color,
                borderColor:`${STATUS_COLORS[s]?.color}55`,
              } : {}}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="gvl-table-wrap">
        {/* Table Header */}
        <div className="gvl-table-head">
          <div className="gvl-th photo">Photo</div>
          <div className="gvl-th name">Visitor Name</div>
          <div className="gvl-th time">Entry Time</div>
          <div className="gvl-th phone">Phone</div>
          <div className="gvl-th purpose">Purpose of Visit</div>
          <div className="gvl-th flat">Visited Flat</div>
          <div className="gvl-th status">Status</div>
          <div className="gvl-th expand" />
        </div>

        {/* Rows */}
        <div className="gvl-table-body">
          {loading && (
            <div className="gvl-loading">
              <RefreshCw size={28} className="spin" />
              <p>Loading visitor logs…</p>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="gvl-empty">
              <Shield size={36} />
              <p>No visitor logs found</p>
              {search && <span>Try adjusting your search</span>}
            </div>
          )}

          {!loading && filtered.map((v, i) => {
            const sc      = STATUS_COLORS[v.status] || STATUS_COLORS.pending;
            const isOpen  = expanded === v.id;
            const entryTime = new Date(v.entry_time || v.created_at);

            return (
              <div key={v.id} className={`gvl-row ${isOpen ? 'expanded' : ''}`} style={{ animationDelay: `${Math.min(i,10) * 0.04}s` }}>
                {/* Main Row */}
                <div
                  className="gvl-row-main"
                  onClick={() => setExpanded(isOpen ? null : v.id)}
                >
                  {/* Photo */}
                  <div className="gvl-td photo">
                    {(v.guard_photo_url || v.photo_url) ? (
                      <img src={v.guard_photo_url || v.photo_url} alt={v.name} className="gvl-photo" />
                    ) : (
                      <div className="gvl-photo-placeholder">
                        {v.name?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="gvl-td name">
                    <span className="gvl-visitor-name">{v.name}</span>
                    {v.visitor_unique_id && (
                      <span className="gvl-visitor-uid">{v.visitor_unique_id}</span>
                    )}
                  </div>

                  {/* Entry Time */}
                  <div className="gvl-td time">
                    <span className="gvl-date">{entryTime.toLocaleDateString()}</span>
                    <span className="gvl-time">{entryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {/* Phone */}
                  <div className="gvl-td phone">
                    <span>{v.phone || '—'}</span>
                  </div>

                  {/* Purpose */}
                  <div className="gvl-td purpose">
                    <span className="gvl-purpose-chip">{v.purpose || '—'}</span>
                  </div>

                  {/* Flat */}
                  <div className="gvl-td flat">
                    <span className="gvl-flat">{v.target_flat || '—'}</span>
                  </div>

                  {/* Status */}
                  <div className="gvl-td status">
                    <span
                      className="gvl-status-badge"
                      style={{ color: sc.color, background: sc.bg, border: `1px solid ${sc.color}44` }}
                    >
                      {v.status}
                    </span>
                  </div>

                  {/* Expand */}
                  <div className="gvl-td expand">
                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                </div>

                {/* Expanded Detail */}
                {isOpen && (
                  <div className="gvl-row-detail">
                    <div className="gvl-detail-grid">
                      {(v.guard_photo_url || v.photo_url) && (
                        <div className="gvl-detail-photo-wrap">
                          <img src={v.guard_photo_url || v.photo_url} alt={v.name} className="gvl-detail-photo" />
                          <span className="gvl-photo-label">
                            <Camera size={12} /> Gate Photo
                          </span>
                        </div>
                      )}
                      <div className="gvl-detail-fields">
                        <div className="gvl-detail-field">
                          <span className="dl">Visitor ID</span>
                          <span className="dv mono">{v.visitor_unique_id || v.id}</span>
                        </div>
                        <div className="gvl-detail-field">
                          <span className="dl">Trust Score</span>
                          <span className="dv">{v.trust_score ?? '—'} / 100 ({v.trust_level || '?'} Risk)</span>
                        </div>
                        <div className="gvl-detail-field">
                          <span className="dl">Checkpoint</span>
                          <span className="dv">{v.checkpoint_status || 'N/A'}</span>
                        </div>
                        {v.exit_time && (
                          <div className="gvl-detail-field">
                            <span className="dl">Exit Time</span>
                            <span className="dv">{new Date(v.exit_time).toLocaleString()}</span>
                          </div>
                        )}
                        {v.guard && (
                          <div className="gvl-detail-field">
                            <span className="dl">Logged By</span>
                            <span className="dv">{v.guard.name}</span>
                          </div>
                        )}
                        {v.resident && (
                          <div className="gvl-detail-field">
                            <span className="dl">Resident</span>
                            <span className="dv">{v.resident.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
