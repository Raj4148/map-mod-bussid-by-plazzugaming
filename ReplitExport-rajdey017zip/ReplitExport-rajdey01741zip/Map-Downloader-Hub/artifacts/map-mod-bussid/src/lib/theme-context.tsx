import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextValue {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  darkMode: false,
  setDarkMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('darkMode') === 'true';
    } catch {
      return false; // default: light mode
    }
  });

  const setDarkMode = (v: boolean) => {
    setDarkModeState(v);
    try { localStorage.setItem('darkMode', String(v)); } catch {}
  };

  // Apply / remove `.dark` class on <html> so Tailwind dark: variants work
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
