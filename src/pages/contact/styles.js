import { styled, alpha } from '@mui/material/styles';
import { Button } from '@mui/material';

// Common transition for responsive elements
const responsiveTransition = 'all 0.3s ease-in-out';

// Export responsive styles object to be used as sx props
export const responsiveStyles = {
  sectionSubtitle: {
    fontSize: { xs: '0.9rem', md: '1rem' },
    transition: responsiveTransition,
  },
  pageTitle: {
    fontSize: { xs: '2rem', md: '3rem' },
    fontWeight: 700,
    mb: 2,
    transition: responsiveTransition,
  },
  pageTitleSpan: {
    fontSize: 'inherit',
    fontStyle: 'italic',
  },
  pageDescription: {
    maxWidth: '700px',
    mx: 'auto',
    transition: responsiveTransition,
  },
  mainContainer: {
    minHeight: 'calc(100vh - 64px)',
    backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(30, 45, 90, 0.15) 0%, rgba(30, 45, 90, 0) 70%)',
    py: { xs: 4, md: 8 },
    transition: responsiveTransition,
  },
  contactForm: {
    p: { xs: 3, md: 5 },
    borderRadius: 3,
    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : theme.palette.background.paper,
    border: (theme) => `1px solid ${theme.palette.divider}`,
    boxShadow: (theme) => theme.shadows[4],
  },
  formTitle: {
    mb: 4,
    fontWeight: 700,
    fontSize: '1.5rem',
  },
};

// Styled contact button with transitions and animations
export const ContactButton = styled(Button)(({ theme }) => ({
  borderRadius: 50,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: '12px 32px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
  transition: responsiveTransition,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.5)}`,
    transform: 'translateY(-2px)',
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
  border: 'none',
  '& .MuiButton-endIcon': {
    marginLeft: 8,
    transition: 'transform 0.2s ease',
  },
  '&:hover .MuiButton-endIcon': {
    transform: 'translateX(4px)',
  },
}));