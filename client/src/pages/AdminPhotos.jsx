import { useState, useEffect, useCallback } from 'react';
import { Camera, ZoomIn, Trash2, User, Clock, MapPin, Shield, X, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminPhotos.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function AdminPhotos() {
  const { getIdToken } = useAuth();
  const [visitors,  setVisitors]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [lightbox,  setLightbox]  = useState(null);
  const [deleting,  setDeleting]  = useState(null);

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getIdToken();
      const res   = await fetch(`${API}/api/visitors?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      // Only show visitors that have a photo
      const withPhotos = (data.visitors || []).filter(v => v.guard_photo_url || v.photo_url);
      setVisitors(withPhotos);
    } catch {}
    setLoading(false);
  }, [getIdToken]);

  useEffect(() => { fetchVisitors(); }, [fetchVisitors]);

  const handleDelete = async (visitor) => {
    if (!window.confirm(`Delete photo for ${visitor.name}?`)) return;
    setDeleting(visitor.id);
    try {
      const token = await getIdToken();
      // Clear photo_url in visitors table
      await fetch(`${API}/api/visitors/${visitor.id}`, {
        method:  'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ photo_url: null, guard_photo_url: null }),
      });
      setVisitors(prev => prev.filter(v => v.id !== visitor.id));
      if (lightbox?.id === visitor.id) setLightbox(null);
    } catch {}
    setDeleting(null);
  };

  const photoSrc = v => v.guard_photo_url || v.photo_url;

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div className="ap-header-left">
          <div className="ap-icon"><Camera size={20} /></div>
          <div>
            <h2>Visitor Photos</h2>
            <p>{visitors.length} photos stored</p>
          </div>
        </div>
        <button className="ap-refresh" onClick={fetchVisitors} title="Refresh">
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="ap-loading">
          <RefreshCw size={32} className="spin" />
          <p>Loading photos…</p>
        </div>
      ) : visitors.length === 0 ? (
        <div className="ap-empty">
          <Camera size={40} />
          <p>No visitor photos stored yet</p>
          <span>Photos are captured by guards during visitor entry</span>
        </div>
      ) : (
        <div className="ap-grid">
          {visitors.map((v, i) => (
            <div
              key={v.id}
              className="ap-card"
              style={{ animationDelay: `${Math.min(i, 12) * 0.05}s` }}
            >
              <div className="ap-card-img" onClick={() => setLightbox(v)}>
                <img src={photoSrc(v)} alt={v.name} />
                <div className="ap-card-overlay">
                  <ZoomIn size={22} />
                </div>
              </div>

              <div className="ap-card-info">
                <div className="ap-card-visitor">
                  <span className="ap-visitor-name">{v.name}</span>
                  <span className={`ap-status-dot ${v.status}`} />
                </div>
                <div className="ap-card-meta">
                  <span className="ap-meta-item">
                    <MapPin size={11} /> {v.target_flat || '—'}
                  </span>
                  <span className="ap-meta-item">
                    <Clock size={11} />
                    {new Date(v.entry_time || v.created_at).toLocaleDateString()}
                  </span>
                </div>
                {v.purpose && (
                  <span className="ap-purpose">{v.purpose}</span>
                )}
                {v.guard && (
                  <span className="ap-guard">
                    <Shield size={10} /> {v.guard.name}
                  </span>
                )}
              </div>

              <button
                className="ap-delete-btn"
                onClick={() => handleDelete(v)}
                disabled={deleting === v.id}
                title="Delete photo"
              >
                {deleting === v.id
                  ? <RefreshCw size={13} className="spin" />
                  : <Trash2 size={13} />
                }
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="ap-lightbox" onClick={() => setLightbox(null)}>
          <div className="ap-lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="ap-lb-close" onClick={() => setLightbox(null)}><X size={20} /></button>
            <img src={photoSrc(lightbox)} alt={lightbox.name} className="ap-lb-img" />
            <div className="ap-lb-info">
              <h3>{lightbox.name}</h3>
              <p><MapPin size={12} /> Flat: {lightbox.target_flat || '—'}</p>
              <p><Clock size={12} /> {new Date(lightbox.entry_time || lightbox.created_at).toLocaleString()}</p>
              {lightbox.purpose && <p>Purpose: {lightbox.purpose}</p>}
              <p className={`lb-status ${lightbox.status}`}>{lightbox.status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
