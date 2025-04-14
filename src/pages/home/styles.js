import { styled, keyframes } from '@mui/material/styles';
import { Avatar, Button, IconButton, Card, Box, Typography } from '@mui/material';

// Helper to filter out custom props from DOM elements
const shouldForwardProp = (prop) => 
  !['itemType', 'align', 'index', 'isActive', 'isExpanded', 'isCurrent', 'direction'].includes(prop);

// Common transition for all responsive elements
const responsiveTransition = 'all 0.3s ease-in-out';

// Bouncing animation keyframes
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-12px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

// Marquee animation for projects section
const marqueeAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

// Timeline animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseCircle = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
`;

// Timeline Keyframes
export const animationKeyframes = {
  fadeInLeft: keyframes`
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  `,
  fadeInRight: keyframes`
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  `,
  pulse: keyframes`
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
    }
    70% {
      transform: scale(1.1);
      box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
  `,
  expandCollapse: keyframes`
    from {
      max-height: 0;
      opacity: 0;
      margin-top: 0;
    }
    to {
      max-height: 500px;
      opacity: 1;
      margin-top: 16px;
    }
  `
};

// Styled components with transitions
export const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  margin: '0 auto',
  position: 'relative',
  border: `2px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[4],
  transition: responsiveTransition,
  [theme.breakpoints.down('sm')]: {
    width: 120,
    height: 120,
  },
  [theme.breakpoints.between('sm', 'md')]: {
    width: 140,
    height: 140,
  },
  [theme.breakpoints.up('md')]: {
    width: 160,
    height: 160,
  },
}));

export const StatusIndicator = styled('div')(({ theme }) => ({
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main, // Use theme success color instead of hardcoded green
  marginRight: 8,
  transition: responsiveTransition,
  [theme.breakpoints.down('sm')]: {
    width: 8,
    height: 8,
  },
  [theme.breakpoints.up('sm')]: {
    width: 10,
    height: 10,
  },
}));

export const SocialButton = styled(Button)(({ theme }) => ({
  borderRadius: '50%',
  padding: 0,
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  transition: responsiveTransition,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'scale(1.05)',
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 36,
    width: 36,
    height: 36,
  },
  [theme.breakpoints.up('sm')]: {
    minWidth: 40,
    width: 40,
    height: 40,
  },
}));

export const ContactButton = styled(Button)(({ theme }) => ({
  borderRadius: 50,
  backgroundColor: theme.palette.background.paper,
  // color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
  transition: responsiveTransition,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  },
  '& .MuiButton-endIcon': {
    marginLeft: 8,
    transition: 'transform 0.2s ease',
  },
  '&:hover .MuiButton-endIcon': {
    transform: 'translateX(2px)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '8px 20px',
    fontSize: '0.875rem',
  },
  [theme.breakpoints.up('sm')]: {
    padding: '10px 25px',
    fontSize: '1rem',
  },
}));

// Styled down arrow button with bouncing animation
export const DownArrowButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  transition: responsiveTransition,
  animation: `${bounce} 2s infinite`,
  marginTop: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    color: theme.palette.text.primary,
  },
  [theme.breakpoints.down('sm')]: {
    width: 40,
    height: 40,
  },
  [theme.breakpoints.up('sm')]: {
    width: 48,
    height: 48,
  },
}));

// About section container
export const AboutSection = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(10, 2),
  // minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    textAlign: 'center',
    padding: theme.spacing(6, 2),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(10, 4),
  },
}));

// About section image
export const AboutImage = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    transition: responsiveTransition,
    padding: theme.spacing(0),
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    maxWidth: 500,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    '& img': {
      padding: 0,
    }
  },
  [theme.breakpoints.up('md')]: {
    width: '45%',
    height: 400,
  },
}));

// Projects section
export const ProjectsSection = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(10, 0, 12),
  textAlign: 'center',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 0, 8),
  },
}));

// Swipe indicator animation
const fadeInOut = keyframes`
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
`;

// Updated Carousel Styled Components
export const CarouselContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 1200,
  margin: '0 auto',
  padding: theme.spacing(0, 2),
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 1),
  }
}));

