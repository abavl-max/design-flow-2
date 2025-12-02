import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  // Carregar tema salvo do localStorage ao montar
  useEffect(() => {
    const savedConfig = localStorage.getItem('designflow_config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      if (config.theme) {
        setTheme(config.theme);
        applyTheme(config.theme);
      }
    }
  }, []);

  // Aplicar tema ao documento
  const applyTheme = (newTheme: Theme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Função para alternar tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    
    // Salvar no localStorage
    const savedConfig = localStorage.getItem('designflow_config');
    const config = savedConfig ? JSON.parse(savedConfig) : {};
    config.theme = newTheme;
    localStorage.setItem('designflow_config', JSON.stringify(config));
  };

  // Função para definir tema específico
  const setThemeValue = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    
    // Salvar no localStorage
    const savedConfig = localStorage.getItem('designflow_config');
    const config = savedConfig ? JSON.parse(savedConfig) : {};
    config.theme = newTheme;
    localStorage.setItem('designflow_config', JSON.stringify(config));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeValue }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
