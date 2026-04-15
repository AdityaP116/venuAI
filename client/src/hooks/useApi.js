/**
 * useApi.js — authenticated API calls with Firebase ID token
 * Usage:
 *   const api = useApi();
 *   const data = await api.get('/visitors');
 *   const res  = await api.post('/visitors', { name: 'John' });
 */
import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export function useApi() {
  const { getIdToken } = useAuth();

  const request = useCallback(async (method, path, body, opts = {}) => {
    const token = await getIdToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...opts,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }, [getIdToken]);

  const uploadPhoto = useCallback(async (file) => {
    const token = await getIdToken();
    const form = new FormData();
    form.append('photo', file);
    const res = await fetch(`${BASE_URL}/api/photos/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  }, [getIdToken]);

  return {
    get:          (path)          => request('GET',    path),
    post:         (path, body)    => request('POST',   path, body),
    put:          (path, body)    => request('PUT',    path, body),
    del:          (path)          => request('DELETE', path),
    uploadPhoto,
  };
}
