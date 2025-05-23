import { styled } from '@mui/material/styles'
import { Box, Container, Card, Chip, alpha } from '@mui/material'

// Styled components for Projects page
export const ProjectsContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
}))

export const ProjectCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  // '&:hover': {
  //   transform: 'translateY(-8px)',
  //   boxShadow: theme.shadows[6],
  // },
}))

export const ProjectImageContainer = styled(Box)(({ theme }) => ({
  height: 240,
  [theme.breakpoints.down('sm')]: {
    height: 180,
  },
  transition: 'transform 0.5s ease',
  overflow: 'hidden',
  position: 'relative',
  '&:hover img': {
    transform: 'scale(1.05)',
  },
}))

export const ProjectImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
}))

export const ProjectTags = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
}))

export const ProjectTag = styled(Chip)(({ theme }) => ({
  fontSize: '0.7rem',
  fontWeight: 500,
  borderRadius: '14px',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'transparent' 
    : alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.mode === 'dark' 
    ? theme.palette.primary.main 
    : theme.palette.primary.main,
  border: theme.palette.mode === 'dark' 
    ? `1px solid ${alpha(theme.palette.primary.main, 0.5)}` 
    : 'none',
}))

export const ProjectType = styled(Box)(({ theme, type }) => ({
  position: 'absolute',
  top: theme.spacing(1.5),
  right: theme.spacing(1.5),
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius * 5,
  backgroundColor: type === 'github' 
    ? alpha(theme.palette.mode === 'dark' ? '#333' : '#24292e', 0.85)
    : alpha(theme.palette.primary.main, 0.15),
  color: type === 'github'
    ? theme.palette.common.white
    : theme.palette.primary.main,
  fontSize: '0.75rem',
  fontWeight: 500,
  backdropFilter: 'blur(4px)',
}))

export const ProjectContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
}))

export const ProjectFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginTop: 'auto',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(0.5),
  color: theme.palette.primary.main,
  fontSize: '0.8rem',
  fontWeight: 500,
})) 