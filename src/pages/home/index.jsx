import React, { useRef, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Container,
  Stack,
  Grid,
  useTheme,
  Button
} from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useSelector } from 'react-redux'

import { DynamicSEO } from '../../components/SEO/DynamicSEO'
import { HeroScrollIndicator } from './styles'

// Import extracted subcomponents
import AboutSection from './components/AboutSection';
import WhatIDoSection from './components/WhatIDoSection';
import ProjectsSection from './components/ProjectsSection';
import TechnologiesSection from './components/TechnologiesSection';
import ExperienceSection from './components/ExperienceSection';

const Index = () => {
  const userData = useSelector((state) => state.user);
  const theme = useTheme();

  const projectsSectionRef = useRef(null);
  const skillsSectionRef = useRef(null);
  const experienceSectionRef = useRef(null);

  // Resume link lookup
  const resumeLink = useMemo(() => {
    return userData.socialLinks?.find(
      link => link.platform === 'document' || link.url?.includes('resume') || link.tooltip?.toLowerCase().includes('resume')
    );
  }, [userData.socialLinks]);

  // Featured Projects list
  const featuredProjects = useMemo(() => {
    const featured = userData.projects?.filter(p => p.is_featured) || [];
    if (featured.length === 0) {
      return userData.projects?.slice(0, 4) || [];
    }
    return featured;
  }, [userData.projects]);

  // Combined timeline data (experience & education)
  const combinedTimelineData = useMemo(() => {
    return [...(userData.timelineData || [])]
      .filter(item => item.type === 'experience' || item.type === 'education')
      .sort((a, b) => b.year - a.year);
  }, [userData.timelineData]);

  // Set window title
  useEffect(() => {
    if (userData.name && userData.surname) {
      window.document.title = `${userData.name} ${userData.surname}`;
    }
  }, [userData.name, userData.surname]);

  const handleSocialLinkClick = (social) => {
    if (social.platform === 'document' && social.url?.startsWith('data:')) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <iframe 
            src="${social.url}" 
            style="width:100%; height:100vh; border:none; margin:0; padding:0; display:block;"
            title="${social.tooltip || social.fileName || 'Document'}"
          ></iframe>
          <style>body { margin: 0; overflow: hidden; }</style>
        `);
        newWindow.document.title = social.tooltip || social.fileName || 'Document';
        newWindow.document.close();
      }
    } else {
      window.open(social.url, '_blank', 'noopener,noreferrer');
    }
  };

  const scrollToProjects = () => {
    projectsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <DynamicSEO title="Home" />

      {/* Hero Section */}
      <Box
        id="top"
        sx={(theme) => ({
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 'auto', md: 'calc(100vh - 64px)' },
          display: 'flex',
          alignItems: 'center',
          pt: { xs: 12, md: 8 },
          pb: { xs: 8, md: 8 },
          backgroundImage: {
            xs: theme.palette.mode === 'dark'
              ? `linear-gradient(rgba(11, 15, 16, 0.88), rgba(11, 15, 16, 0.88)), url(${userData.avatar || ''})`
              : `linear-gradient(rgba(248, 249, 255, 0.9), rgba(248, 249, 255, 0.9)), url(${userData.avatar || ''})`,
            md: theme.palette.mode === 'dark'
              ? `linear-gradient(to right, rgba(11, 15, 16, 0.96) 25%, rgba(11, 15, 16, 0.75) 55%, rgba(11, 15, 16, 0.2) 100%), url(${userData.avatar || ''})`
              : `linear-gradient(to right, rgba(248, 249, 255, 0.95) 25%, rgba(248, 249, 255, 0.3) 55%, rgba(248, 249, 255, 0) 100%), url(${userData.avatar || ''})`
          },
          backgroundSize: 'cover',
          backgroundPosition: { xs: '50% center', md: 'right center' },
          backgroundRepeat: 'no-repeat',
        })}
      >
        {/* Left vertical scroll bar */}
        <HeroScrollIndicator>
          <span className="scroll-text">Scroll</span>
          <div className="scroll-line" />
        </HeroScrollIndicator>

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left Content Column */}
            <Grid item xs={12} md={7}
              component={motion.div}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  mb: 1.5,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  fontFamily: `'JetBrains Mono', monospace`,
                  textAlign: 'left'
                }}
              >
                Builder. Engineer. Problem Solver.
              </Typography>

              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  lineHeight: 1.1,
                  mb: 2,
                  textAlign: 'left',
                  textTransform: 'uppercase',
                }}
              >
                {userData.name}{' '}
                <Box
                  component="span"
                  sx={{
                    color: 'primary.main',
                    fontStyle: 'italic',
                    fontWeight: 700,
                  }}
                >
                  {userData.surname}
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  lineHeight: 1.6,
                  mb: 4,
                  maxWidth: 480,
                  textAlign: 'left',
                }}
              >
                {userData.about?.shortdescription || "Software Engineer building AI-powered, cloud-native systems that solve real-world problems."}
              </Typography>

              {/* Action Buttons */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="flex-start"
                alignItems="stretch"
                sx={{ mb: 4 }}
              >
                <Button
                  onClick={scrollToProjects}
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 3.5,
                    py: 1.5,
                    fontSize: '0.9rem',
                  }}
                >
                  View Projects
                </Button>
                {resumeLink && (
                  <Button
                    onClick={() => handleSocialLinkClick(resumeLink)}
                    variant="outlined"
                    color="primary"
                    endIcon={<DescriptionIcon />}
                    sx={{
                      px: 3.5,
                      py: 1.5,
                      fontSize: '0.9rem',
                    }}
                  >
                    Download Resume
                  </Button>
                )}
                <Button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="text"
                  color="primary"
                  endIcon={<EmailIcon />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    fontSize: '0.9rem',
                    border: '1px solid transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(180, 137, 70, 0.05)',
                    }
                  }}
                >
                  Contact Me
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* About Me Section */}
      <AboutSection userData={userData} />

      {/* What I Do Section */}
      <WhatIDoSection />

      {/* Featured Projects Section */}
      <ProjectsSection ref={projectsSectionRef} featuredProjects={featuredProjects} />

      {/* Technologies Section */}
      <TechnologiesSection ref={skillsSectionRef} />

      {/* Experience & Education Section */}
      <ExperienceSection ref={experienceSectionRef} combinedTimelineData={combinedTimelineData} />
    </>
  );
};

export default Index;
