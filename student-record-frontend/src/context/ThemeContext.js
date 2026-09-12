/**
 * Theme Context for Dark Mode
 * Provides dark mode state across the entire application
 */

import React, { createContext, useState, useContext, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create Context
const ThemeContext = createContext();

// Custom hook to use theme
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

// Theme Provider Component
export const CustomThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        // Get saved preference from localStorage
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newMode = !prev;
            localStorage.setItem('darkMode', JSON.stringify(newMode));
            return newMode;
        });
    };

    // Create MUI theme based on dark mode
    const theme = useMemo(() => 
        createTheme({
            palette: {
                mode: darkMode ? 'dark' : 'light',
                primary: {
                    main: '#1976D2',
                },
                secondary: {
                    main: '#dc004e',
                },
                background: {
                    default: darkMode ? '#121212' : '#f5f5f5',
                    paper: darkMode ? '#1e1e1e' : '#ffffff',
                },
            },
        }),
        [darkMode]
    );

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};