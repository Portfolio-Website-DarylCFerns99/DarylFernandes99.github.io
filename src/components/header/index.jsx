import PropTypes from 'prop-types';
import { Fragment, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom';
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

import { ROUTES } from '../../common/common'
import { THEME_MODES, THEME_MODE_LABELS, getNextThemeMode } from '../../utils/themeUtils'

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

    const handleThemeModeToggle = () => {
        const nextMode = getNextThemeMode(props.themeMode);
        props.setThemeMode(nextMode);
    };

    return (
        <Fragment>
            {/* Mobile/Tablet Bottom Navigation */}
            <Box
                sx={{ 
                    position: 'fixed', 
                    bottom: '10px', 
                    left: 0, 
                    right: 0,
                    display: { xs: 'flex', md: 'none' },
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: { xs: 2, sm: 3 },
                    zIndex: 1100,
                }} 
            >
                <Box
                    sx={{
                        background: theme.palette.mode === 'dark' 
                            ? 'rgba(10, 15, 30, 0.75)' 
                            : 'rgba(250, 250, 255, 0.25)',
                        backdropFilter: 'blur(2px)',
                        WebkitBackdropFilter: 'blur(2px)',
                        borderRadius: '100px',
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 4px 20px rgba(0, 0, 0, 0.2)'
                            : '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(255, 255, 255, 0.6)',
                        px: 2,
                        py: 0.5,
                        width: 'auto',
                        maxWidth: 'calc(100% - 32px)',
                    }}
                >
                    <BottomNavigation
                        value={location.pathname}
                        showLabels={false}
                        sx={{
                            background: 'transparent',
                            height: 48,
                            minWidth: 'auto',
                            '& .MuiBottomNavigationAction-root': {
                                minWidth: { xs: 56, sm: 64 },
                                padding: 0,
                                color: theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.7)' 
                                    : 'rgba(58, 58, 76, 0.7)',
                                '&.Mui-selected': {
                                    color: theme.palette.mode === 'dark' ? '#8b9cda' : '#5D71A8',
                                },
                                '& .MuiSvgIcon-root': {
                                    fontSize: '1.25rem',
                                },
                            },
                        }}
                    >
                        {ROUTES.filter(item => !item.hide).map((item) => (
                            <BottomNavigationAction
                                key={item.path}
                                value={item.path}
                                icon={item.icon && <item.icon />}
                                component={Link}
                                to={item.path}
                            />
                        ))}
                        <BottomNavigationAction
                            icon={getThemeIcon(props.themeMode)}
                            onClick={handleThemeModeToggle}
                        />
                    </BottomNavigation>
                </Box>
            </Box>

            <AppBar 
                position='fixed'
                variant='primary' 
                ref={appBarRef}
                elevation={0}
                sx={{
                    display: { xs: 'none', md: 'block' }, // Hide on mobile, show on desktop
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
                                : 'rgba(250, 250, 255, 0.25)',
                            backdropFilter: 'blur(2px)',
                            WebkitBackdropFilter: 'blur(2px)',
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
                            {/* Logo or Title for mobile - you can add your logo here if needed */}
                            <Box sx={{ 
                                display: { xs: 'none', md: 'none' }, // Hidden by default since AppBar is hidden on mobile
                                alignItems: 'center',
                                flexGrow: 1
                            }}>
                                {/* Add your logo or title here if needed */}
                            </Box>
                            
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
            

        </Fragment>
    )
}

Index.propTypes = {
    window: PropTypes.any,
    themeMode: PropTypes.string,
    setThemeMode: PropTypes.func
};

export default Index;
