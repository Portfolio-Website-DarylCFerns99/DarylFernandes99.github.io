import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';

// Import styles for animation effects
import { fadeIn, AnimationContainer } from './styles';
import { generateSvgArray } from '../../common/common';

// Dynamic import of all SVG files from the loading folder
const loadingSvgs = import.meta.glob('../../assets/loading/*.svg', { eager: true });

// Export the LoadingAnimations component
export const LoadingAnimations = ({ height = '100vh' }) => {
  const theme = useTheme();
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const [loadingMessages, setLoadingMessages] = useState([
    'Loading Cloud Resources...',
    'Fetching Data...',
    'Making API Calls...',
    'Initializing Environment...',
    'Preparing Development Environment...',
    'Connecting Services...'
  ]);

  // Use the imported generateSvgArray function
  const svgArray = generateSvgArray(loadingSvgs);

  useEffect(() => {
    // Choose a random animation when the component mounts
    const randomIndex = Math.floor(Math.random() * svgArray.length);
    setCurrentAnimation(randomIndex);

    // Optional: Set up interval to change animation every X seconds
    // const interval = setInterval(() => {
    //   setCurrentAnimation(prev => (prev + 1) % svgArray.length);
    // }, 8000);
    // 
    // return () => clearInterval(interval);
  }, [svgArray.length]);

  // If no SVGs are found, show a fallback message
  if (svgArray.length === 0) {
    return (
      <AnimationContainer height={height}>
        <Typography variant="h5" sx={{ animation: `${fadeIn} 1s ease-in-out` }}>
          Loading...
        </Typography>
      </AnimationContainer>
    );
  }

  // Get the current SVG to display
  const currentSvg = svgArray[currentAnimation % svgArray.length];
  
  // Get appropriate loading message or fallback to the SVG's display name
  const loadingMessage = loadingMessages[currentAnimation % loadingMessages.length] || 
    `Loading ${currentSvg.displayName}...`;

  return (
    <AnimationContainer height={height}>
      <Box 
        sx={{
          width: { xs: '80%', sm: '60%', md: '50%', lg: '40%' },
          maxWidth: 400,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 4,
          '& img': {
            maxWidth: '100%',
            maxHeight: 300,
            animation: `${fadeIn} 1s ease-in-out`
          }
        }}
      >
        <img 
          src={currentSvg.url} 
          alt={currentSvg.displayName} 
        />
      </Box>
      {/* <Typography 
        variant="h5" 
        sx={{ 
          mt: 4, 
          animation: `${fadeIn} 1s ease-in-out`,
          color: theme.palette.text.primary
        }}
      >
        {loadingMessage}
      </Typography> */}
    </AnimationContainer>
  );
};

const Index = () => {
  return <LoadingAnimations />;
};

export default Index;
