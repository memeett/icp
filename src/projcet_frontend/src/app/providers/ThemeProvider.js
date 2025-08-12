import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { useAtom } from 'jotai';
import { themeAtom } from '../store/ui';
import { getAntdTheme } from '../theme/antd-theme';
const ThemeContext = createContext(undefined);
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useAtom(themeAtom);
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    useEffect(() => {
        // Apply theme to document root
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        // Update data attribute for CSS
        root.setAttribute('data-theme', theme);
        // Update CSS custom properties for theme - Modern Elegant Colors
        if (theme === 'dark') {
            root.style.setProperty('--background', '222 84% 4.9%'); // Rich Dark Blue-Gray
            root.style.setProperty('--foreground', '210 40% 98%'); // Soft White
            root.style.setProperty('--card', '222 84% 4.9%');
            root.style.setProperty('--card-foreground', '210 40% 98%');
            root.style.setProperty('--popover', '222 84% 4.9%');
            root.style.setProperty('--popover-foreground', '210 40% 98%');
            root.style.setProperty('--primary', '238 75% 65%'); // Modern Indigo
            root.style.setProperty('--primary-foreground', '222 84% 4.9%');
            root.style.setProperty('--secondary', '217 32.6% 17.5%'); // Sophisticated Dark Blue-Gray
            root.style.setProperty('--secondary-foreground', '210 40% 98%');
            root.style.setProperty('--muted', '217 32.6% 17.5%');
            root.style.setProperty('--muted-foreground', '215 20.2% 65.1%');
            root.style.setProperty('--accent', '217 32.6% 17.5%');
            root.style.setProperty('--accent-foreground', '210 40% 98%');
            root.style.setProperty('--destructive', '0 62.8% 30.6%');
            root.style.setProperty('--destructive-foreground', '210 40% 98%');
            root.style.setProperty('--border', '217 32.6% 17.5%');
            root.style.setProperty('--input', '217 32.6% 17.5%');
            root.style.setProperty('--ring', '238 75% 65%'); // Modern Indigo
        }
        else {
            root.style.setProperty('--background', '0 0% 100%'); // Pure White
            root.style.setProperty('--foreground', '222 84% 4.9%'); // Rich Dark Blue-Gray
            root.style.setProperty('--card', '0 0% 100%');
            root.style.setProperty('--card-foreground', '222 84% 4.9%');
            root.style.setProperty('--popover', '0 0% 100%');
            root.style.setProperty('--popover-foreground', '222 84% 4.9%');
            root.style.setProperty('--primary', '238 75% 65%'); // Modern Indigo
            root.style.setProperty('--primary-foreground', '0 0% 98%');
            root.style.setProperty('--secondary', '220 14.3% 95.9%'); // Cool Light Gray
            root.style.setProperty('--secondary-foreground', '220 8.9% 46.1%');
            root.style.setProperty('--muted', '220 14.3% 95.9%');
            root.style.setProperty('--muted-foreground', '220 8.9% 46.1%');
            root.style.setProperty('--accent', '220 14.3% 95.9%');
            root.style.setProperty('--accent-foreground', '220 8.9% 46.1%');
            root.style.setProperty('--destructive', '0 84.2% 60.2%');
            root.style.setProperty('--destructive-foreground', '0 0% 98%');
            root.style.setProperty('--border', '220 13% 91%');
            root.style.setProperty('--input', '220 13% 91%');
            root.style.setProperty('--ring', '238 75% 65%'); // Modern Indigo
        }
    }, [theme]);
    const contextValue = {
        theme,
        toggleTheme,
    };
    const currentTheme = getAntdTheme(theme === 'dark');
    return (_jsx(ThemeContext.Provider, { value: contextValue, children: _jsx(ConfigProvider, { theme: currentTheme, children: _jsx("div", { className: `min-h-screen transition-colors duration-200 ${theme}`, children: children }) }) }));
};
