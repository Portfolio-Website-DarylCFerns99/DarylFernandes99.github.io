import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import { LoadingAnimations } from '../../pages/loading';

const PageLoader = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const theme = useTheme();

    useEffect(() => {
        // Show loader on route change
        setIsLoading(true);

        // Hide loader after a short delay to allow the new page to render
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800); // 800ms delay

        return () => clearTimeout(timer);
    }, [location.pathname]); // Trigger on path change

    return (
        <>
            {isLoading && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100vh',
                        zIndex: 9999,
                        bgcolor: theme.palette.background.default,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <LoadingAnimations />
                </Box>
            )}
            <Box sx={{ display: isLoading ? 'none' : 'block' }}>
                {children}
            </Box>
        </>
    );
};

export default PageLoader;
