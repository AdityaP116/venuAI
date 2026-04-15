import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search, Download, ChevronDown, ChevronUp,
  CheckCircle, XCircle, Clock, ArrowUpDown, RefreshCw, WifiOff, Shield
} from 'lucide-react';
import { getTrustColor } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import './Logs.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function Logs() {
  const { getIdToken } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const [searchQuery, setSearchQuery]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter]     = useState('all');
  const [sortField, setSortField]       = useState('created_at');
  const [sortDir, setSortDir]           = useState('desc');
  const [expandedRow, setExpandedRow]   = useState(null);
  const [currentPage, setCurrentPage]   = useState(1);
  const pageSize = 10;

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      const params = new URLSearchParams({
        page: currentPage,
        limit: pageSize,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery }),
      });
      const res = await fetch(`${API}/api/visitors?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVisitors(data.visitors || []);
      setTotalCount(data.total || data.visitors?.length || 0);
    } catch {
      setError('Could not reach server.');
    } finally {
      setLoading(false);
    }
  }, [getIdToken, currentPage, statusFilter, searchQuery]);

  useEffect(() => { fetchVisitors(); }, [fetchVisitors]);

  const filtered = useMemo(() => {
    let result = [...visitors];
    if (riskFilter !== 'all') result = result.filter(v => v.trust_level === riskFilter);
    result.sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      const dir = sortDir === 'asc' ? 1 : -1;
      if (typeof aVal === 'number') return (aVal - bVal) * dir;
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
    return result;
  }, [visitors, riskFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const exportLogs = () => {
    const csv = [
      ['Visitor ID', 'Name', 'Phone', 'Purpose', 'Flat', 'Status', 'Trust Score', 'Entry Time', 'Exit Time'].join(','),
      ...filtered.map(v => [
        v.visitor_unique_id || v.id,
        v.name, v.phone || '', v.purpose || '', v.target_flat || '',
        v.status, v.trust_score ?? '',
        new Date(v.entry_time || v.created_at).toLocaleString(),
        v.exit_time ? new Date(v.exit_time).toLocaleString() : 'N/A',
      ].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sentraai_logs.csv'; a.click();
  };

  return (
    <div className="logs-page">
      {/* Toolbar */}
      <div className="logs-toolbar">
        <div className="logs-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by name, purpose, flat..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            id="logs-search-input"
          />
        </div>

        <div className="logs-filters">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="logs-select" id="status-filter"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="denied">Denied</option>
            <option value="exited">Exited</option>
          </select>

          <select
            value={riskFilter}
            onChange={e => { setRiskFilter(e.target.value); setCurrentPage(1); }}
            className="logs-select" id="risk-filter"
          >
            <option value="all">All Risk</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>

          <button className="logs-export-btn" onClick={exportLogs} id="export-logs-btn">
            <Download size={14} />
            Export CSV
          </button>

          <button className="logs-export-btn" onClick={fetchVisitors} id="refresh-logs-btn" title="Refresh">
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* Results info */}
      <div className="logs-info">
        <span>{loading ? 'Loading…' : `${filtered.length} records`}</span>
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      {/* Error */}
      {error && (
        <div style={{ textAlign:'center', padding:'3rem', color:'#f87171' }}>
          <WifiOff size={36} style={{ marginBottom: 8 }} />
          <p>{error}</p>
          <button onClick={fetchVisitors} style={{ marginTop: 12, padding:'8px 20px', borderRadius:8, background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.3)', color:'#a78bfa', cursor:'pointer' }}>
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'4rem', color:'rgba(255,255,255,0.3)' }}>
          <Shield size={48} style={{ marginBottom: 12 }} />
          <h3 style={{ marginBottom: 8 }}>No visitor records yet</h3>
          <p>Guard-submitted visitor entries will appear here</p>
        </div>
      )}

      {/* Table */}
      {!error && filtered.length > 0 && (
        <div className="logs-table-wrapper">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Visitor</th>
                <th className="sortable" onClick={() => toggleSort('purpose')}>
                  Purpose <ArrowUpDown size={12} />
                </th>
                <th className="sortable" onClick={() => toggleSort('target_flat')}>
                  Flat <ArrowUpDown size={12} />
                </th>
                <th className="sortable" onClick={() => toggleSort('trust_score')}>
                  Trust <ArrowUpDown size={12} />
                </th>
                <th className="sortable" onClick={() => toggleSort('status')}>
                  Status <ArrowUpDown size={12} />
                </th>
                <th className="sortable" onClick={() => toggleSort('created_at')}>
                  Entry Time <ArrowUpDown size={12} />
                </th>
                <th>Visitor ID</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => {
                const trust = getTrustColor(v.trust_level);
                const isExpanded = expandedRow === v.id;
                return (
                  <>
                    <tr
                      key={v.id}
                      className={`log-row ${isExpanded ? 'expanded' : ''}`}
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      <td>
                        <div className="log-visitor">
                          {v.photo_url
                            ? <img src={v.photo_url} alt={v.name} />
                            : <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(139,92,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:'#a78bfa', flexShrink:0 }}>
                                {v.name?.[0]?.toUpperCase() || '?'}
                              </div>
                          }
                          <div>
                            <span className="log-name">{v.name}</span>
                            <span className="log-id">{v.visitor_unique_id || v.id?.slice(0,8)}</span>
                          </div>
                        </div>
                      </td>
                      <td>{v.purpose || '—'}</td>
                      <td><span className="unit-tag">{v.target_flat || '—'}</span></td>
                      <td>
                        <span className="trust-score" style={{ color: trust.color, background: trust.bg }}>
                          {v.trust_score ?? '—'}
                        </span>
                      </td>
                      <td>
                        <span className={`log-status ${v.status}`}>
                          {v.status === 'approved' && <CheckCircle size={12} />}
                          {v.status === 'pending'  && <Clock size={12} />}
                          {(v.status === 'denied' || v.status === 'exited') && <XCircle size={12} />}
                          {v.status}
                        </span>
                      </td>
                      <td className="time-cell">
                        {new Date(v.entry_time || v.created_at).toLocaleString([], {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td><span className="verification-tag">{v.visitor_unique_id || '—'}</span></td>
                      <td>
                        <button
                          className="expand-btn"
                          onClick={() => setExpandedRow(isExpanded ? null : v.id)}
                          id={`expand-${v.id}`}
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${v.id}-detail`} className="detail-row">
                        <td colSpan={8}>
                          <div className="log-detail-panel">
                            <div className="log-detail-item">
                              <span>Phone:</span> <strong>{v.phone || 'N/A'}</strong>
                            </div>
                            <div className="log-detail-item">
                              <span>Guard:</span> <strong>{v.guard?.name || 'N/A'}</strong>
                            </div>
                            <div className="log-detail-item">
                              <span>Resident:</span> <strong>{v.resident?.name || 'N/A'}</strong>
                            </div>
                            <div className="log-detail-item">
                              <span>Exit Time:</span>
                              <strong>{v.exit_time ? new Date(v.exit_time).toLocaleString() : 'Still on premises'}</strong>
                            </div>
                            {v.entry_time && v.exit_time && (
                              <div className="log-detail-item">
                                <span>Duration:</span>
                                <strong>{Math.round((new Date(v.exit_time) - new Date(v.entry_time)) / 60000)} min</strong>
                              </div>
                            )}
                            <div className="log-detail-item">
                              <span>Trust Level:</span>
                              <strong style={{ color: getTrustColor(v.trust_level).color }}>
                                {v.trust_level || 'N/A'} Risk
                              </strong>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="logs-pagination">
        <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} id="prev-page">
          Previous
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
          if (pageNum > totalPages) return null;
          return (
            <button
              key={pageNum}
              className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}
        <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} id="next-page">
          Next
        </button>
      </div>
    </div>
  );
}
