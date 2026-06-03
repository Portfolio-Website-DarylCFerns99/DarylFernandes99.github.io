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
    backgroundColor: alpha(theme.palette.background.paper, 0.4),
    backdropFilter: 'blur(10px)',
    border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0',
    boxShadow: 'none',
    padding: theme.spacing(4),
    '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: theme.palette.mode === 'dark'
            ? '0px 4px 20px rgba(245, 158, 11, 0.12)'
            : '0px 4px 20px rgba(180, 137, 70, 0.05)',
    }
}))

export const ProjectIconContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: '8px',
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(3),
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
    // objectFit: 'contain',
    objectFit: 'fill',
    transition: 'transform 0.5s ease',
}))

export const ProjectTags = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(1),
}))

export const ProjectTag = styled(Box)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.text.primary, 0.03),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '4px',
    padding: theme.spacing(0.5, 1.2),
    fontSize: '0.7rem',
    fontWeight: 500,
    color: theme.palette.text.secondary,
    fontFamily: `'JetBrains Mono', monospace`,
    transition: 'all 0.2s ease',
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
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
}))

export const ProjectFooter = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: 'auto',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(0.5),
    color: theme.palette.primary.main,
    fontSize: '0.8rem',
    fontWeight: 500,
}))

export const LayoutWrapper = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing(4),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: '300px 1fr',
    },
}))

export const SidebarWrapper = styled(Box)(({ theme }) => ({
    display: 'none',
    [theme.breakpoints.up('md')]: {
        display: 'block',
        position: 'sticky',
        top: 100,
        height: 'fit-content',
    },
}))

export const ProjectsColumn = styled(Box)(() => ({
    minWidth: 0,
}))

export const FilterCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: alpha(theme.palette.background.paper, 0.4),
    backdropFilter: 'blur(10px)',
    border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0',
})) 
