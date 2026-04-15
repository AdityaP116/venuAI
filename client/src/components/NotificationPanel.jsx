import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import './NotificationPanel.css';

const TYPE_ICONS = {
  visitor_arrival: '🚪',
  otp_request:     '🔑',
  approval:        '✅',
  alert:           '🚨',
  system:          '⚙️',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const { notifications, unread, loading, markRead, markAllRead } = useNotifications();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleNotifClick = (notif) => {
    if (!notif.read) markRead(notif.id);
  };

  return (
    <div className="notif-bell-wrap">
      <button
        className="notif-bell-btn"
        onClick={() => setOpen(o => !o)}
        id="notif-bell-toggle"
        title="Notifications"
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="notif-badge">{unread > 99 ? '99+' : unread}</span>
        )}
      </button>

      {open && <div className="notif-overlay" onClick={() => setOpen(false)} />}

      <div ref={panelRef} className={`notif-panel ${open ? 'open' : ''}`} role="dialog" aria-label="Notifications">
        <div className="notif-panel-header">
          <h3>
            <Bell size={16} />
            Notifications
            {unread > 0 && (
              <span style={{
                fontSize: '0.7rem', background: '#ef4444', color: '#fff',
                padding: '1px 6px', borderRadius: '8px', fontWeight: 700
              }}>{unread}</span>
            )}
          </h3>
          <div className="notif-panel-actions">
            {unread > 0 && (
              <button className="notif-mark-all-btn" onClick={markAllRead} id="notif-mark-all">
                Mark all read
              </button>
            )}
            <button className="notif-close-btn" onClick={() => setOpen(false)} id="notif-close">✕</button>
          </div>
        </div>

        <div className="notif-list">
          {loading && notifications.length === 0 ? (
            <div className="notif-loading">
              <div className="notif-loader" />
              Loading…
            </div>
          ) : notifications.length === 0 ? (
            <div className="notif-empty">
              <div className="notif-empty-icon">🔔</div>
              <span>No notifications yet</span>
              <span style={{ fontSize: '0.75rem' }}>Events will appear here automatically</span>
            </div>
          ) : (
            notifications.map(notif => (
              <button
                key={notif.id}
                className={`notif-item ${!notif.read ? 'unread' : ''}`}
                onClick={() => handleNotifClick(notif)}
                id={`notif-${notif.id}`}
              >
                <div className={`notif-icon ${notif.type}`}>
                  {TYPE_ICONS[notif.type] || '📌'}
                </div>
                <div className="notif-content">
                  <div className="notif-item-inner">
                    <span className="notif-title">{notif.title}</span>
                    {!notif.read && <span className="notif-unread-dot" />}
                  </div>
                  <p className="notif-message">{notif.message}</p>
                  <span className="notif-time">{timeAgo(notif.created_at)}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
