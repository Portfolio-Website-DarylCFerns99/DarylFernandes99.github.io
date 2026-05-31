import { createTheme } from "@mui/material/styles";

const THEME = (mode) => createTheme({
    typography: {
        fontFamily: mode === 'dark' ? `'Inter', sans-serif` : `'Inter', 'Roboto', sans-serif`,
        h1: {
            fontFamily: mode === 'dark' ? `'Inter', sans-serif` : `'Hanken Grotesk', sans-serif`,
            fontSize: mode === 'dark' ? '4.5rem' : '4rem', // 72px / 64px
            fontWeight: 800,
            lineHeight: mode === 'dark' ? 1.1 : 1.1,
            letterSpacing: mode === 'dark' ? '-0.04em' : '-0.02em',
        },
        h2: {
            fontFamily: mode === 'dark' ? `'Inter', sans-serif` : `'Hanken Grotesk', sans-serif`,
            fontSize: mode === 'dark' ? '2.5rem' : '2rem', // 40px / 32px
            fontWeight: 700,
            lineHeight: mode === 'dark' ? 1.2 : 1.3,
            letterSpacing: mode === 'dark' ? '-0.02em' : 'normal',
        },
        h3: {
            fontFamily: mode === 'dark' ? `'Inter', sans-serif` : `'Hanken Grotesk', sans-serif`,
            fontSize: '2rem', // 32px
            fontWeight: mode === 'dark' ? 600 : 700,
            lineHeight: mode === 'dark' ? 1.25 : 1.3,
        },
        h4: {
            fontFamily: mode === 'dark' ? `'Inter', sans-serif` : `'Hanken Grotesk', sans-serif`,
            fontSize: '1.5rem', // 24px
            fontWeight: 600,
            lineHeight: 1.4,
        },
        body1: {
            fontFamily: `'Inter', sans-serif`,
            fontSize: '1.125rem', // 18px
            lineHeight: mode === 'dark' ? 1.75 : 1.6,
            fontWeight: 400,
        },
        body2: {
            fontFamily: `'Inter', sans-serif`,
            fontSize: '1rem', // 16px
            lineHeight: mode === 'dark' ? 1.5 : 1.6,
            fontWeight: 400,
        },
        button: {
            fontFamily: mode === 'dark' ? `'Inter', sans-serif` : `'Hanken Grotesk', sans-serif`,
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 4, // 4px base border radius
    },
    palette: {
        mode,
        ...(mode === 'dark'
            ? {
                // Premium Dark Portfolio
                primary: {
                    main: '#f59e0b', // Amber/Gold primary accent
                    light: '#ffc174',
                    dark: '#855300',
                    contrastText: '#0f172a',
                },
                secondary: {
                    main: '#bec6e0',
                    light: '#dae2fd',
                    dark: '#3f465c',
                    contrastText: '#ffffff',
                },
                background: {
                    default: '#0f172a', // Midnight page background
                    paper: '#1e293b',   // Slate card/container background
                    header: 'rgba(15, 23, 42, 0.8)', // Sticky glassmorphism header
                },
                text: {
                    primary: '#f8fafc', // Neutral white
                    secondary: '#bec6e0', // Slate gray
                },
                action: {
                    hover: 'rgba(255, 255, 255, 0.05)',
                }
            }
            : {
                // Aura Portfolio
                primary: {
                    main: '#b48946', // Gold/Amber accent
                    light: '#efbe76',
                    dark: '#795516',
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: '#5c5e65', // Charcoal secondary
                    light: '#c4c6ce',
                    dark: '#44474d',
                    contrastText: '#ffffff',
                },
                background: {
                    default: '#f8f9ff', // Off-white
                    paper: '#ffffff',   // Pure white for containers
                    header: 'rgba(248, 249, 255, 0.8)', // Backdrop blur header
                },
                text: {
                    primary: '#0b1c30', // Deep charcoal headings
                    secondary: '#4f4539', // Subtle charcoal/neutral body
                },
            }),
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    scrollbarColor: mode === 'dark' ? "#3f465c #0f172a" : "#c4c6ce #f8f9ff",
                    scrollbarWidth: "thin",
                },
                "::-webkit-scrollbar": {
                    width: "10px",
                    height: "10px",
                },
                "::-webkit-scrollbar-track": {
                    background: mode === 'dark' ? "#0f172a" : "#f8f9ff",
                },
                "::-webkit-scrollbar-thumb": {
                    borderRadius: 10,
                    backgroundColor: mode === 'dark' ? "#3f465c" : "#c4c6ce",
                    border: mode === 'dark' ? "3px solid #0f172a" : "3px solid #f8f9ff",
                    '&:hover': {
                        backgroundColor: mode === 'dark' ? "#f59e0b" : "#b48946",
                    }
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4, // 4px shape
                    padding: '8px 24px',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: mode === 'dark'
                            ? '0 4px 12px rgba(245, 158, 11, 0.15)'
                            : '0 4px 12px rgba(180, 137, 70, 0.1)',
                    },
                },
                containedPrimary: {
                    background: mode === 'dark' ? '#f59e0b' : '#b48946',
                    color: mode === 'dark' ? '#0f172a' : '#ffffff',
                    '&:hover': {
                        background: mode === 'dark' ? '#e08f00' : '#a17a3e',
                    },
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
                    borderRadius: 8, // 8px corner radius
                    backdropFilter: 'blur(10px)',
                    background: mode === 'dark' ? '#1e293b' : '#ffffff',
                    border: mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : '1px solid #E2E8F0',
                    boxShadow: 'none',
                    padding: '32px', // Minimum 32px padding
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: mode === 'dark'
                            ? '0px 4px 20px rgba(245, 158, 11, 0.15)'
                            : '0px 4px 12px rgba(180, 137, 70, 0.08)',
                        borderColor: mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.2)'
                            : '#b48946',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(12px)',
                    boxShadow: 'none',
                    borderBottom: mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : '1px solid #E2E8F0',
                    background: mode === 'dark'
                        ? 'rgba(15, 23, 42, 0.8)'
                        : 'rgba(248, 249, 255, 0.8)',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 8,
                    backdropFilter: 'blur(12px)',
                    background: mode === 'dark'
                        ? 'rgba(30, 41, 59, 0.95)'
                        : 'rgba(255, 255, 255, 0.95)',
                    border: mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : '1px solid #E2E8F0',
                    boxShadow: mode === 'dark'
                        ? '0 8px 32px 0 rgba(0, 0, 0, 0.5)'
                        : '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: 8,
                    backdropFilter: 'blur(12px)',
                    background: mode === 'dark'
                        ? 'rgba(30, 41, 59, 0.9)'
                        : 'rgba(255, 255, 255, 0.9)',
                    border: mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : '1px solid #E2E8F0',
                    boxShadow: mode === 'dark'
                        ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                        : '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backdropFilter: 'blur(12px)',
                    background: mode === 'dark'
                        ? 'rgba(15, 23, 42, 0.9)'
                        : 'rgba(248, 249, 255, 0.9)',
                    borderRight: mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : '1px solid #E2E8F0',
                },
            },
        },
        MuiPopover: {
            styleOverrides: {
                paper: {
                    borderRadius: 8,
                    backdropFilter: 'blur(12px)',
                    background: mode === 'dark'
                        ? 'rgba(30, 41, 59, 0.9)'
                        : 'rgba(255, 255, 255, 0.9)',
                    border: mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : '1px solid #E2E8F0',
                },
            },
        },
    },
});

export default THEME;