export const SwipeIndicator = styled('div', {
  shouldForwardProp: (prop) => !['direction', 'isVisible'].includes(prop),
})(({ theme, direction = 'left', isVisible = false }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: 50,
  height: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  color: theme.palette.common.white,
  borderRadius: '50%',
  zIndex: 5,
  opacity: isVisible ? 1 : 0,
  animation: isVisible ? `${fadeInOut} 1s infinite` : 'none',
  pointerEvents: 'none', // So it doesn't interfere with touch events
  [direction === 'left' ? 'left' : 'right']: theme.spacing(4),
}));

export const CarouselTrack = styled('div', {
  shouldForwardProp: (prop) => !['translateX', 'isSwiping'].includes(prop),
})(({ theme, isSwiping, translateX = 0 }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: 'fit-content',
  transform: `translateX(${translateX}px)`,
  touchAction: 'pan-y',
  userSelect: 'none',
  transition: isSwiping ? 'none' : 'transform 0.5s ease',
  cursor: isSwiping ? 'grabbing' : 'grab',
  gap: theme.spacing(2),
  padding: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1.5),
    padding: theme.spacing(0.5),
  }
}));

export const CarouselSlide = styled('div', {
  shouldForwardProp: (prop) => !['isCurrent'].includes(prop),
})(({ theme, isCurrent }) => ({
  flex: '0 0 auto',
  opacity: isCurrent ? 1 : 0.7,
  transition: 'opacity 0.3s ease, transform 0.3s ease',
  transform: isCurrent ? 'scale(1)' : 'scale(0.95)',
  padding: theme.spacing(0, 1),
  width: '100%',
  // Add webkit tap highlight color to improve touch feedback
  WebkitTapHighlightColor: 'transparent',
  [theme.breakpoints.up('xs')]: {
    width: '100%',
  },
  [theme.breakpoints.up('sm')]: {
    width: '50%',
  },
  [theme.breakpoints.up('md')]: {
    width: 'calc(100% / 3)',
  },
  [theme.breakpoints.up('lg')]: {
    width: '25%',
  },
}));

export const CarouselNavButton = styled(IconButton, {
  shouldForwardProp: (prop) => !['direction'].includes(prop),
})(({ theme, direction }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[2],
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  [direction === 'left' ? 'left' : 'right']: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-50%) scale(1.1)',
  },
  [theme.breakpoints.down('sm')]: {
    width: 36,
    height: 36,
  },
  [theme.breakpoints.up('sm')]: {
    width: 48,
    height: 48,
  },
}));

export const CarouselPagination = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(3),
}));

export const PaginationDot = styled('button', {
  shouldForwardProp: (prop) => !['isActive'].includes(prop),
})(({ theme, isActive }) => ({
  width: isActive ? 12 : 8,
  height: 8,
  borderRadius: 4,
  border: 'none',
  padding: 0,
  backgroundColor: isActive 
    ? theme.palette.primary.main 
    : theme.palette.divider,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: isActive 
      ? theme.palette.primary.main 
      : theme.palette.action.hover,
  },
}));

// Project cards container with marquee effect
export const ProjectsMarquee = styled('div')(({ theme }) => ({
  display: 'flex',
  width: 'fit-content',
  animation: `${marqueeAnimation} 35s linear infinite`,
  '&:hover': {
    animationPlayState: 'paused',
  },
}));

// Projects track - holds two sets of projects for infinite scrolling
export const ProjectsTrack = styled('div')({
  display: 'flex',
  width: 'fit-content',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  '&:hover > div': {
    animationPlayState: 'paused',
  },
});

// Individual project card
export const ProjectCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 360,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  transition: responsiveTransition,
  [theme.breakpoints.down('sm')]: {
    // minHeight: 280,
    width: '100%',
  },
}));

// Project image container
export const ProjectImageWrapper = styled('div')({
  width: '100%',
  height: '40%',
  overflow: 'hidden',
  position: 'relative',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  // '&:hover img': {
  //   transform: 'scale(1.05)',
  // },
});

// Project tags container
export const ProjectTags = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  position: 'absolute',
  top: theme.spacing(1),
  left: theme.spacing(1),
  zIndex: 2,
}));

