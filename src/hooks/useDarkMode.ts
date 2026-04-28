import { useState, useEffect, useCallback } from 'react';

const applyDarkMode = (enabled: boolean) => {
  if (enabled) {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
};

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('marka-dark-mode');
    const enabled = saved !== null
      ? JSON.parse(saved)
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(enabled);
    applyDarkMode(enabled);
    setIsHydrated(true);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prevState) => {
      const newValue = !prevState;
      localStorage.setItem('marka-dark-mode', JSON.stringify(newValue));
      applyDarkMode(newValue);
      return newValue;
    });
  }, []);

  return { isDarkMode, toggleDarkMode, isHydrated };
}
