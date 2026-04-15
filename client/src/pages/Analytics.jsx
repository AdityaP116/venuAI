import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users, ShieldAlert, CheckCircle, TrendingUp, BarChart2, RefreshCw, WifiOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Analytics.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// ===== Sub-components =====

function StatCard({ label, value, delta, deltaUp, icon: Icon, color }) {
  return (
    <div className={`analytics-stat-card ${color}`}>
      <div className="stat-card-top">
        <div className={`stat-card-icon ${color}`}>
          <Icon size={18} />
        </div>
        {delta && (
          <span className={`stat-card-delta ${deltaUp ? 'up' : 'down'}`}>
            {deltaUp ? '↑' : '↓'} {delta}
          </span>
        )}
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.count), 1);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIdx = new Date().getDay();
  const todayLabel = days[(todayIdx + 6) % 7];

  return (
    <div className="bar-chart">
      {data.map((d, i) => {
        const heightPct = max > 0 ? (d.count / max) * 100 : 0;
        const isToday = d.day === todayLabel;
        return (
          <div key={d.day} className="bar-group">
            <div className="bar-wrapper">
              <div
                className={`chart-bar ${isToday ? 'today' : 'past'}`}
                style={{ height: `${Math.max(heightPct, 4)}%` }}
                title={`${d.day}: ${d.count} visitors`}
              />
            </div>
            <div className="bar-value">{d.count}</div>
            <div className="bar-label">{d.day}</div>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ low, medium, high }) {
  const total = low + medium + high;
  const safeTotal = total || 1;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const cx = 70, cy = 70, r = radius;

  const segments = [
    { value: low,    color: '#34d399', label: 'Low Risk' },
    { value: medium, color: '#fbbf24', label: 'Medium Risk' },
    { value: high,   color: '#f87171', label: 'High Risk' },
  ];

  let offset = 0;
  const paths = segments.map((seg) => {
    const pct = seg.value / safeTotal;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const el = (
      <circle
        key={seg.label}
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={seg.color}
        strokeWidth="14"
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px`, transition: 'stroke-dasharray 0.6s ease' }}
      />
    );
    offset += dash;
    return el;
  });

  const approvalRate = total > 0 ? Math.round((low / total) * 100) : 0;

  return (
    <div className="donut-chart-wrapper">
      <div className="donut-svg-container">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
          {paths}
        </svg>
        <div className="donut-center-text">
          <div className="donut-center-value">{approvalRate}%</div>
          <div className="donut-center-label">Low Risk</div>
        </div>
      </div>
      <div className="donut-legend">
        {segments.map(seg => (
          <div key={seg.label} className="donut-legend-item">
            <div className="donut-legend-left">
              <div className="donut-legend-dot" style={{ background: seg.color }} />
              <span className="donut-legend-label">{seg.label}</span>
            </div>
            <span className="donut-legend-count">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Heatmap() {
  const HOURS = [6, 9, 12, 15, 18, 21];
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const heat = useMemo(() => {
    return DAYS.map(day =>
      Array.from({ length: 24 }, (_, h) => {
        const seed = (day.charCodeAt(0) + h * 13) % 47;
        let base = 0;
        if (h >= 8 && h <= 10) base = 3;
        else if (h >= 14 && h <= 16) base = 2;
        else if (h >= 6 && h < 8) base = 1;
        else if (h >= 17 && h <= 19) base = 2;
        const level = Math.min(4, base + (seed % 3));
        return { hour: h, level };
      })
    );
  }, []);

  return (
    <div className="heatmap-grid">
      <div className="heatmap-hours">
        {Array.from({ length: 24 }, (_, h) => (
          <div key={h} className="heatmap-hour-label" style={{ opacity: HOURS.includes(h) ? 1 : 0 }}>
            {h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`}
          </div>
        ))}
      </div>
      {heat.map((dayData, di) => (
        <div key={DAYS[di]} className="heatmap-row">
          <div className="heatmap-day-label">{DAYS[di]}</div>
          <div className="heatmap-cells">
            {dayData.map((cell, hi) => (
              <div key={hi} className={`heatmap-cell level-${cell.level}`} title={`${DAYS[di]} ${cell.hour}:00`} />
            ))}
          </div>
        </div>
      ))}
      <div className="heatmap-legend">
        <span className="heatmap-legend-label">Less</span>
        <div className="heatmap-legend-scale">
          {[0, 1, 2, 3, 4].map(l => (
            <div key={l} className="heatmap-legend-cell"
              style={{ background: `rgba(139, 92, 246, ${l === 0 ? 0.06 : l * 0.2 + 0.1})` }}
            />
          ))}
        </div>
        <span className="heatmap-legend-label">More</span>
      </div>
    </div>
  );
}

function TopUnits({ visitors }) {
  const unitCounts = useMemo(() => {
    const counts = {};
    visitors.forEach(v => {
      const u = v.target_flat || 'Unknown';
      counts[u] = (counts[u] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 7);
  }, [visitors]);
  const max = unitCounts[0]?.[1] || 1;

  if (unitCounts.length === 0) return (
    <div style={{ textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.3)' }}>
      No visitor data yet
    </div>
  );

  return (
    <div className="top-units-list">
      {unitCounts.map(([unit, count], i) => (
        <div key={unit} className="top-unit-row">
          <div className="top-unit-rank">#{i + 1}</div>
          <div className="top-unit-bar-wrapper">
            <div className="top-unit-info">
              <span className="top-unit-name">{unit}</span>
              <span className="top-unit-count">{count} visits</span>
            </div>
            <div className="top-unit-progress">
              <div className="top-unit-fill" style={{ width: `${(count / max) * 100}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== Main Component =====
export default function Analytics() {
  const { getIdToken } = useAuth();
  const [visitors, setVisitors]   = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      const headers = { Authorization: `Bearer ${token}` };
      const [visRes, altRes] = await Promise.all([
        fetch(`${API}/api/visitors?limit=200`, { headers }),
        fetch(`${API}/api/alerts`, { headers }),
      ]);
      const visData = await visRes.json();
      const altData = altRes.ok ? await altRes.json() : { alerts: [] };
      setVisitors(visData.visitors || []);
      setAlertsData(altData.alerts || []);
    } catch {
      setError('Could not reach server.');
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Compute stats from real data
  const totalVisitors  = visitors.length;
  const approvedCount  = visitors.filter(v => v.status === 'approved').length;
  const deniedCount    = visitors.filter(v => v.status === 'denied').length;
  const approvalRate   = totalVisitors > 0 ? Math.round((approvedCount / totalVisitors) * 100) : 0;
  const activeAlerts   = alertsData.filter(a => !a.resolved).length;
  const avgTrust       = totalVisitors > 0
    ? Math.round(visitors.reduce((s, v) => s + (v.trust_score || 0), 0) / totalVisitors)
    : 0;

  const riskDist = {
    low:    visitors.filter(v => v.trust_level === 'Low').length,
    medium: visitors.filter(v => v.trust_level === 'Medium').length,
    high:   visitors.filter(v => v.trust_level === 'High').length,
  };

  // Build weekly data from real visitors
  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const counts = { Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0, Sun:0 };
    const allDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    visitors.forEach(v => {
      const d = new Date(v.entry_time || v.created_at);
      if (!isNaN(d)) counts[allDays[d.getDay()]] = (counts[allDays[d.getDay()]] || 0) + 1;
    });
    return days.map(day => ({ day, count: counts[day] || 0 }));
  }, [visitors]);

  if (loading) return (
    <div className="analytics-page" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight: 400 }}>
      <div style={{ textAlign:'center', color:'rgba(255,255,255,0.5)' }}>
        <RefreshCw size={32} style={{ animation:'spin 1s linear infinite', marginBottom: 12 }} />
        <p>Loading analytics…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="analytics-page" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:400 }}>
      <div style={{ textAlign:'center', color:'rgba(255,255,255,0.5)' }}>
        <WifiOff size={36} style={{ marginBottom: 12, color:'#f87171' }} />
        <p style={{ color:'#f87171', marginBottom: 8 }}>{error}</p>
        <button onClick={fetchData} style={{ padding:'8px 20px', borderRadius:8, background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.3)', color:'#a78bfa', cursor:'pointer' }}>
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="analytics-page">
      {/* Summary Stats */}
      <div className="analytics-summary">
        <StatCard label="Total Visitors" value={totalVisitors.toLocaleString()} icon={Users} color="purple" />
        <StatCard label="Approval Rate" value={`${approvalRate}%`} deltaUp icon={CheckCircle} color="green" />
        <StatCard label="Active Alerts" value={activeAlerts} deltaUp={false} icon={ShieldAlert} color="red" />
        <StatCard label="Avg. Trust Score" value={avgTrust || '—'} deltaUp icon={TrendingUp} color="cyan" />
      </div>

      {/* Charts Row */}
      <div className="analytics-charts-row">
        <div className="analytics-chart-card">
          <div className="chart-card-header">
            <h3><BarChart2 size={16} /> Weekly Visitor Volume</h3>
            <div className="chart-live-badge">
              <div className="chart-live-dot" />
              Live
            </div>
          </div>
          {totalVisitors === 0 ? (
            <div style={{ textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.3)' }}>No visitor data yet</div>
          ) : <BarChart data={weeklyData} />}
        </div>

        <div className="analytics-chart-card">
          <div className="chart-card-header">
            <h3>Risk Distribution</h3>
          </div>
          <DonutChart low={riskDist.low} medium={riskDist.medium} high={riskDist.high} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="analytics-bottom-row">
        <div className="analytics-chart-card">
          <div className="chart-card-header">
            <h3>Traffic Heatmap — Hour × Day</h3>
          </div>
          <Heatmap />
        </div>

        <div className="analytics-chart-card">
          <div className="chart-card-header">
            <h3>Top Visited Units</h3>
          </div>
          <TopUnits visitors={visitors} />
        </div>
      </div>
    </div>
  );
}
