import PropTypes from 'prop-types';
import { Fragment, useRef, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Tooltip,
    useTheme,
    Container,
    BottomNavigation,
    BottomNavigationAction
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion';

import { ROUTES } from '../../common/common'
import { THEME_MODES, THEME_MODE_LABELS, getNextThemeMode } from '../../utils/themeUtils'
import useScrollDirection from '../../hooks/useScrollDirection';

// Get icon and label for current theme mode
const getThemeIcon = (mode) => {
    switch (mode) {
        case THEME_MODES.LIGHT:
            return <LightModeIcon fontSize="small" />;
        case THEME_MODES.DARK:
            return <DarkModeIcon fontSize="small" />;
        case THEME_MODES.SYSTEM:
            return <SettingsBrightnessIcon fontSize="small" />;
        default:
            return <SettingsBrightnessIcon fontSize="small" />;
    }
};

const getThemeLabel = (mode) => {
    return THEME_MODE_LABELS[mode] || 'System Mode';
};

const getNextThemeLabel = (currentMode) => {
    const nextMode = getNextThemeMode(currentMode);
    return getThemeLabel(nextMode);
};

const Index = (props) => {
    const theme = useTheme();
    const appBarRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { scrollDirection, isScrolled } = useScrollDirection();
    const navRefs = useRef({});

    const userData = useSelector((state) => state.user);
    const resumeLink = userData.socialLinks?.find(
        link => link.platform === 'document' || link.url?.includes('resume') || link.tooltip?.toLowerCase().includes('resume')
    );

    const handleDragEnd = (event, info, currentPath) => {
        const dropPoint = {
            x: info.point.x,
            y: info.point.y
        };

        // Check if dropped on any nav item
        for (const route of ROUTES) {
            if (route.hide) continue;

            const element = navRefs.current[route.path];
            if (element) {
                const rect = element.getBoundingClientRect();
                if (
                    dropPoint.x >= rect.left &&
                    dropPoint.x <= rect.right &&
                    dropPoint.y >= rect.top &&
                    dropPoint.y <= rect.bottom
                ) {
                    if (route.path !== currentPath) {
                        navigate(route.path);
                    }
                    return;
                }
            }
        }
    };

    const isActiveRoute = (itemPath) => {
        if (itemPath.includes('#')) {
            const hash = itemPath.substring(itemPath.indexOf('#'));
            return location.pathname === '/' && location.hash === hash;
        }
        return location.pathname === itemPath;
    };

    const handleThemeModeToggle = () => {
        const nextMode = getNextThemeMode(props.themeMode);
        props.setThemeMode(nextMode);
    };

    return (
        <Fragment>
            {/* Mobile/Tablet Bottom Navigation */}
            <AnimatePresence>
                {(!isScrolled || scrollDirection === 'up') && (
                    <Box
                        component={motion.div}
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        sx={{
                            position: 'fixed',
                            bottom: theme.spacing(1),
                            left: 0,
                            right: 0,
                            display: { xs: 'flex', md: 'none' },
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1100,
                            pointerEvents: 'none'
                        }}
                    >
                        <Box
                            sx={{
                                pointerEvents: 'auto',
                                background: theme.palette.mode === 'dark'
                                    ? 'rgba(10, 15, 30, 0.8)'
                                    : 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                borderRadius: '24px',
                                boxShadow: theme.palette.mode === 'dark'
                                    ? '0 10px 40px -10px rgba(0, 0, 0, 0.5)'
                                    : '0 10px 40px -10px rgba(0, 0, 0, 0.2)',
                                border: '1px solid',
                                borderColor: theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.1)'
                                    : 'rgba(255, 255, 255, 0.5)',
                                px: 1,
                                py: 1,
                                maxWidth: '95%',
                                minWidth: '300px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            {ROUTES.filter(item => !item.hide).map((item) => {
                                const isActive = isActiveRoute(item.path);
                                return (
                                    <Box
                                        key={item.path}
                                        component={Link}
                                        to={item.path}
                                        sx={{
                                            position: 'relative',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: '12px',
                                            borderRadius: '16px',
                                            color: isActive ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                                            flex: 1,
                                            textDecoration: 'none',
                                            zIndex: 1,
                                            transition: 'color 0.3s ease',
                                            // Enforce color overrides against global CSS to prevent purple visited links
                                            '&:link, &:visited, &:hover, &:active': {
                                                color: isActive ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                                            }
                                        }}
                                    >
                                        {isActive && (
                                            <Box
                                                component={motion.div}
                                                layoutId="activeTab"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                sx={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    borderRadius: '16px',
                                                    backgroundColor: theme.palette.primary.main,
                                                    zIndex: -1,
                                                    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                                                }}
                                            />
                                        )}
                                        <item.icon sx={{ fontSize: '1.5rem', zIndex: 2 }} />
                                    </Box>
                                );
                            })}

                            <Box
                                onClick={handleThemeModeToggle}
                                sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '12px',
                                    borderRadius: '16px',
                                    color: theme.palette.text.secondary,
                                    flex: 1,
                                    cursor: 'pointer',
                                    zIndex: 1,
                                    '&:active': { transform: 'scale(0.95)' },
                                    transition: 'transform 0.1s'
                                }}
                            >
                                {getThemeIcon(props.themeMode)}
                            </Box>
                        </Box>
                    </Box>
                )}
            </AnimatePresence>

            <AppBar
                position='fixed'
                elevation={0}
                component={motion.nav}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{
                    display: { xs: 'none', md: 'block' },
                    background: 'transparent',
                    backdropFilter: 'none',
                    borderBottom: 'none',
                    boxShadow: 'none',
                    zIndex: 1100,
                    pt: 2,
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            background: theme.palette.mode === 'dark'
                                ? 'rgba(5, 5, 5, 0.6)'
                                : 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            borderRadius: '100px',
                            boxShadow: theme.palette.mode === 'dark'
                                ? '0 4px 30px rgba(0, 0, 0, 0.1)'
                                : '0 4px 30px rgba(0, 0, 0, 0.05)',
                            border: '1px solid',
                            borderColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(255, 255, 255, 0.3)',
                            px: 3,
                        }}
                    >
                        <Toolbar sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            minHeight: '64px !important',
                        }}>
                            {/* Logo */}
                            <Box
                                component={Link}
                                to="/#top"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        border: theme => `1px solid ${theme.palette.primary.main}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                                    }}
                                >
                                    <svg
                                        width="14"
                                        height="10"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        style={{
                                            position: 'absolute',
                                            top: -7,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fill: '#b48946'
                                        }}
                                    >
                                        <path d="M12 2l3 5 5-3-2 8H6l-2-8 5 3 3-5z" />
                                    </svg>
                                    <span style={{
                                        fontFamily: `'Hanken Grotesk', sans-serif`,
                                        fontWeight: 800,
                                        fontSize: '0.85rem',
                                        color: '#b48946',
                                        letterSpacing: '0.05em'
                                    }}>
                                        DF
                                    </span>
                                </Box>
                            </Box>

                            {/* Desktop Navigation */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                {ROUTES.map((item) => {
                                    if (item.hide) return null;
                                    const isActive = isActiveRoute(item.path);

                                    return (
                                        <Box
                                            key={item.title}
                                            component={Link}
                                            to={item.path}
                                            sx={{
                                                position: 'relative',
                                                px: 3,
                                                py: 1,
                                                borderRadius: '100px',
                                                fontSize: '0.9rem',
                                                fontWeight: isActive ? 600 : 500,
                                                textDecoration: 'none',
                                                color: isActive
                                                    ? theme.palette.text.primary
                                                    : theme.palette.text.secondary,
                                                transition: 'color 0.2s',
                                                zIndex: 1,
                                                '&:hover': {
                                                    color: theme.palette.text.primary,
                                                }
                                            }}
                                        >
                                            {isActive && (
                                                <Box
                                                    component={motion.div}
                                                    layoutId="activeDesktopTab"
                                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                    sx={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        borderRadius: '100px',
                                                        backgroundColor: theme.palette.mode === 'dark'
                                                            ? 'rgba(255,255,255,0.05)'
                                                            : 'rgba(0,0,0,0.05)',
                                                        zIndex: -1,
                                                    }}
                                                />
                                            )}
                                            {item.title}
                                        </Box>
                                    );
                                })}
                            </Box>

                            {/* Actions Right */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                {resumeLink && (
                                    <Button
                                        onClick={() => {
                                            if (resumeLink.platform === 'document' && resumeLink.url?.startsWith('data:')) {
                                                const newWindow = window.open();
                                                if (newWindow) {
                                                    newWindow.document.write(`
                                                        <iframe 
                                                            src="${resumeLink.url}" 
                                                            style="width:100%; height:100vh; border:none; margin:0; padding:0; display:block;"
                                                            title="${resumeLink.tooltip || resumeLink.fileName || 'Document'}"
                                                        ></iframe>
                                                        <style>body { margin: 0; overflow: hidden; }</style>
                                                    `);
                                                    newWindow.document.title = resumeLink.tooltip || resumeLink.fileName || 'Document';
                                                    newWindow.document.close();
                                                }
                                            } else {
                                                window.open(resumeLink.url, '_blank', 'noopener,noreferrer');
                                            }
                                        }}
                                        variant="outlined"
                                        size="small"
                                        color="primary"
                                        startIcon={
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                                <line x1="16" y1="13" x2="8" y2="13" />
                                                <line x1="16" y1="17" x2="8" y2="17" />
                                                <polyline points="10 9 9 9 8 9" />
                                            </svg>
                                        }
                                        sx={{
                                            textTransform: 'uppercase',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            borderRadius: '100px',
                                            px: 2,
                                            py: 0.5,
                                            display: { xs: 'none', sm: 'inline-flex' },
                                        }}
                                    >
                                        Resume
                                    </Button>
                                )}

                                <Tooltip title={`Switch to ${getNextThemeLabel(props.themeMode)}`}>
                                    <IconButton
                                        onClick={handleThemeModeToggle}
                                        sx={{
                                            color: theme.palette.text.primary,
                                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                            '&:hover': {
                                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                            }
                                        }}
                                    >
                                        {getThemeIcon(props.themeMode)}
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Toolbar>
                    </Box>
                </Container>
            </AppBar>
        </Fragment>
    )
}

Index.propTypes = {
    window: PropTypes.any,
    themeMode: PropTypes.string,
    setThemeMode: PropTypes.func
};

export default Index;
