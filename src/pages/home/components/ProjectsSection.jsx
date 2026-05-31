import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Card, Typography, Container, Grid, Button, Stack, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CodeIcon from '@mui/icons-material/Code';
import HubIcon from '@mui/icons-material/Hub';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { slugify } from '../../../utils/stringUtils';

const getProjectIcon = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("ai") || text.includes("gpt") || text.includes("ml") || text.includes("model") || text.includes("segmentation") || text.includes("nlp") || text.includes("deep learning")) {
    return <PsychologyIcon sx={{ fontSize: 22 }} />;
  }
  if (text.includes("cloud") || text.includes("terraform") || text.includes("infrastructure") || text.includes("devops") || text.includes("gcp") || text.includes("aws") || text.includes("docker")) {
    return <CloudUploadIcon sx={{ fontSize: 22 }} />;
  }
  if (text.includes("backend") || text.includes("transaction") || text.includes("go") || text.includes("grpc") || text.includes("redis") || text.includes("database")) {
    return <HubIcon sx={{ fontSize: 22 }} />;
  }
  return <CodeIcon sx={{ fontSize: 22 }} />;
};

const ProjectsSection = React.forwardRef(({ featuredProjects }, ref) => {
  const theme = useTheme();

  return (
    <Box
      ref={ref}
      id="projects"
      sx={{
        bgcolor: theme.palette.background.default,
        py: { xs: 8, md: 10 },
        borderTop: theme => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          mb: 6,
        }}>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: '0.8rem',
                color: 'text.secondary',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: `'JetBrains Mono', monospace`,
                mb: 1.5,
                textAlign: 'left',
              }}
            >
              Featured Projects
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                lineHeight: 1.2,
                textAlign: 'left',
                textTransform: 'uppercase',
              }}
            >
              A selection of{' '}
              <Box component="span" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
                things
              </Box>{' '}
              I've built.
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/projects"
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            sx={{
              fontWeight: 600,
              fontSize: '0.9rem',
              textTransform: 'none',
              pb: 0.5,
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'primary.dark',
              }
            }}
          >
            View All Projects
          </Button>
        </Box>

        {/* 2x2 Grid of Projects */}
        <Grid container spacing={3}>
          {featuredProjects.map((project, idx) => (
            <Grid item xs={12} md={6} key={project.id || idx}>
              <Card
                component={motion.div}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300 }}
                sx={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.4),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#E2E8F0'}`,
                  borderRadius: theme => theme.shape.borderRadius * 2,
                  boxShadow: 'none',
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: theme => theme.palette.mode === 'dark'
                      ? '0px 4px 20px rgba(245, 158, 11, 0.12)'
                      : '0px 4px 20px rgba(180, 137, 70, 0.05)',
                  }
                }}
              >
                <Box>
                  {/* Project top icon */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '8px',
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                    mb: 3,
                  }}>
                    {getProjectIcon(project.title, project.description)}
                  </Box>

                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.25rem',
                      textAlign: 'left',
                      mb: 0.5,
                    }}
                  >
                    {project.title}
                  </Typography>

                  {/* Subtitle / Category */}
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: 'primary.main',
                      fontFamily: `'JetBrains Mono', monospace`,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      mb: 2,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {project.category || project.project_category_name || "Engineering Project"}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      mb: 3,
                      textAlign: 'left',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {project.description}
                  </Typography>
                </Box>

                <Box>
                  {/* Tech Chips */}
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                    sx={{ mb: 3, justifyContent: 'flex-start' }}
                  >
                    {project.tags && project.tags.map((tag, tagIdx) => (
                      <Box
                        key={tagIdx}
                        sx={{
                          backgroundColor: alpha(theme.palette.text.primary, 0.03),
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: '4px',
                          px: 1.2,
                          py: 0.5,
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          color: 'text.secondary',
                          fontFamily: `'JetBrains Mono', monospace`,
                        }}
                      >
                        {tag}
                      </Box>
                    ))}
                  </Stack>

                  <Box
                    component={Link}
                    to={"/projects/" + slugify(project?.title)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      color: 'primary.main',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.dark',
                      }
                    }}
                  >
                    View Details <NorthEastIcon sx={{ ml: 0.5, fontSize: 16 }} />
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
});

ProjectsSection.displayName = 'ProjectsSection';

export default ProjectsSection;
