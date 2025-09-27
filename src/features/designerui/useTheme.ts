"use client";
import { useEffect, useState } from 'react';

export function useTheme(): 'light' | 'dark' {
  const getTheme = () => (typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const [theme, setTheme] = useState<'light' | 'dark'>(getTheme());

  useEffect(() => {
    const handle = () => setTheme(getTheme());
    window.addEventListener('themechange', handle as EventListener);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', handle);
    return () => {
      window.removeEventListener('themechange', handle as EventListener);
      mq.removeEventListener('change', handle);
    };
  }, []);

  return theme;
}


