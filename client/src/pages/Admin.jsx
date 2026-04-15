import { useState, useEffect, useCallback } from 'react';
import {
  Users, Shield, UserPlus, Trash2, Search, Ban,
  CheckCircle, XCircle, Settings, BarChart3, AlertTriangle,
  EyeOff, Eye, Save, X, RefreshCw, WifiOff
} from 'lucide-react';
import { getTrustColor } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function Admin() {
  const { getIdToken } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  // ── Users ──────────────────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'resident', phone: '', flat_num: '', b_wing_alphabet: '', b_num: '' });
  const [savingUser, setSavingUser] = useState(false);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const token = await getIdToken();
      const res = await fetch(`${API}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setUsersError('Could not load users.');
    } finally {
      setUsersLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const addUser = async () => {
    if (!newUser.name || !newUser.email) return;
    setSavingUser(true);
    try {
      const token = await getIdToken();
      const res = await fetch(`${API}/api/admin/users`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => [data.user, ...prev]);
        setNewUser({ name: '', email: '', role: 'resident', phone: '', flat_num: '', b_wing_alphabet: '', b_num: '' });
        setShowAddUser(false);
      }
    } catch {}
    setSavingUser(false);
  };

  const removeUser = async (id) => {
    if (!window.confirm('Remove this user?')) return;
    try {
      const token = await getIdToken();
      await fetch(`${API}/api/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch {}
  };

  const toggleUserStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const token = await getIdToken();
      await fetch(`${API}/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    } catch {}
  };

  // ── Blacklist ───────────────────────────────────────────────────────────
  const [blacklist, setBlacklist] = useState([]);
  const [blacklistLoading, setBlacklistLoading] = useState(false);
  const [showAddBlacklist, setShowAddBlacklist] = useState(false);
  const [newBlacklist, setNewBlacklist] = useState({ name: '', reason: '' });

  const fetchBlacklist = useCallback(async () => {
    setBlacklistLoading(true);
    try {
      const token = await getIdToken();
      const res = await fetch(`${API}/api/admin/blacklist`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setBlacklist(data.blacklist || []);
    } catch {}
    setBlacklistLoading(false);
  }, [getIdToken]);

  useEffect(() => { if (activeTab === 'blacklist') fetchBlacklist(); }, [activeTab, fetchBlacklist]);

  const addToBlacklist = async () => {
    if (!newBlacklist.name || !newBlacklist.reason) return;
    try {
      const token = await getIdToken();
      const res = await fetch(`${API}/api/admin/blacklist`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlacklist),
      });
      const data = await res.json();
      if (data.success) {
        setBlacklist(prev => [data.entry, ...prev]);
        setNewBlacklist({ name: '', reason: '' });
        setShowAddBlacklist(false);
      }
    } catch {}
  };

  const removeFromBlacklist = async (id) => {
    if (!window.confirm('Remove from blacklist?')) return;
    try {
      const token = await getIdToken();
      await fetch(`${API}/api/admin/blacklist/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setBlacklist(prev => prev.filter(b => b.id !== id));
    } catch {}
  };

  // ── Stats (for analytics tab) ───────────────────────────────────────────
  const [statsData, setStatsData] = useState(null);
  const fetchStats = useCallback(async () => {
    try {
      const token = await getIdToken();
      const res = await fetch(`${API}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setStatsData(data.stats || null);
    } catch {}
  }, [getIdToken]);
  useEffect(() => { if (activeTab === 'analytics') fetchStats(); }, [activeTab, fetchStats]);

  const roleColors = {
    admin:    { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)' },
    guard:    { color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.1)' },
    resident: { color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
  };

  return (
    <div className="admin-page">
      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')} id="tab-users">
          <Users size={16} /> User Management
        </button>
        <button className={`admin-tab ${activeTab === 'blacklist' ? 'active' : ''}`} onClick={() => setActiveTab('blacklist')} id="tab-blacklist">
          <Ban size={16} /> Blacklist / Watchlist
        </button>
        <button className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')} id="tab-analytics">
          <BarChart3 size={16} /> Analytics
        </button>
        <button className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')} id="tab-settings">
          <Settings size={16} /> Settings
        </button>
      </div>

      <div className="admin-content">

        {/* ── Users Tab ── */}
        {activeTab === 'users' && (
          <div className="admin-section animate-fade-in">
            <div className="section-header">
              <div>
                <h2>User Management</h2>
                <p>Manage admins, guards, and residents</p>
              </div>
              <div style={{ display:'flex', gap:'0.5rem' }}>
                <button className="add-btn secondary" onClick={fetchUsers} title="Refresh" style={{ padding:'0.6rem' }}>
                  <RefreshCw size={16} className={usersLoading ? 'spin' : ''} />
                </button>
                <button className="add-btn" onClick={() => setShowAddUser(true)} id="add-user-btn">
                  <UserPlus size={16} /> Add User
                </button>
              </div>
            </div>

            {usersError && (
              <div style={{ textAlign:'center', padding:'2rem', color:'#f87171' }}>
                <WifiOff size={28} style={{ marginBottom: 8 }} />
                <p>{usersError}</p>
              </div>
            )}

            {showAddUser && (
              <div className="add-form animate-fade-in-up">
                <div className="add-form-header">
                  <h3>Add New User</h3>
                  <button className="close-form-btn" onClick={() => setShowAddUser(false)}><X size={16} /></button>
                </div>
                <div className="add-form-fields">
                  <input placeholder="Full Name *" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} id="new-user-name" />
                  <input placeholder="Email Address *" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} id="new-user-email" />
                  <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} id="new-user-role">
                    <option value="admin">Admin</option>
                    <option value="guard">Guard</option>
                    <option value="resident">Resident</option>
                  </select>
                  <input placeholder="Phone" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} />
                  {newUser.role === 'resident' && (
                    <>
                      <input placeholder="Wing (e.g. A)" value={newUser.b_wing_alphabet} onChange={e => setNewUser({ ...newUser, b_wing_alphabet: e.target.value })} />
                      <input placeholder="Flat No. (e.g. 101)" value={newUser.flat_num} onChange={e => setNewUser({ ...newUser, flat_num: e.target.value })} />
                    </>
                  )}
                  <button className="save-btn" onClick={addUser} id="save-user-btn" disabled={savingUser}>
                    <Save size={14} /> {savingUser ? 'Saving…' : 'Save User'}
                  </button>
                </div>
              </div>
            )}

            {usersLoading ? (
              <div style={{ textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.4)' }}>
                <RefreshCw size={28} style={{ animation:'spin 1s linear infinite', marginBottom: 8 }} />
                <p>Loading users…</p>
              </div>
            ) : (
              <div className="users-grid">
                {users.length === 0 ? (
                  <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.3)' }}>
                    <Users size={40} style={{ marginBottom: 12 }} />
                    <p>No users yet. Add the first user above.</p>
                  </div>
                ) : users.map((user, i) => (
                  <div key={user.id} className="user-card" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="user-card-top">
                      {user.avatar_url
                        ? <img src={user.avatar_url} alt={user.name} className="user-card-avatar" />
                        : <div className="user-card-avatar" style={{ display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(139,92,246,0.15)', color:'#a78bfa', fontSize:18, fontWeight:700 }}>
                            {user.name?.[0]?.toUpperCase() || '?'}
                          </div>
                      }
                      <div className="user-card-info">
                        <span className="user-card-name">{user.name}</span>
                        <span className="user-card-email">{user.email}</span>
                        {user.role === 'resident' && (user.b_wing_alphabet || user.flat_num) && (
                          <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.4)' }}>
                            Flat {user.b_wing_alphabet}-{user.flat_num}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="user-card-meta">
                      <span className="role-badge" style={{ color: roleColors[user.role]?.color, background: roleColors[user.role]?.bg }}>
                        {user.role}
                      </span>
                      <span className={`user-status ${user.status}`}>
                        {user.status === 'active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {user.status}
                      </span>
                    </div>
                    <div className="user-card-actions">
                      <button className="user-action-btn toggle" onClick={() => toggleUserStatus(user.id, user.status)} title={user.status === 'active' ? 'Deactivate' : 'Activate'}>
                        {user.status === 'active' ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button className="user-action-btn delete" onClick={() => removeUser(user.id)} title="Remove">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Blacklist Tab ── */}
        {activeTab === 'blacklist' && (
          <div className="admin-section animate-fade-in">
            <div className="section-header">
              <div>
                <h2>Blacklist / Watchlist</h2>
                <p>Manage flagged and banned visitors</p>
              </div>
              <button className="add-btn danger" onClick={() => setShowAddBlacklist(true)} id="add-blacklist-btn">
                <Ban size={16} /> Add to Blacklist
              </button>
            </div>

            {showAddBlacklist && (
              <div className="add-form animate-fade-in-up">
                <div className="add-form-header">
                  <h3>Add to Blacklist</h3>
                  <button className="close-form-btn" onClick={() => setShowAddBlacklist(false)}><X size={16} /></button>
                </div>
                <div className="add-form-fields">
                  <input placeholder="Person Name *" value={newBlacklist.name} onChange={e => setNewBlacklist({ ...newBlacklist, name: e.target.value })} id="blacklist-name" />
                  <input placeholder="Reason for blacklisting *" value={newBlacklist.reason} onChange={e => setNewBlacklist({ ...newBlacklist, reason: e.target.value })} id="blacklist-reason" />
                  <button className="save-btn danger" onClick={addToBlacklist} id="save-blacklist-btn">
                    <Ban size={14} /> Add to Blacklist
                  </button>
                </div>
              </div>
            )}

            {blacklistLoading ? (
              <div style={{ textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.4)' }}>
                <RefreshCw size={28} style={{ animation:'spin 1s linear infinite', marginBottom: 8 }} />
                <p>Loading blacklist…</p>
              </div>
            ) : (
              <div className="blacklist-grid">
                {blacklist.length === 0 ? (
                  <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.3)' }}>
                    <Shield size={40} style={{ marginBottom: 12 }} />
                    <p>No blacklisted visitors</p>
                  </div>
                ) : blacklist.map((person, i) => (
                  <div key={person.id} className="blacklist-card" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="blacklist-card-header">
                      {person.photo_url
                        ? <img src={person.photo_url} alt={person.name} />
                        : <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(248,113,113,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#f87171', fontSize:18, fontWeight:700 }}>
                            {person.name?.[0]?.toUpperCase() || '?'}
                          </div>
                      }
                      <div>
                        <span className="blacklist-name">{person.name}</span>
                        <span className="blacklist-id">{person.id?.slice(0, 8)}</span>
                      </div>
                      <button className="remove-blacklist-btn" onClick={() => removeFromBlacklist(person.id)} title="Remove from blacklist">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="blacklist-card-body">
                      <div className="blacklist-field">
                        <span>Reason</span>
                        <strong>{person.reason}</strong>
                      </div>
                      <div className="blacklist-field">
                        <span>Added On</span>
                        <strong>{person.created_at ? new Date(person.created_at).toLocaleDateString() : '—'}</strong>
                      </div>
                    </div>
                    <div className="blacklist-card-footer">
                      <AlertTriangle size={12} />
                      Auto-deny enabled
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Analytics Tab ── */}
        {activeTab === 'analytics' && (
          <div className="admin-section animate-fade-in">
            <div className="section-header">
              <div>
                <h2>Security Analytics</h2>
                <p>Real-time system performance</p>
              </div>
              <button className="add-btn secondary" onClick={fetchStats} title="Refresh" style={{ padding:'0.6rem' }}>
                <RefreshCw size={16} />
              </button>
            </div>

            <div className="analytics-cards">
              <div className="analytics-card">
                <div className="analytics-label">Total Visitors</div>
                <div className="analytics-value">{statsData?.total_visitors ?? '—'}</div>
                <div className="analytics-trend neutral">All-time entries</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-label">Today's Visitors</div>
                <div className="analytics-value">{statsData?.today_visitors ?? '—'}</div>
                <div className="analytics-trend neutral">Since midnight</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-label">Active Alerts</div>
                <div className="analytics-value">{statsData?.active_alerts ?? '—'}</div>
                <div className="analytics-trend neutral">Unresolved</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-label">Pending Approvals</div>
                <div className="analytics-value">{statsData?.pending_approvals ?? '—'}</div>
                <div className="analytics-trend neutral">Awaiting OTP</div>
              </div>
            </div>

            {!statsData && (
              <div style={{ textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.3)' }}>
                No stats available yet — add visitors first.
              </div>
            )}
          </div>
        )}

        {/* ── Settings Tab ── */}
        {activeTab === 'settings' && (
          <div className="admin-section animate-fade-in">
            <div className="section-header">
              <div>
                <h2>System Settings</h2>
                <p>Configure security parameters</p>
              </div>
            </div>

            <div className="settings-grid">
              {[
                { id: 'toggle-face-rec',      label: 'Photo Capture',          desc: 'Enable camera capture for visitor photo records' },
                { id: 'toggle-anomaly',        label: 'Trust Score Engine',     desc: 'Compute risk level based on visit history' },
                { id: 'toggle-auto-deny',      label: 'Auto-Deny High Risk',    desc: 'Automatically deny entry to high-risk visitors' },
                { id: 'toggle-otp',            label: 'OTP Verification',       desc: 'Require OTP from residents for visitor approval' },
                { id: 'toggle-notifications',  label: 'Real-time Notifications', desc: 'Push notifications for alerts and visitor entries' },
              ].map(({ id, label, desc }) => (
                <div key={id} className="setting-card">
                  <div className="setting-info">
                    <h4>{label}</h4>
                    <p>{desc}</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked id={id} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