// Project tag
export const ProjectTag = styled('span')(({ theme }) => ({
  padding: theme.spacing(0.25, 1),
  borderRadius: theme.shape.borderRadius * 2,
  fontSize: '0.75rem',
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(0, 0, 0, 0.6)'
    : 'rgba(37, 99, 235, 0.8)',
  color: theme.palette.mode === 'dark'
    ? theme.palette.common.white 
    : theme.palette.common.white,
  backdropFilter: 'blur(4px)',
  fontWeight: 500,
  whiteSpace: 'nowrap',
}));

// Skills & Experience section
export const SkillsSection = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(10, 0, 12),
  textAlign: 'center',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 0, 8),
  },
}));

export const ExperienceSection = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(10, 0, 0),
  textAlign: 'center',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 0, 0),
  },
}));

export const SkillsContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(4, 3, 5),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(32, 32, 32, 0.9)'
    : theme.palette.background.paper,
  marginBottom: theme.spacing(6),
  boxShadow: theme.shadows[1],
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2, 4),
    gap: theme.spacing(1),
  },
}));

export const Skill = styled('div')(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius * 5,
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(0, 0, 0, 0.4)'
    : theme.palette.primary.main,
  color: theme.palette.mode === 'dark'
    ? theme.palette.common.white
    : theme.palette.primary.contrastText,
  fontSize: '0.9rem',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(40, 40, 40, 0.9)'
      : theme.palette.primary.dark,
    transform: 'translateY(-2px)',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
    padding: theme.spacing(0.75, 1.5),
  },
}));

export const ExperienceRow = styled('div')(({ theme }) => ({
  display: 'flex',
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(4, 2),
  textAlign: 'left',
  justifyContent: 'space-between',
  '&:last-child': {
    borderBottom: 'none',
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    padding: theme.spacing(3, 1),
    gap: theme.spacing(1),
  },
}));

// Timeline Styles
export const TimelineContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  maxWidth: '1200px',
  margin: '0 auto',
  paddingTop: '40px',
  paddingBottom: '60px',
  width: '100%',
}));

// New component for the wavy line that goes in the center
export const TimelineWavyLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '39%',
  transform: 'translateX(-50%)',
  top: '40px',
  bottom: 0,
  height: '100%',
  zIndex: 1,
  
  '& svg': {
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  
  '& text': {
    fontFamily: theme.typography.fontFamily,
    userSelect: 'none',
  },
  
  '& circle': {
    transition: 'all 0.3s ease',
    '&:hover': {
      r: 10,
    }
  },
  
  [theme.breakpoints.down('md')]: {
    display: 'none', // Hide completely on mobile
  }
}));

// Timeline Item - positioned based on left/right alignment
export const TimelineItem = styled(Box, {
  shouldForwardProp: (prop) => !['align', 'itemType', 'index'].includes(prop),
})(({ theme, align, itemType, index }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  margin: '40px 0',
  minHeight: '140px',
  opacity: 0,
  animation: `${fadeIn} 0.5s ease forwards ${(index * 0.2) + 0.1}s`,
  
  // Distribute items on either side of the timeline
  justifyContent: align === 'left' ? 'flex-end' : 'flex-start',
  paddingLeft: align === 'left' ? 0 : '52%',
  paddingRight: align === 'left' ? '52%' : 0,
  
  // Mobile view - all items aligned to right side
  [theme.breakpoints.down('md')]: {
    justifyContent: 'flex-start',
    paddingLeft: '0px',
    paddingRight: 0,
    margin: '30px 0',
  },
}));

// The colored year box
export const TimelineYearBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'itemType',
})(({ theme, itemType }) => ({
  background: itemType === 'experience' ? '#f8d07a' : '#a6e1d5',
  color: theme.palette.common.black,
  padding: '8px 16px',
  borderRadius: '4px',
  fontWeight: 'bold',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: theme.spacing(0, 2),
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  zIndex: 5,
  height: '36px',
  minWidth: '80px',
  textAlign: 'center',
  position: 'absolute',
  // Place year boxes on the opposite side
  left: 'auto',
  right: 'auto',
  
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(0, 1),
    padding: '6px 12px',
    fontSize: '12px',
    left: '-42px',
  },
}));

