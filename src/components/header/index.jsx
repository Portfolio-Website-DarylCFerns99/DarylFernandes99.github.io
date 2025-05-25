import PropTypes from 'prop-types';
import React, { Fragment, useRef, useState, useEffect } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { 
    AppBar, 
    Box, 
    Button, 
    Drawer, 
    IconButton, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    Toolbar, 
    Tooltip, 
    Divider,
    useTheme,
    Container
} from '@mui/material'

import { ROUTES } from '../../common/common'
import { THEME_MODES, THEME_MODE_LABELS, getNextThemeMode } from '../../utils/themeUtils'

const drawerWidth = 280;

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
    const { window } = props;
    const theme = useTheme();
    const appBarRef = useRef(null);
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [appBarHeight, setAppBarHeight] = useState(64); // Default height

    useEffect(() => {
        // Update appBar height when component mounts
        if (appBarRef.current) {
            setAppBarHeight(appBarRef.current.clientHeight);
        }
        
        // Optional: Add resize listener to handle dynamic changes
        const handleResize = () => {
            if (appBarRef.current) {
                setAppBarHeight(appBarRef.current.clientHeight);
            }
        };
        
        // Add event listener to window object
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
        return undefined;
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const handleThemeModeToggle = () => {
        const nextMode = getNextThemeMode(props.themeMode);
        props.setThemeMode(nextMode);
    };

    const drawer = (
        <Box sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(10, 15, 30, 0.75)' 
                : 'rgba(250, 250, 255, 0.85)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)', // For Safari
            pt: `${appBarHeight}px`,
            borderRight: '1px solid',
            borderColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(255, 255, 255, 0.5)',
        }}>
            {/* Navigation Links */}
            <List sx={{ flexGrow: 1 }}>
                {ROUTES.map((item) => item.hide ? null : (
                <ListItem key={item.title} disablePadding>
                    <ListItemButton 
                      component={Link} 
                      to={item.path}
                      onClick={handleDrawerToggle}
                      sx={{ 
                        py: 1,
                        px: 2,
                        my: 0.5,
                        borderRadius: 2,
                        bgcolor: location.pathname === item.path 
                          ? theme.palette.mode === 'dark' ? 'rgba(93, 113, 168, 0.2)' : 'rgba(93, 113, 168, 0.1)'
                          : 'transparent',
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(93, 113, 168, 0.15)' : 'rgba(93, 113, 168, 0.05)'
                        },
                        position: 'relative'
                      }}
                    >
                      <ListItemIcon sx={{ 
                          color: location.pathname === item.path 
                            ? theme.palette.mode === 'dark' ? '#8b9cda' : '#5D71A8' 
                            : theme.palette.text.secondary,
                          minWidth: '40px',
                          opacity: location.pathname === item.path ? 1 : 0.7
                      }}>
                          {item.icon && <item.icon />}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.title} 
                        primaryTypographyProps={{
                          fontWeight: location.pathname === item.path ? 500 : 400,
                          color: location.pathname === item.path 
                            ? theme.palette.mode === 'dark' ? '#8b9cda' : '#5D71A8' 
                            : theme.palette.text.primary,
                          fontSize: '0.95rem'
                        }}
                      />
                    </ListItemButton>
                </ListItem>
                ))}
            </List>
            
            {/* Theme Toggle in Drawer - Better integrated with theme */}
            <Box sx={{ p: 2, pt: 0 }}>
                <Divider sx={{  
                    mb: 2,
                    borderColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(93, 113, 168, 0.15)' 
                }} />
                <Box
                    component={Button}
                    fullWidth
                    variant="outlined"
                    onClick={handleThemeModeToggle}
                    startIcon={getThemeIcon(props.themeMode)}
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        color: theme.palette.mode === 'dark' ? '#fff' : '#3a3a4c',
                        borderColor: theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.15)' 
                            : 'rgba(93, 113, 168, 0.25)',
                        borderRadius: 2,
                        py: 1,
                        textTransform: 'none',
                        '&:hover': {
                            borderColor: theme.palette.mode === 'dark' ? '#8b9cda' : '#5D71A8',
                            bgcolor: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(93, 113, 168, 0.05)'
                        }
                    }}
                >
                    {getThemeLabel(props.themeMode)}
                </Box>
            </Box>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Fragment>
            <AppBar 
                position='fixed'
                variant='primary' 
                ref={appBarRef}
                elevation={0}
                sx={{
                    background: 'transparent',
                    backdropFilter: 'none',
                    borderBottom: 'none',
                    boxShadow: 'none',
                    zIndex: 1100,
                    px: { xs: 0.5, sm: 2, md: 2 },
                    py: { xs: 0.5, sm: 2, md: 2 },
                    pb: { xs: 0 }
                }}
            >
                <Container maxWidth="lg" disableGutters>
                    <Box
                        sx={{
                            background: theme.palette.mode === 'dark' 
                                ? 'rgba(10, 15, 30, 0.75)' 
                                : 'rgba(250, 250, 255, 0.85)',
                            backdropFilter: 'blur(15px)',
                            WebkitBackdropFilter: 'blur(15px)',
                            borderRadius: '100px',
                            boxShadow: theme.palette.mode === 'dark'
                                ? '0 4px 20px rgba(0, 0, 0, 0.2)'
                                : '0 4px 20px rgba(0, 0, 0, 0.08)',
                            border: '1px solid',
                            borderColor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(255, 255, 255, 0.6)',
                            px: { xs: 2, md: 3 },
                            py: 0,
                            overflow: 'hidden'
                        }}
                    >
                        <Toolbar sx={{ 
                            display: 'flex',
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            width: '100%',
                            p: 0,
                            minHeight: { xs: '48px', sm: '52px' }
                        }}>
                            <IconButton
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ 
                                    display: { xs: 'flex', md: 'none' },
                                    color: theme.palette.mode === 'dark' ? '#fff' : '#3a3a4c'
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            
                            {/* Desktop Navigation */}
                            <Box sx={{ 
                                display: { xs: 'none', md: 'flex' },
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexGrow: 1,
                                gap: { md: 0.5, lg: 1 }
                            }}>
                                {ROUTES.map((item) => item.hide ? null : (
                                    <Button 
                                      key={item.title} 
                                      component={Link} 
                                      to={item.path}
                                      disableRipple
                                      sx={{ 
                                        color: location.pathname === item.path 
                                            ? theme.palette.mode === 'dark' ? '#fff' : '#3a3a4c' 
                                            : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(58, 58, 76, 0.8)',
                                        fontWeight: location.pathname === item.path ? 600 : 400,
                                        px: { md: 1.5, lg: 2.5 },
                                        py: 1,
                                        fontSize: '0.85rem',
                                        letterSpacing: '1.2px',
                                        position: 'relative',
                                        textTransform: 'uppercase',
                                        '&:hover': {
                                            backgroundColor: 'transparent'
                                        }
                                      }}
                                    >
                                      {item.title}
                                    </Button>
                                ))}
                            </Box>
                            
                            <Tooltip title={`Switch to ${getNextThemeLabel(props.themeMode)}`}>
                                <IconButton 
                                    onClick={handleThemeModeToggle} 
                                    size="small"
                                    sx={{
                                        bgcolor: 'transparent',
                                        color: theme.palette.mode === 'dark' ? '#fff' : '#3a3a4c',
                                        '&:hover': {
                                            bgcolor: theme.palette.mode === 'dark' 
                                                ? 'rgba(255, 255, 255, 0.1)'
                                                : 'rgba(58, 58, 76, 0.05)'
                                        }
                                    }}
                                >
                                    {getThemeIcon(props.themeMode)}
                                </IconButton>
                            </Tooltip>
                        </Toolbar>
                    </Box>
                </Container>
            </AppBar>
            
            {/* Empty toolbar to create space below fixed AppBar */}
            {/* <Box sx={{ height: { xs: `${appBarRef?.current?.clientHeight}px` } }} /> */}
            
            <Drawer
                container={container}
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: drawerWidth,
                        border: 'none',
                        backdropFilter: 'blur(15px)',
                        WebkitBackdropFilter: 'blur(15px)', // For Safari
                        bgcolor: theme.palette.mode === 'dark' 
                            ? 'rgba(10, 15, 30, 0.75)' 
                            : 'rgba(250, 250, 255, 0.85)',
                        boxShadow: theme.palette.mode === 'dark' 
                            ? '0px 0px 20px rgba(0, 0, 0, 0.3)' 
                            : '0px 0px 20px rgba(0, 0, 0, 0.1)',
                    }
                }}
            >
                {drawer}
            </Drawer>
        </Fragment>
    )
}

Index.propTypes = {
    window: PropTypes.any,
    themeMode: PropTypes.string,
    setThemeMode: PropTypes.func
};

export default Index;
