import { styled } from '@mui/material/styles'
import { Box, Container, Paper, Button, alpha, Typography } from '@mui/material'

export const DetailContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(10),
  position: 'relative',
  zIndex: 2,
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(6),
  },
}))

// Hero Section Styles
export const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  minHeight: '400px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 3,
  overflow: 'hidden',
  boxShadow: theme.shadows[4],
  [theme.breakpoints.down('md')]: {
    minHeight: '300px',
    marginBottom: theme.spacing(4),
  },
}))

export const HeroBackground = styled(Box)(({ theme, image }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: image ? `url(${image})` : 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: theme.palette.mode === 'dark' ? 'blur(4px) brightness(1)' : 'blur(4px) brightness(0.6)',
  transform: 'scale(1.1)', // Prevent blur edges
  zIndex: 0,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.2)}, ${theme.palette.background.default})`,
  },
}))

export const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  textAlign: 'center',
  padding: theme.spacing(4),
  maxWidth: '800px',
  width: '100%',
}))

// Layout Components
export const PageLayout = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 350px',
  gap: theme.spacing(4),
  gridTemplateAreas: '"main sidebar"',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gridTemplateAreas: `
      "sidebar"
      "main"
    `,
  },
}))

export const MainColumn = styled(Box)(({ theme }) => ({
  minWidth: 0, // Prevent grid blowout
  gridArea: 'main',
}))

export const SidebarColumn = styled(Box)(({ theme }) => ({
  minWidth: 0,
  gridArea: 'sidebar',
  [theme.breakpoints.up('md')]: {
    position: 'sticky',
    top: 100,
    height: 'fit-content',
  },
}))

// Glassmorphism Card
export const GlassCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  background: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.6)
    : alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: theme.shadows[2],
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  position: 'relative', // Allow absolute positioning of children
  overflow: 'visible', // Allow menu to spill out if needed, though MUI menu uses portal
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}))

export const ProjectTag = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.75, 1.5),
  borderRadius: '12px',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontSize: '0.8rem',
  fontWeight: 600,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    transform: 'translateY(-1px)',
  },
}))

export const BackButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  padding: theme.spacing(1, 2),
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  backdropFilter: 'blur(4px)',
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.main,
    transform: 'translateX(-4px)',
  },
}))

export const ReadmeContent = styled(Box)(({ theme }) => ({
  '& > *': {
    maxWidth: '100%',
  },
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    margin: theme.spacing(2, 0),
  },
  '& h1': {
    fontSize: '2.25rem',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: theme.palette.text.primary,
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingBottom: theme.spacing(1),
  },
  '& h2': {
    fontSize: '1.75rem',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    fontWeight: 700,
    letterSpacing: '-0.01em',
    color: theme.palette.text.primary,
  },
  '& h3': {
    fontSize: '1.5rem',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1.5),
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  '& p': {
    marginBottom: theme.spacing(2.5),
    lineHeight: 1.7,
    fontSize: '1.05rem',
    color: theme.palette.text.secondary,
  },
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
    transition: 'border-color 0.2s ease',
    '&:hover': {
      borderBottomColor: theme.palette.primary.main,
    },
  },
  '& code': {
    backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05),
    color: theme.palette.primary.main,
    padding: theme.spacing(0.25, 0.75),
    borderRadius: 6,
    fontFamily: '"Fira Code", monospace',
    fontSize: '0.9em',
  },
  '& pre': {
    backgroundColor: theme.palette.mode === 'dark' ? '#1a1b26' : '#f6f8fa',
    padding: theme.spacing(2.5),
    borderRadius: theme.shape.borderRadius * 1.5,
    overflowX: 'auto',
    marginBottom: theme.spacing(3),
    border: `1px solid ${theme.palette.divider}`,
    maxWidth: '100%',
    '& code': {
      backgroundColor: 'transparent',
      color: 'inherit',
      padding: 0,
      fontSize: '0.9rem',
    },
  },
  '& ul, & ol': {
    paddingLeft: theme.spacing(3),
    marginBottom: theme.spacing(3),
    '& li': {
      marginBottom: theme.spacing(1),
      paddingLeft: theme.spacing(0.5),
      color: theme.palette.text.secondary,
      '&::marker': {
        color: theme.palette.primary.main,
      },
    },
  },
  '& blockquote': {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(1, 3),
    margin: theme.spacing(3, 0),
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
    fontStyle: 'italic',
    color: theme.palette.text.primary,
  },
  '& table': {
    width: '100%',
    maxWidth: '100%',
    overflowX: 'auto',
    borderCollapse: 'separate',
    borderSpacing: 0,
    marginBottom: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    '& th, & td': {
      padding: theme.spacing(1.5),
      textAlign: 'left',
      borderBottom: `1px solid ${theme.palette.divider}`,
      whiteSpace: 'nowrap',
    },
    '& th': {
      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.5) : alpha(theme.palette.grey[100], 0.5),
      fontWeight: 600,
      color: theme.palette.text.primary,
    },
    '& tr:last-child td': {
      borderBottom: 'none',
    },
  },
}))

export const SidebarSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '&:last-child': {
    marginBottom: 0,
  },
}))

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontWeight: 700,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}))

