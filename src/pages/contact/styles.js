import { styled } from '@mui/material/styles';
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
    p: 4,
    borderRadius: 2,
  },
  formTitle: {
    mb: 3,
    fontWeight: 600,
  },
};

// Styled contact button with transitions and animations
export const ContactButton = styled(Button)(({ theme }) => ({
  borderRadius: 50,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: theme.shadows[2],
  transition: responsiveTransition,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
  border: 'none',
  fontWeight: 500,
  '& .MuiButton-endIcon': {
    marginLeft: 8,
    transition: 'transform 0.2s ease',
  },
  '&:hover .MuiButton-endIcon': {
    transform: 'translateX(2px)',
  },
})); 