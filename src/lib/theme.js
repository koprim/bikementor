import { useCallback, useEffect, useState } from 'react';

function readInitial() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') || 'light';
}

export function useTheme() {
  const [theme, setThemeState] = useState(readInitial);

  const setTheme = useCallback((next) => {
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // ignore localStorage errors (private browsing, iframe sandbox, etc.)
    }
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'theme' && e.newValue) {
        document.documentElement.setAttribute('data-theme', e.newValue);
        setThemeState(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { theme, setTheme, toggleTheme };
}
