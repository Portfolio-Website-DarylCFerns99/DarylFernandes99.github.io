import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Avatar,
    IconButton,
    useTheme,
    Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const Sidebar = ({
    sections,
    activeSection,
    onSectionClick,
    user,
    onLogout,
    themeMode,
    onThemeToggle,
    mobileOpen,
    onClose
}) => {
    const theme = useTheme();

    const sidebarContent = (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            p: 2
        }}>
            {/* User Profile */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 4,
                p: 2,
                borderRadius: 2,
                bgcolor: 'action.hover'
            }}>
                <Avatar
                    src={user?.avatar}
                    alt={user?.name}
                    sx={{
                        width: 48,
                        height: 48,
                        border: `2px solid ${theme.palette.primary.main}`
                    }}
                >
                    {user?.name?.[0]}
                </Avatar>
                <Box sx={{ overflow: 'hidden' }}>
                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                        {user?.name} {user?.surname}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                        Admin
                    </Typography>
                </Box>
            </Box>

            {/* Navigation */}
            <List sx={{ flexGrow: 1 }}>
                {sections.map((section) => (
                    <ListItem key={section.id} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            selected={activeSection === section.id}
                            onClick={() => {
                                onSectionClick(section.id);
                                if (onClose) onClose();
                            }}
                            sx={{
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: 'white',
                                    }
                                }
                            }}
                        >
                            <ListItemIcon sx={{
                                minWidth: 40,
                                color: activeSection === section.id ? 'white' : 'text.secondary'
                            }}>
                                {section.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={section.name}
                                primaryTypographyProps={{
                                    fontWeight: activeSection === section.id ? 600 : 400
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Bottom Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IconButton onClick={onThemeToggle} color="inherit">
                    {themeMode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
                <IconButton onClick={onLogout} color="error">
                    <LogoutIcon />
                </IconButton>
            </Box>
        </Box>
    );

    return sidebarContent;
};

export default Sidebar;
