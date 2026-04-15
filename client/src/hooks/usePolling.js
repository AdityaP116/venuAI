import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * usePolling — lightweight polling hook
 * @param {Function} fetchFn - async function that returns data
 * @param {number} intervalMs - polling interval in ms (default 15000)
 * @returns {{ data, loading, lastUpdated, refresh }}
 */
export default function usePolling(fetchFn, intervalMs = 15000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchFnRef.current();
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('[usePolling] fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    intervalRef.current = setInterval(refresh, intervalMs);
    return () => clearInterval(intervalRef.current);
  }, [refresh, intervalMs]);

  return { data, loading, lastUpdated, refresh };
}
