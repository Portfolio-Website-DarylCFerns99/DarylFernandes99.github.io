import { createTheme } from "@mui/material/styles";

const THEME = (mode) => createTheme({
    typography: {
        fontFamily: `'Outfit', 'Roboto', sans-serif`,
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
        button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: {
        borderRadius: 16,
    },
    palette: {
        mode,
        ...(mode === 'dark'
            ? {
                // Deep Cosmos / Cyber Dark
                primary: {
                    main: '#00f2ff', // Cyan Neon
                    light: '#7affff',
                    dark: '#00becb',
                    contrastText: '#000',
                },
                secondary: {
                    main: '#7000ff', // Electric Violet
                    light: '#aa4dff',
                    dark: '#2800cc',
                    contrastText: '#fff',
                },
                background: {
                    default: '#050505', // Almost Black
                    paper: '#0a0a12',   // Very dark blue-grey
                    header: 'rgba(5, 5, 5, 0.7)', // Transparent for glassmorphism
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#94a3b8',
                },
                action: {
                    hover: 'rgba(255, 255, 255, 0.05)',
                }
            }
            : {
                // Modern Clean Light
                primary: {
                    main: '#2563eb', // Royal Blue
                    light: '#60a5fa',
                    dark: '#1e40af',
                    contrastText: '#fff',
                },
                secondary: {
                    main: '#8b5cf6', // Violet
                    light: '#a78bfa',
                    dark: '#7c3aed',
                    contrastText: '#fff',
                },
                background: {
                    default: '#f8fafc', // Slate 50
                    paper: '#ffffff',
                    header: 'rgba(255, 255, 255, 0.8)',
                },
                text: {
                    primary: '#0f172a', // Slate 900
                    secondary: '#475569', // Slate 600
                },
            }),
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: mode === 'dark' ? "#333 #050505" : "#ccc #f8fafc",
                    "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                        backgroundColor: "transparent",
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                        borderRadius: 8,
                        backgroundColor: mode === 'dark' ? "#333" : "#ccc",
                        minHeight: 24,
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 50, // Pill shape
                    padding: '8px 24px',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                },
                containedPrimary: {
                    background: mode === 'dark'
                        ? 'linear-gradient(45deg, #00f2ff 30%, #00c2ff 90%)'
                        : 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
                    '&.Mui-disabled': {
                        background: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                        color: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    backdropFilter: 'blur(10px)',
                    background: mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.03)'
                        : 'rgba(255, 255, 255, 0.7)',
                    border: mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.12)'
                        : '1px solid rgba(0, 0, 0, 0.12)',
                    boxShadow: mode === 'dark'
                        ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                        : '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(12px)',
                    boxShadow: 'none',
                    borderBottom: mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.12)'
                        : '1px solid rgba(0, 0, 0, 0.12)',
                },
            },
        },
    },
});

export default THEME;
