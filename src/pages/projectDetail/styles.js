import { styled } from '@mui/material/styles'
import { Box, Container, Paper, Button, alpha } from '@mui/material'

export const DetailContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
}))

export const ProjectHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}))

export const ProjectBanner = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 300,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  marginBottom: theme.spacing(4),
  position: 'relative',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
      height: 200,
    },
}))

export const BannerImage = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    // width: '100%',
    height: '100%',
  },
  objectFit: 'cover',
}))

export const ProjectContent = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
  wordWrap: 'break-word',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),  
  },
}))

export const ProjectInfoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
  },
}))

export const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.6) 
    : alpha(theme.palette.background.paper, 0.8),
  minWidth: '100px',
  boxShadow: theme.shadows[1],
  backdropFilter: 'blur(4px)',
  gap: theme.spacing(0.5),
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
    marginBottom: theme.spacing(0.5),
  },
}))

export const ProjectTag = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  padding: theme.spacing(0.5, 1.5),
  borderRadius: '16px',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontSize: '0.75rem',
  fontWeight: 500,
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
}))

export const BackButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}))

export const ReadmeContent = styled(Box)(({ theme }) => ({
  '& img': {
    maxWidth: '100%',
  },
  '& h1': {
    fontSize: '2rem',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    fontWeight: 700,
    color: theme.palette.text.primary,
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingBottom: theme.spacing(1),
  },
  '& h2': {
    fontSize: '1.5rem',
    marginTop: theme.spacing(2.5),
    marginBottom: theme.spacing(1.5),
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  '& h3': {
    fontSize: '1.3rem',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    fontWeight: 600,
  },
  '& p': {
    marginBottom: theme.spacing(2),
    lineHeight: 1.6,
  },
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  '& code': {
    backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.grey[800], 0.5) : alpha(theme.palette.grey[100], 0.8),
    padding: theme.spacing(0.2, 0.5),
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  '& pre': {
    backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.grey[900], 0.8) : alpha(theme.palette.grey[100], 0.8),
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    overflowX: 'auto',
    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
    },
  },
  '& ul, & ol': {
    paddingLeft: theme.spacing(3),
    marginBottom: theme.spacing(2),
    '& li': {
      marginBottom: theme.spacing(0.5),
    },
  },
  '& blockquote': {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(0.5, 2),
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.primary.main, 0.05),
  },
  '& table': {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: theme.spacing(2),
    '& th, & td': {
      border: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(0.75, 1),
      textAlign: 'left',
    },
    '& th': {
      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.grey[800], 0.5) : alpha(theme.palette.grey[200], 0.7),
    },
  },
})) 