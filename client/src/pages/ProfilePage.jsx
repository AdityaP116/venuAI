import { useState, useRef, useCallback, useEffect } from 'react';
import {
  User, Camera, Phone, Edit3, Save, X, Upload,
  Shield, Key, Home, CheckCircle, AlertCircle, RefreshCw, Building, Clock, History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function ProfilePage() {
  const { user, getIdToken, refreshProfile } = useAuth();

  const [editing, setEditing]     = useState(false);
  const [saving,  setSaving]      = useState(false);
  const [success, setSuccess]     = useState('');
  const [error,   setError]       = useState('');
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name:             user?.name             || '',
    username:         user?.username         || '',
    phone:            user?.phone            || '',
    flat_num:         user?.flat_num         || '',
    b_num:            user?.b_num            || '',
    b_wing_alphabet:  user?.b_wing_alphabet  || '',
    b_floor_num:      user?.b_floor_num      || '',
  });

  const fileRef = useRef(null);

  // Guard shift history
  const [shiftHistory, setShiftHistory] = useState([]);

  useEffect(() => {
    if (user?.role !== 'guard') return;
    getIdToken().then(token =>
      fetch(`${API}/api/shifts/history`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => setShiftHistory(d.shifts || []))
        .catch(() => {})
    );
  }, [user?.role, getIdToken]);

  const resetForm = useCallback(() => {
    setForm({
      name:            user?.name            || '',
      username:        user?.username        || '',
      phone:           user?.phone           || '',
      flat_num:        user?.flat_num        || '',
      b_num:           user?.b_num           || '',
      b_wing_alphabet: user?.b_wing_alphabet || '',
      b_floor_num:     user?.b_floor_num     || '',
    });
    setEditing(false);
    setError('');
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const token = await getIdToken();
      const res = await fetch(`${API}/api/profile`, {
        method:  'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setSuccess('Profile updated successfully!');
      setEditing(false);
      await refreshProfile();
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const token   = await getIdToken();
      const formData = new FormData();
      formData.append('avatar', file);
      const res  = await fetch(`${API}/api/profile/avatar`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}` },
        body:    formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      await refreshProfile();
      setSuccess('Profile photo updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const avatarSrc = user?.profile_image_url || user?.avatar_url;
  const roleColor = { admin: '#a78bfa', guard: '#22d3ee', resident: '#34d399' }[user?.role] || '#a78bfa';

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-hero">
        <div className="profile-hero-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${roleColor}15, transparent 70%)` }} />

        <div className="profile-avatar-section">
          <div className="profile-avatar-wrap">
            {avatarSrc
              ? <img src={avatarSrc} alt={user?.name} className="profile-avatar" />
              : <div className="profile-avatar-placeholder" style={{ background: `${roleColor}22`, color: roleColor }}>
                  {user?.name?.[0]?.toUpperCase() || '?'}
                </div>
            }
            <button
              className="avatar-upload-btn"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              title="Change photo"
            >
              {uploading ? <RefreshCw size={14} className="spin" /> : <Camera size={14} />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
          </div>

          <div className="profile-hero-info">
            <div className="profile-role-badge" style={{ background: `${roleColor}22`, color: roleColor, border: `1px solid ${roleColor}44` }}>
              <Shield size={12} />
              {user?.role?.toUpperCase()}
            </div>
            <h1>{user?.name || 'User'}</h1>
            <p className="profile-email">{user?.email}</p>
            {user?.user_unique_id && (
              <div className="profile-uid">
                <Key size={12} />
                <span>{user.user_unique_id}</span>
              </div>
            )}
          </div>
        </div>

        <div className="profile-hero-actions">
          {!editing ? (
            <button className="profile-edit-btn" onClick={() => setEditing(true)} id="edit-profile-btn">
              <Edit3 size={16} /> Edit Profile
            </button>
          ) : (
            <div className="profile-edit-actions">
              <button className="profile-save-btn" onClick={handleSave} disabled={saving} id="save-profile-btn">
                {saving ? <RefreshCw size={14} className="spin" /> : <Save size={14} />}
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button className="profile-cancel-btn" onClick={resetForm} id="cancel-profile-btn">
                <X size={14} /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feedback */}
      {success && (
        <div className="profile-feedback success">
          <CheckCircle size={16} /> {success}
        </div>
      )}
      {error && (
        <div className="profile-feedback error">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Form Grid */}
      <div className="profile-form-grid">
        {/* Personal Information */}
        <div className="profile-card">
          <div className="profile-card-header">
            <User size={18} />
            <h3>Personal Information</h3>
          </div>
          <div className="profile-fields">
            <ProfileField
              label="Full Name"
              value={editing ? form.name : user?.name}
              editing={editing}
              type="text"
              placeholder="Your full name"
              id="profile-name"
              onChange={v => setForm(f => ({ ...f, name: v }))}
            />
            <ProfileField
              label="Username"
              value={editing ? form.username : user?.username}
              editing={editing}
              type="text"
              placeholder="Choose a username"
              id="profile-username"
              onChange={v => setForm(f => ({ ...f, username: v }))}
            />
            <ProfileField
              label="Phone Number"
              value={editing ? form.phone : user?.phone}
              editing={editing}
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              id="profile-phone"
              onChange={v => setForm(f => ({ ...f, phone: v }))}
            />
          </div>
        </div>

        {/* Account Details */}
        <div className="profile-card">
          <div className="profile-card-header">
            <Shield size={18} />
            <h3>Account Details</h3>
          </div>
          <div className="profile-fields">
            <ProfileField label="Email"       value={user?.email}              editing={false} type="email" />
            <ProfileField label="Role"        value={user?.role?.toUpperCase()} editing={false} type="text" />
            <ProfileField label="User ID"     value={user?.user_unique_id || '—'} editing={false} type="text" mono />
            <ProfileField label="Status"      value={user?.status || 'active'} editing={false} type="text" />
            <ProfileField label="Member Since" value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'} editing={false} type="text" />
          </div>
        </div>

        {/* Flat / Building Info — residents priority, visible to all */}
        <div className="profile-card">
          <div className="profile-card-header">
            <Home size={18} />
            <h3>{user?.role === 'resident' ? 'Flat Registration' : 'Building Assignment'}</h3>
          </div>
          {user?.role === 'resident' && (
            <p className="profile-card-hint">Register your flat — this will be visible across all systems and the database.</p>
          )}
          <div className="profile-fields">
            <ProfileField
              label="Flat Number"
              value={editing && user?.role === 'resident' ? form.flat_num : user?.flat_num}
              editing={editing && user?.role === 'resident'}
              type="text"
              placeholder="e.g. 101, 204A"
              id="profile-flat"
              onChange={v => setForm(f => ({ ...f, flat_num: v }))}
            />
            <ProfileField
              label="Wing / Block"
              value={editing && user?.role === 'resident' ? form.b_wing_alphabet : user?.b_wing_alphabet}
              editing={editing && user?.role === 'resident'}
              type="text"
              placeholder="e.g. A, B, C"
              id="profile-wing"
              onChange={v => setForm(f => ({ ...f, b_wing_alphabet: v }))}
            />
            <ProfileField
              label="Floor"
              value={editing && user?.role === 'resident' ? form.b_floor_num : user?.b_floor_num}
              editing={editing && user?.role === 'resident'}
              type="number"
              placeholder="Floor number"
              id="profile-floor"
              onChange={v => setForm(f => ({ ...f, b_floor_num: parseInt(v) || '' }))}
            />
            <ProfileField
              label="Building"
              value={user?.b_num}
              editing={false}
              type="text"
            />
          </div>
        </div>

        {/* Guard Shift Status + History — guard only */}
        {user?.role === 'guard' && (
          <div className="profile-card">
            <div className="profile-card-header">
              <History size={18} />
              <h3>Shift History</h3>
            </div>
            <div className="profile-fields">
              <div className="profile-field readonly">
                <span className="field-label">Current Status</span>
                <span className={`shift-badge ${user?.shift_status}`}>
                  <span className="shift-dot" />
                  {user?.shift_status === 'on_duty' ? '🟢 On Duty' : '⚫ Off Duty'}
                </span>
              </div>
            </div>
            {shiftHistory.length > 0 && (
              <div className="shift-history-list">
                {shiftHistory.slice(0, 8).map((s, i) => {
                  const start = new Date(s.shift_start);
                  const isOvertime = s.status === 'overtime';
                  const isActive = s.status === 'active';
                  const hrs = s.total_hours ? `${s.total_hours.toFixed(1)}h` : isActive ? 'Active…' : '—';
                  return (
                    <div key={s.id} className="shift-history-row" style={{ animationDelay: `${i * 0.04}s` }}>
                      <div className="shr-date">
                        <Clock size={11} />
                        {start.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>
                          {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="shr-dur">{hrs}</div>
                      <span className="shr-badge" style={{
                        background: isOvertime ? 'rgba(248,113,113,0.1)' : isActive ? 'rgba(52,211,153,0.1)' : 'rgba(148,163,184,0.08)',
                        color: isOvertime ? '#f87171' : isActive ? '#34d399' : '#94a3b8',
                        border: `1px solid ${isOvertime ? 'rgba(248,113,113,0.25)' : isActive ? 'rgba(52,211,153,0.25)' : 'rgba(148,163,184,0.15)'}`,
                      }}>
                        {isOvertime ? 'Overtime' : isActive ? 'Active' : 'Done'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            {shiftHistory.length === 0 && (
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', padding: '0.5rem 1rem 1rem' }}>No shift history yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileField({ label, value, editing, type, placeholder, id, onChange, mono }) {
  return (
    <div className={`profile-field ${editing ? 'editable' : 'readonly'}`}>
      <span className="field-label">{label}</span>
      {editing ? (
        <input
          id={id}
          type={type || 'text'}
          className="field-input"
          value={value || ''}
          placeholder={placeholder}
          onChange={e => onChange?.(e.target.value)}
        />
      ) : (
        <span className={`field-value ${mono ? 'mono' : ''}`}>{value || '—'}</span>
      )}
    </div>
  );
}