// Timeline dots that appear on the wavy line
export const TimelineDot = styled(Box, {
  shouldForwardProp: (prop) => !['itemType', 'dotPosition', 'timelinePoint', 'align'].includes(prop),
})(({ theme, itemType, dotPosition = 50, timelinePoint, align }) => ({
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  background: itemType === 'experience' ? '#f8d07a' : '#a6e1d5',
  border: `2px solid ${theme.palette.mode === 'dark' ? '#1E1E1E' : theme.palette.background.paper}`,
  boxShadow: '0 0 0 2px ' + (itemType === 'experience' ? '#f8d07a' : '#a6e1d5'),
  position: 'absolute',
  // top: '50%',
  [align]: align === 'left' ? '51%' : '52%',
  // marginTop: timelinePoint ? timelinePoint.y + 'px' : '0',
  // marginLeft: '0px',
  // transform: 'translate(-50%, -50%)',
  zIndex: 5,
  animation: `${pulseCircle} 2s infinite`,
  
  // On mobile, dots are always on the left
  [theme.breakpoints.down('md')]: {
    left: '30px',
    marginLeft: '0',
    marginTop: '0',
  },
}));

// The content card
export const TimelineContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'itemType',
})(({ theme, itemType, align }) => ({
  background: theme.palette.mode === 'dark' ? '#1E1E1E' : theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 2px 8px rgba(0,0,0,0.15)'
    : '0 2px 6px rgba(0,0,0,0.08)',
  position: 'relative',
  maxWidth: '450px',
  width: '100%',
  zIndex: 2,
  transition: 'all 0.3s ease',
  borderLeft: `4px solid ${itemType === 'experience' ? '#f8d07a' : '#a6e1d5'}`,
  textAlign: 'left',
  paddingLeft: theme.spacing(4), // Add extra padding on the left for the icon
  
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 12px rgba(0,0,0,0.2)'
      : '0 4px 10px rgba(0,0,0,0.1)',
  },
  
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(3), // Keep some extra padding on mobile
    maxWidth: '100%',
  },
}));

// Type icon that appears on the left column center of the card
export const TimelineTypeIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'itemType',
})(({ theme, itemType }) => ({
  position: 'absolute',
  left: -20,
  top: '50%',
  transform: 'translateY(-50%)',
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: itemType === 'experience' ? '#f8d07a' : '#a6e1d5',
  color: theme.palette.common.black,
  boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
  zIndex: 10,
  transition: 'all 0.3s ease',
  
  '& svg': {
    fontSize: 22,
    transition: 'all 0.3s ease',
  },
  
  '&:hover': {
    transform: 'translateY(-50%) scale(1.05)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.25)',
    
    '& svg': {
      fontSize: 24,
    }
  },
  
  [theme.breakpoints.down('md')]: {
    left: -18,
    width: 36,
    height: 36,
    
    '& svg': {
      fontSize: 18,
    },
  },
}));

// Typography for the role/title
export const TimelineRole = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(0.5),
  color: theme.palette.text.primary,
  fontSize: '1.1rem',
  
  [theme.breakpoints.down('md')]: {
    fontSize: '1rem',
  },
}));

// Typography for the company/institution
export const TimelineCompany = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  marginBottom: theme.spacing(1.5),
  color: theme.palette.text.secondary,
  fontSize: '0.95rem',
  
  [theme.breakpoints.down('md')]: {
    fontSize: '0.9rem',
    marginBottom: theme.spacing(1),
  },
}));

// Typography for the description
export const TimelineDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  lineHeight: 1.6,
  
  [theme.breakpoints.down('md')]: {
    fontSize: '0.8rem',
  },
}));

