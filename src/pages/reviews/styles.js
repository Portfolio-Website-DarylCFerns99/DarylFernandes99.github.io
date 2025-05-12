import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

// Reuse the ContactButton style from the home page
export const ContactButton = styled(Button)(({ theme }) => ({
  borderRadius: 50,
  // backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4]
  },
  '& .MuiButton-endIcon': {
    marginLeft: 8,
    transition: 'transform 0.2s ease',
  }
}));

// Page container styles
export const pageContainerStyles = (theme, appBarHeight) => ({
  bgcolor: theme.palette.background.default,
  minHeight: 'calc(100vh - 64px)', // Adjust for app bar height
  backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(30, 45, 90, 0.15) 0%, rgba(30, 45, 90, 0) 70%)',
  py: { xs: 4, md: 8 },
  pt: { xs: `calc(${appBarHeight}px + 2rem)`, md: `calc(${appBarHeight / 2}px + 4rem)` }
});

// Page title styles
export const pageTitleStyles = {
  mb: 6, 
  textAlign: 'center'
};

// Section subtitle styles
export const sectionSubtitleStyles = (theme) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  mb: 1
});

// Main heading styles
export const mainHeadingStyles = {
  fontSize: { xs: '2rem', md: '3rem' },
  fontWeight: 700,
  mb: 2
};

// Heading span styles
export const headingSpanStyles = {
  fontSize: 'inherit',
  fontStyle: 'italic'
};

// Description text styles
export const descriptionTextStyles = (theme) => ({ 
  maxWidth: '700px', 
  mx: 'auto',
  color: theme.palette.text.secondary
});

// Paper container styles
export const paperContainerStyles = { 
  p: 4, 
  borderRadius: 2 
};

// Form heading styles
export const formHeadingStyles = { 
  fontWeight: 600 
};

// Submit button styles
export const submitButtonStyles = (theme, isMobile) => ({ 
  mt: 2,
  bgcolor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    bgcolor: theme.palette.primary.dark,
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  },
  '&.Mui-disabled': {
    bgcolor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
  border: 'none',
  fontWeight: 500,
  fullWidth: isMobile
}); 