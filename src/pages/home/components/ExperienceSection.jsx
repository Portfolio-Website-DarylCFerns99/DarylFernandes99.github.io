import React from 'react';
import { motion } from 'framer-motion';
import { Box, Card, Typography, Container, Stack, Grid, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import TimelineDescription from '../TimelineDescription';

const ExperienceSection = React.forwardRef(({ combinedTimelineData }, ref) => {
  const theme = useTheme();

  return (
    <Box
      ref={ref}
      id="experience"
      sx={{
        bgcolor: theme.palette.background.default,
        py: { xs: 8, md: 10 },
        borderTop: theme => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
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
            Experience & Education
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              lineHeight: 1.2,
              textTransform: 'uppercase',
            }}
          >
            My{' '}
            <Box component="span" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
              Journey
            </Box>
          </Typography>
        </Box>

        {/* Timeline Stack (Option B) */}
        <Stack
          spacing={5}
          sx={{
            maxWidth: 800,
            mx: 'auto',
            textAlign: 'left',
            position: 'relative',
            pl: { xs: 4, sm: 8 },
            '&::before': {
              content: '""',
              position: 'absolute',
              left: { xs: '17px', sm: '31px' },
              top: '24px',
              bottom: '24px',
              width: '2px',
              background: theme => `linear-gradient(to bottom, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.15)} 100%)`,
            }
          }}
        >
          {combinedTimelineData.map((item, idx) => (
            <Box
              key={item.id || idx}
              sx={{ position: 'relative' }}
            >
              {/* Node icon circle */}
              <Box
                sx={{
                  position: 'absolute',
                  left: { xs: '-32px', sm: '-54px' },
                  top: '20px',
                  width: { xs: 36, sm: 44 },
                  height: { xs: 36, sm: 44 },
                  borderRadius: '50%',
                  backgroundColor: item.type === 'experience'
                    ? 'primary.main'
                    : theme => theme.palette.mode === 'dark' ? '#1e293b' : '#e2e8f0',
                  border: '4px solid',
                  borderColor: theme => theme.palette.background.default,
                  color: item.type === 'experience'
                    ? 'primary.contrastText'
                    : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  boxShadow: theme => theme.palette.mode === 'dark'
                    ? '0 0 15px rgba(245, 158, 11, 0.15)'
                    : '0 0 10px rgba(180, 137, 70, 0.1)',
                }}
              >
                {item.type === 'experience' ? (
                  <WorkIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                ) : (
                  <SchoolIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                )}
              </Box>

              {/* Timeline Card */}
              <Card
                component={motion.div}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                sx={{
                  p: { xs: 3, md: 4 },
                  backgroundColor: alpha(theme.palette.background.paper, 0.4),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#E2E8F0'}`,
                  borderRadius: '8px',
                  boxShadow: 'none',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: theme => theme.palette.mode === 'dark'
                      ? '0 4px 20px rgba(245, 158, 11, 0.08)'
                      : '0 4px 20px rgba(180, 137, 70, 0.03)',
                  }
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      spacing={1}
                      sx={{ mb: 1.5 }}
                    >
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 800,
                          fontSize: '1.2rem',
                          lineHeight: 1.3,
                          color: 'text.primary',
                          mr: { sm: 2 }
                        }}
                      >
                        {item.type === 'experience' ? item.title : item.degree}
                      </Typography>

                      <Box
                        sx={{
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                          borderRadius: '100px',
                          px: 2,
                          py: 0.5,
                          flexShrink: 0,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: `'JetBrains Mono', monospace`,
                            fontWeight: 700,
                            color: 'primary.main',
                            fontSize: '0.75rem',
                          }}
                        >
                          {item.period || item.year}
                        </Typography>
                      </Box>
                    </Stack>

                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        mb: 2.5,
                      }}
                    >
                      {item.type === 'experience' ? item.company : item.institution}
                      {item.location && ` • ${item.location}`}
                    </Typography>

                    <TimelineDescription description={item.description} />
                  </Grid>
                </Grid>
              </Card>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
});

ExperienceSection.displayName = 'ExperienceSection';

export default ExperienceSection;
