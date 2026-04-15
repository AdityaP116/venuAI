/**
 * useNotifications.js
 * Polls for unread notifications every 30s and exposes helpers.
 */
import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { useAuth } from '../context/AuthContext';

export function useNotifications() {
  const api = useApi();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await api.get('/notifications');
      setNotifications(data.notifications || []);
      setUnread(data.unread || 0);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markRead = useCallback(async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch { /* silent */ }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnread(0);
    } catch { /* silent */ }
  }, []);

  return { notifications, unread, loading, fetchNotifications, markRead, markAllRead };
}
