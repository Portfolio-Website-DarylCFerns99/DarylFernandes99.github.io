import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Container, Grid, Typography, useTheme } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HubIcon from '@mui/icons-material/Hub';
import CodeIcon from '@mui/icons-material/Code';
import { ServiceCard } from '../styles';


const getServiceIcon = (iconName) => {
  switch (iconName) {
    case "Psychology": return <PsychologyIcon sx={{ fontSize: 24 }} />;
    case "CloudUpload": return <CloudUploadIcon sx={{ fontSize: 24 }} />;
    case "Code": return <CodeIcon sx={{ fontSize: 24 }} />;
    case "Hub": return <HubIcon sx={{ fontSize: 24 }} />;
    default: return <CodeIcon sx={{ fontSize: 24 }} />;
  }
};

const WhatIDoSection = () => {
  const theme = useTheme();
  const services = useSelector((state) => state.user.services || []);

  return (
    <Box sx={{
      bgcolor: theme.palette.background.paper,
      py: { xs: 8, md: 10 },
      borderTop: theme => `1px solid ${theme.palette.divider}`,
    }}>
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
            What I Do
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
            I build systems that{' '}
            <Box component="span" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
              scale
            </Box>{' '}
            and make an{' '}
            <Box component="span" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
              impact
            </Box>
            .
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid item xs={12} sm={6} md={3} key={service.id}>
              <ServiceCard>
                <div className="icon-wrapper">
                  {getServiceIcon(service.iconName)}
                </div>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    mb: 1.5,
                    letterSpacing: '0.05em',
                    fontFamily: `'JetBrains Mono', monospace`,
                  }}
                >
                  {service.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {service.description}
                </Typography>
              </ServiceCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default WhatIDoSection;
