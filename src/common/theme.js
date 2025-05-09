import { createTheme } from "@mui/material/styles";

const THEME = (mode) => createTheme({
    typography: {
     "fontFamily": `"Roboto", "Helvetica", "Arial", sans-serif`,
     "fontSize": 14,
     "fontWeightLight": 300,
     "fontWeightRegular": 400,
     "fontWeightMedium": 500
    },
    palette: {
        mode,
        ...(mode === 'dark'
        ? {
            primary: {
                main: '#64b5f6',
                dark: '#42a5f5',
                light: '#bbdefb',
                contrastText: '#000000',
            },
            secondary: {
                main: '#ff9800',
                dark: '#f57c00',
                light: '#ffcc80',
                contrastText: '#000000',
            },
            tertiary: {
                main: '#b39ddb',
                dark: '#9575cd',
                light: '#d1c4e9',
                contrastText: '#000000',
            },
            background: {
                default: '#000000', // Pure Black
                paper: '#121212', // Dark Gray for cards
                header: '#1a1a2e', // Dark navy for header/footer
                footer: '#1a1a2e', // Same dark navy for footer
            },
            text: {
                primary: '#ffffff',
                secondary: '#b0bec5',
                white: '#fff',
                black: '#000'
            },
            divider: 'rgba(255, 255, 255, 0.22)',
            action: {
                active: 'rgba(255, 255, 255, 0.7)',
                hover: 'rgba(255, 255, 255, 0.08)',
                selected: 'rgba(255, 255, 255, 0.16)',
                disabled: 'rgba(255, 255, 255, 0.3)',
                disabledBackground: 'rgba(255, 255, 255, 0.12)',
            }
            }
        : {
            primary: {
                main: '#2563eb', // Rich blue 
                dark: '#1d4ed8',
                light: '#60a5fa',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#f59e0b', // Warm amber
                dark: '#d97706',
                light: '#fbbf24',
                contrastText: '#ffffff',
            },
            tertiary: {
                main: '#0ea5e9', // Bright teal/cyan
                dark: '#0284c7',
                light: '#38bdf8',
                contrastText: '#ffffff',
            },
            background: {
                default: '#f8fafc', // Very light blue-gray
                paper: '#ffffff', // White for cards
                header: '#0f2a52', // Darker blue for header/footer
                footer: '#0f2a52', // Same darker blue for footer
            },
            text: {
                primary: '#0f172a', // Very dark blue-gray
                secondary: '#475569', // Medium blue-gray
                white: '#fff',
                black: '#000'
            },
            divider: 'rgba(0, 0, 0, 0.18)',
            action: {
                active: 'rgba(0, 0, 0, 0.7)',
                hover: 'rgba(0, 0, 0, 0.04)',
                selected: 'rgba(0, 0, 0, 0.08)',
                disabled: 'rgba(0, 0, 0, 0.26)',
                disabledBackground: 'rgba(0, 0, 0, 0.12)',
            },
            success: {
                main: '#10b981', // Emerald green
                light: '#34d399',
                dark: '#059669',
                contrastText: '#ffffff',
            },
            error: {
                main: '#ef4444', // Red
                light: '#f87171',
                dark: '#dc2626',
                contrastText: '#ffffff',
            },
            warning: {
                main: '#f59e0b', // Amber
                light: '#fbbf24',
                dark: '#d97706',
                contrastText: '#ffffff',
            },
            info: {
                main: '#3b82f6', // Blue
                light: '#60a5fa',
                dark: '#2563eb',
                contrastText: '#ffffff',
            },
        }),
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&.MuiButton-contained': ({ theme }) => ({
                        boxShadow: theme.palette.mode === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }),
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: 12,
                    boxShadow: theme.palette.mode === 'dark' 
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                }),
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.background.header,
                    boxShadow: theme.palette.mode === 'dark' 
                        ? '0 1px 3px rgba(0,0,0,0.2)' 
                        : '0 1px 3px rgba(0,0,0,0.1)',
                    zIndex: 1100
                }),
            },
        },
        MuiDrawer: {
            styleOverrides: {
                root: ({ theme }) => ({
                    zIndex: 1000
                }),
            },
        },
    },
});

export default THEME;
