import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Container, useTheme } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import { TechGridContainer, TechItem } from '../styles';
import { getDeviconUrl } from '../../../utils/deviconUtils';

const TechnologiesSection = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const featuredSkills = useSelector((state) => state.user.featuredSkills || []);

  return (
    <Box
      ref={ref}
      id="skills"
      sx={{
        bgcolor: theme.palette.background.paper,
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
            Technologies
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
            Technologies I{' '}
            <Box component="span" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
              work
            </Box>{' '}
            with
          </Typography>
        </Box>

        <TechGridContainer>
          {featuredSkills.map((skill, index) => {
            const logo = getDeviconUrl(skill.icon);
            return (
              <TechItem key={skill.id || index}>
                {logo ? (
                  <img src={logo} alt={skill.name} />
                ) : (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    <CodeIcon sx={{ fontSize: 32 }} />
                  </Box>
                )}
                <Typography className="tech-label">{skill.name}</Typography>
              </TechItem>
            );
          })}
        </TechGridContainer>
      </Container>
    </Box>
  );
});

TechnologiesSection.displayName = 'TechnologiesSection';

export default TechnologiesSection;
