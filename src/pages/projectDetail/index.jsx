import React, { useEffect, useState, useCallback, Fragment } from 'react'
import {
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  IconButton,
  Tooltip,
  Button,
  Divider,
  Avatar,
  Chip,
  alpha
} from '@mui/material'
import { useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import GitHubIcon from '@mui/icons-material/GitHub'
import LaunchIcon from '@mui/icons-material/Launch'
import StarIcon from '@mui/icons-material/Star'
import ForkRightIcon from '@mui/icons-material/ForkRight'
import CodeIcon from '@mui/icons-material/Code'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import UpdateIcon from '@mui/icons-material/Update'
import LanguageIcon from '@mui/icons-material/Language'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { generateSvgArray } from '../../common/common'

// Import styled components
import {
  DetailContainer,
  HeroSection,
  HeroBackground,
  HeroContent,
  PageLayout,
  MainColumn,
  SidebarColumn,
  GlassCard,
  ProjectTag,
  BackButton,
  ReadmeContent,
  SidebarSection,
  SectionTitle
} from './styles'
import { DynamicSEO } from '../../components/SEO/DynamicSEO'
import { slugify } from '../../utils/stringUtils'

// Dynamic import of all SVG files from the loading folder
const loadingSvgs = import.meta.glob('../../assets/loading/*.svg', { eager: true });

// Helper to generate a consistent color from a string
const getLanguageColor = (str) => {
  if (!str) return '#cccccc';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

const ProjectDetail = () => {
  const { name } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [appBarHeight, setAppBarHeight] = useState(64) // Default height
  const [loadingImage, setLoadingImage] = useState(false)

  // Get all projects
  const projects = useSelector((state) => state.user.projects || [])

  // Find the project by its name/slug instead of ID
  const project = projects.find(proj => slugify(proj.title) === name)

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

  // Redirect if project not found or project has no readme
  useEffect(() => {
    if (!project || !project.additional_data?.readme_file) {
      // navigate('/projects')
    }
  }, [project, navigate])

  // If project not found, show loading
  if (!project) {
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

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Fragment>
      <DynamicSEO
        title={project?.title}
        description={project?.description}
        keywords={project?.tags?.join(', ')}
        type="article"
      />
      <DetailContainer maxWidth="lg" sx={{
        pt: { xs: '1rem', md: `calc(${appBarHeight / 2}px + 3rem)` }
      }}>
        <BackButton
          component={Link}
          to="/projects"
          startIcon={<ArrowBackIcon />}
          variant="text"
        >
          Back to Projects
        </BackButton>

        {/* Hero Section */}
        <HeroSection component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <HeroBackground image={project.image || getRandomSvg()} />
          <HeroContent>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                color: '#fff',
                textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '2.5rem',
                }
              }}
            >
              {project.title}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              {project.description}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              {isGithubProject && additionalData.html_url && (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<GitHubIcon />}
                  href={additionalData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ borderRadius: '50px', px: 4, py: 1.5, fontWeight: 600 }}
                >
                  View on GitHub
                </Button>
              )}
              {project.demo_url && (
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<LaunchIcon />}
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ borderRadius: '50px', px: 4, py: 1.5, fontWeight: 600 }}
                >
                  Live Demo
                </Button>
              )}
            </Box>
          </HeroContent>
        </HeroSection>

        <PageLayout>
          {/* Main Content Column */}
          <MainColumn component={motion.div} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <GlassCard elevation={0}>
              {readmeContent ? (
                <ReadmeContent>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {readmeContent}
                  </ReactMarkdown>
                </ReadmeContent>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    No detailed documentation available for this project.
                  </Typography>
                </Box>
              )}
            </GlassCard>
          </MainColumn>

          {/* Sidebar Column */}
          <SidebarColumn component={motion.div} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            {/* Project Stats */}
            {isGithubProject && (
              <GlassCard sx={{ mb: 3 }}>
                <SidebarSection>
                  <SectionTitle>
                    <GitHubIcon fontSize="small" /> Repository Stats
                  </SectionTitle>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                      <StarIcon color="warning" sx={{ mb: 0.5 }} />
                      <Typography variant="h6" fontWeight={700}>{additionalData.stargazers_count || 0}</Typography>
                      <Typography variant="caption" color="text.secondary">Stars</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                      <ForkRightIcon color="info" sx={{ mb: 0.5 }} />
                      <Typography variant="h6" fontWeight={700}>{additionalData.forks_count || 0}</Typography>
                      <Typography variant="caption" color="text.secondary">Forks</Typography>
                    </Box>
                  </Box>
                </SidebarSection>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <CalendarTodayIcon fontSize="small" />
                      <Typography variant="body2">Created</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={500}>
                      {formatDate(isGithubProject ? additionalData.created_at : project.created_at)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <UpdateIcon fontSize="small" />
                      <Typography variant="body2">Updated</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={500}>
                      {formatDate(isGithubProject ? additionalData.updated_at : project.updated_at)}
                    </Typography>
                  </Box>
                </Box>
              </GlassCard>
            )}

            {/* Tech Stack */}
            <GlassCard sx={{ mb: 3 }}>
              <SidebarSection>
                <SectionTitle>
                  <CodeIcon fontSize="small" /> Tags
                </SectionTitle>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {project.tags && project.tags.map((tag, i) => (
                    <ProjectTag key={i}>{tag}</ProjectTag>
                  ))}
                </Box>
              </SidebarSection>

              {additionalData.languages && Object.keys(additionalData.languages).length > 0 && (() => {
                const languages = additionalData.languages;
                const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
                const languageStats = Object.entries(languages)
                  .map(([lang, bytes]) => ({
                    lang,
                    bytes,
                    percent: (bytes / totalBytes) * 100
                  }))
                  .sort((a, b) => b.bytes - a.bytes);

                return (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <SidebarSection>
                      <SectionTitle>
                        <LanguageIcon fontSize="small" /> Languages
                      </SectionTitle>

                      {/* Language Bar */}
                      <Box sx={{
                        display: 'flex',
                        height: 8,
                        borderRadius: 4,
                        overflow: 'hidden',
                        mb: 1.5,
                        bgcolor: (theme) => alpha(theme.palette.text.primary, 0.1)
                      }}>
                        {languageStats.map((stat) => (
                          <Box
                            key={stat.lang}
                            sx={{
                              width: `${stat.percent}%`,
                              bgcolor: getLanguageColor(stat.lang),
                              height: '100%'
                            }}
                          />
                        ))}
                      </Box>

                      {/* Language List with Percentages */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {languageStats.map((stat) => (
                          <Box
                            key={stat.lang}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5
                            }}
                          >
                            <Box sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: getLanguageColor(stat.lang)
                            }} />
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                fontWeight: 500
                              }}
                            >
                              {stat.lang}
                              <Box component="span" sx={{ opacity: 0.7, ml: 0.5 }}>
                                {stat.percent.toFixed(1)}%
                              </Box>
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </SidebarSection>
                  </>
                );
              })()}
            </GlassCard>

            {/* Links */}
            <GlassCard>
              <SidebarSection>
                <SectionTitle>
                  <LaunchIcon fontSize="small" /> Links
                </SectionTitle>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {isGithubProject && additionalData.html_url && (
                    <Button
                      variant="outlined"
                      startIcon={<GitHubIcon />}
                      href={additionalData.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      fullWidth
                      sx={{ justifyContent: 'flex-start', borderRadius: '10px' }}
                    >
                      View Repository
                    </Button>
                  )}
                  {project.demo_url && (
                    <Button
                      variant="outlined"
                      startIcon={<LaunchIcon />}
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      fullWidth
                      sx={{ justifyContent: 'flex-start', borderRadius: '10px' }}
                    >
                      View Live Demo
                    </Button>
                  )}
                </Box>
              </SidebarSection>
            </GlassCard>

          </SidebarColumn>
        </PageLayout>
      </DetailContainer>
    </Fragment>
  )
}

export default ProjectDetail 
