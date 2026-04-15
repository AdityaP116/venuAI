import { useState, useEffect } from 'react';

export default function useTheme(role = 'admin') {
  const storageKey = `sentra-theme-${role}`;

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // localStorage unavailable
    }
  }, [theme, storageKey]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}