// Additional responsive typography styles
export const responsiveStyles = {
  nameText: {
    fontWeight: 'bold',
    transition: responsiveTransition,
    fontSize: {
      xs: '1.75rem',
      sm: '2.5rem',
      md: '3rem'
    }
  },
  surnameText: {
    fontWeight: 'normal',
    fontStyle: 'italic',
    fontSize: 'inherit',
    transition: responsiveTransition,
  },
  titleText: {
    transition: responsiveTransition,
    fontSize: {
      xs: '0.9rem',
      sm: '1rem',
      md: '1.25rem'
    },
    px: 2
  },
  availabilityText: {
    transition: responsiveTransition,
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem'
    }
  },
  // About section styles
  aboutTitle: {
    fontWeight: 'bold',
    transition: responsiveTransition,
    marginBottom: 2,
    fontSize: {
      xs: '2rem',
      sm: '2.5rem',
      md: '3rem'
    }
  },
  aboutHighlight: {
    fontStyle: 'italic',
    fontWeight: 'normal',
    color: 'text.secondary',
  },
  aboutDescription: {
    transition: responsiveTransition,
    maxWidth: 650,
    lineHeight: 1.8,
    fontSize: {
      xs: '1rem',
      sm: '1.1rem',
      md: '1.2rem'
    },
    mt: 3,
    color: 'text.secondary',
  },
  // Project section styles
  sectionSubtitle: {
    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
    color: 'text.secondary',
    mb: 2,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  sectionTitle: {
    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
    fontWeight: 700,
    mb: 4,
    letterSpacing: -1,
    lineHeight: 1.2,
    position: 'relative',
    display: 'inline-block',
    '&:before': {
      content: '""',
      position: 'absolute',
      bottom: -16,
      left: '50%',
      transform: 'translateX(-130%)',
      width: 60,
      height: 2,
      backgroundColor: 'primary.main',
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: -16,
      left: '50%',
      transform: 'translateX(-30%)',
      width: 160,
      height: 2,
      backgroundColor: 'divider'
    }
  },
  highlightItalic: {
    color: 'primary.main',
    fontStyle: 'italic',
    fontSize: {
      xs: '2.6rem',
      sm: '2.75rem',
      md: '3.4rem'
    },
  },
  experienceTitle: {
    fontWeight: 600,
    fontSize: {
      xs: '1.1rem',
      sm: '1.25rem',
    },
  },
  experienceCompany: {
    color: 'text.secondary',
    fontSize: {
      xs: '1rem',
      sm: '1.1rem',
    },
  },
  experienceDate: {
    color: 'text.secondary',
    fontSize: {
      xs: '0.9rem',
      sm: '1rem',
    },
    textAlign: {
      xs: 'left',
      md: 'right'
    },
  },
  projectTitle: {
    fontWeight: 700,
    fontSize: {
      xs: '1.25rem',
      sm: '1.4rem',
    },
    mt: 2,
    mb: 1,
    // px: 2,
  },
  projectDescription: {
    fontSize: {
      xs: '0.875rem',
      sm: '1rem',
    },
    color: 'text.secondary',
    // px: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  timelineTitle: {
    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
    fontWeight: 600,
    mt: 2.5,
  },
  timelineSubtitle: {
    fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
    color: 'text.secondary',
    fontWeight: 500,
    mt: 0.5
  },
  timelineDescription: {
    fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
    color: 'text.secondary',
    lineHeight: 1.6,
  },
  timelinePeriod: {
    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
    color: 'text.disabled',
    fontStyle: 'italic',
  },
};

// Filter Legend Button
export const FilterLegendButton = styled('div', {
  shouldForwardProp
})(({ theme, isActive = true, itemType }) => ({
  display: 'flex', 
  alignItems: 'center', 
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: isActive 
    ? itemType === 'experience' 
      ? 'rgba(76, 175, 80, 0.1)' 
      : 'rgba(25, 118, 210, 0.1)'
    : theme.palette.action.disabledBackground,
  border: '1px solid',
  borderColor: isActive 
    ? itemType === 'experience' 
      ? theme.palette.success.main 
      : theme.palette.primary.main
    : theme.palette.divider,
  color: isActive ? theme.palette.text.primary : theme.palette.text.disabled,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  userSelect: 'none',
  
  '&:hover': {
    backgroundColor: itemType === 'experience' 
      ? 'rgba(76, 175, 80, 0.2)' 
      : 'rgba(25, 118, 210, 0.2)',
    transform: 'translateY(-2px)',
  }
}));

// Swiper custom styles
export const SwiperStyles = {
  '& .swiper': {
    width: '100%',
    // paddingTop: '50px',
    // paddingBottom: '50px',
  },
  '& .swiper-slide': {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    width: '280px',
    height: '360px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  '& .swiper-pagination': {
    position: 'relative',
    marginTop: '20px',
  },
  '& .swiper-pagination-bullet': {
    width: '10px',
    height: '10px',
    backgroundColor: theme => theme.palette.primary.main,
    opacity: 0.5,
    transition: 'all 0.3s ease',
  },
  '& .swiper-pagination-bullet-active': {
    opacity: 1,
    transform: 'scale(1.2)',
  },
};