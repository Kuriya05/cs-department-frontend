// context/ThemeContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // ดึงธีมล่าสุดที่ผู้ใช้เลือกไว้จาก localStorage เมื่อ Component โหลดครั้งแรก
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('app-theme', nextTheme);
      return nextTheme;
    });
  };

  // ป้องกันปัญหา Hydration Mismatch ระหว่าง Server กับ Client
  if (!mounted) {
    return <div className="bg-[#030305] min-h-screen w-screen" />;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme ต้องใช้งานภายใต้ ThemeProvider เท่านั้น');
  }
  return context;
}