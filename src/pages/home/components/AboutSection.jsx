import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Grid, Typography, useTheme } from '@mui/material';

const AboutSection = ({ userData }) => {
  const theme = useTheme();

  return (
    <Box
      id="about"
      sx={{
        bgcolor: theme.palette.background.default,
        py: { xs: 8, md: 10 },
        borderTop: theme => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left Column: Image */}
          <Grid item xs={12} md={5}
            component={motion.div}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{
              width: '100%',
              borderRadius: '8px',
              overflow: 'hidden',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#E2E8F0'}`,
              boxShadow: theme.shadows[4],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& img': {
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'cover'
              }
            }}>
              <img src={userData.about?.image || userData.avatar} alt="About Me" />
            </Box>
          </Grid>

          {/* Right Column: Bio Content & Stats */}
          <Grid item xs={12} md={7}
            component={motion.div}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{ textAlign: 'left' }}
          >
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
              }}
            >
              About Me
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                lineHeight: 1.2,
                mb: 3,
                textTransform: 'uppercase',
              }}
            >
              My name is{' '}
              <Box component="span" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
                {userData.name}
              </Box>{' '}
              and I'm a{' '}
              <Box component="span" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
                {userData.title}
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.95rem', md: '1rem' },
                lineHeight: 1.7,
                mb: 4,
              }}
            >
              {userData.about?.description || "I'm a Software Engineer passionate about building impactful products. I love working at the intersection of AI, backend systems and cloud infrastructure."}
            </Typography>

            {/* Stats Block */}
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ borderLeft: '2px solid', borderColor: 'primary.main', pl: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, fontSize: '1.5rem', lineHeight: 1.1 }}>
                    {userData.heroStats?.experience || "2+ Years"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>Years of Experience</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ borderLeft: '2px solid', borderColor: 'primary.main', pl: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, fontSize: '1.5rem', lineHeight: 1.1 }}>
                    {userData.projects?.length || "21"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>Projects Built</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;
