import React, { useEffect, useState, useCallback } from 'react'
import { 
  Typography, 
  Box, 
  useTheme,
  useMediaQuery,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import GitHubIcon from '@mui/icons-material/GitHub'
import LaunchIcon from '@mui/icons-material/Launch'
import StarIcon from '@mui/icons-material/Star'
import ForkRightIcon from '@mui/icons-material/ForkRight'
import CodeIcon from '@mui/icons-material/Code'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import UpdateIcon from '@mui/icons-material/Update'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { generateSvgArray } from '../../common/common'

// Import styled components
import {
  DetailContainer,
  ProjectHeader,
  ProjectBanner,
  BannerImage,
  ProjectContent,
  ProjectInfoSection,
  ProjectTag,
  BackButton,
  ReadmeContent,
  InfoItem
} from './styles'

// Dynamic import of all SVG files from the loading folder
const loadingSvgs = import.meta.glob('../../assets/loading/*.svg', { eager: true });

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [appBarHeight, setAppBarHeight] = useState(64) // Default height
  const [loadingImage, setLoadingImage] = useState(false)
  
  // Get all projects
  const projects = useSelector((state) => state.user.projects || [])
  
  // Compute the actual index (params id is 1-based, array is 0-based)
  const projectIndex = parseInt(id) - 1
  
  // Helper for random SVG
  const loadingSvgArray = React.useMemo(() => generateSvgArray(loadingSvgs), []);
  const getRandomSvg = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * loadingSvgArray.length);
    return loadingSvgArray[randomIndex]?.url || '';
  }, [loadingSvgArray]);
  
  // Get the appBar height
  useEffect(() => {
    const appBarElement = document.querySelector('.MuiAppBar-root')
    if (appBarElement) {
      setAppBarHeight(appBarElement.clientHeight)
    }
    
    const handleResize = () => {
      if (appBarElement) {
        setAppBarHeight(appBarElement.clientHeight)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  // Redirect if invalid project index or project has no readme
  useEffect(() => {
    if (
      projectIndex < 0 || 
      projectIndex >= projects.length || 
      !projects[projectIndex]?.additional_data?.readme_file
    ) {
      navigate('/projects')
    }
  }, [projectIndex, projects, navigate])
  
  // If still validating or redirecting, show loading
  if (
    projectIndex < 0 || 
    projectIndex >= projects.length || 
    !projects[projectIndex]
  ) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }
  
  // Get current project and its data
  const project = projects[projectIndex]
  const additionalData = project.additional_data || {}
  
  // Handle image error
  const handleImageError = (e) => {
    setLoadingImage(true)
    e.target.src = getRandomSvg()
  }
  
  // Get readme content from the project or additional data
  const readmeContent = project.readme_file || additionalData.readme_file
  
  // Determine if project is GitHub type
  const isGithubProject = project.type === 'github'
  
  return (
    <DetailContainer maxWidth="lg" sx={{ 
      pt: { xs: `calc(${appBarHeight}px + 1rem)`, md: `calc(${appBarHeight / 2}px + 3rem)` }
    }}>
      <BackButton 
        component={Link} 
        to="/projects" 
        startIcon={<ArrowBackIcon />}
        variant="text"
        color="primary"
      >
        Back to All Projects
      </BackButton>
      
      <ProjectHeader>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            [theme.breakpoints.down('sm')]: {
              fontSize: '1.75rem',
            }
          }}
        >
          {project.title}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {project.tags && project.tags.map((tag, i) => (
            <ProjectTag key={i}>{tag}</ProjectTag>
          ))}
        </Box>
        
        {/* Project Info Cards - Only shown for GitHub projects */}
        {isGithubProject && (
          <ProjectInfoSection sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: 3,
            padding: 2,
            flexWrap: 'wrap',
            borderRadius: '8px',
            background: theme => theme.palette.background.paper,
            boxShadow: theme => theme.shadows[1],
            width: 'fit-content',
            margin: '0 auto'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon color="primary" fontSize="small" />
              <Typography variant="body2" fontWeight={500}>
                {additionalData.stargazers_count || 0} Stars
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ForkRightIcon color="primary" fontSize="small" />
              <Typography variant="body2" fontWeight={500}>
                {additionalData.forks_count || 0} Forks
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CodeIcon color="primary" fontSize="small" />
              <Typography variant="body2" fontWeight={500}>
                {additionalData.language || 'N/A'}
              </Typography>
            </Box>
          </ProjectInfoSection>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
          {isGithubProject && additionalData.html_url && (
            <Tooltip title="View on GitHub">
              <IconButton 
                color="primary" 
                href={additionalData.html_url} 
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {project.demo_url && (
            <Tooltip title="View Demo">
              <IconButton 
                color="primary" 
                href={project.demo_url} 
                target="_blank"
                rel="noopener noreferrer"
              >
                <LaunchIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </ProjectHeader>
      
      {/* <ProjectBanner>
        <BannerImage
          src={project.image}
          alt={project.title}
          onError={handleImageError}
        />
      </ProjectBanner> */}
      
      <ProjectContent>
        {/* README Section */}
        {readmeContent ? (
          <Box>
            {!readmeContent.startsWith('# ') && (
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  mb: 3
                }}
              >
                {project.title}
              </Typography>
            )}
            <ReadmeContent>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {readmeContent}
              </ReactMarkdown>
            </ReadmeContent>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No README file available for this project.
            </Typography>
          </Box>
        )}
      </ProjectContent>
    </DetailContainer>
  )
}

export default ProjectDetail 