import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, alpha, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { ProjectCard, ProjectImageWrapper, ProjectTags, ProjectTag, responsiveStyles } from './styles';
import { slugify } from '../../utils/stringUtils';

const ProjectCardItem = memo(({ project, fallbackImage, getRandomSvg }) => {
    const theme = useTheme();

    return (
        <Box
            component={motion.div}
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
            sx={{
                flex: '0 0 auto',
                width: { xs: '300px', md: '350px' },
                minWidth: { xs: '300px', md: '350px' },
                height: '100%',
            }}
        >
            <ProjectCard sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 380 }}>
                <ProjectImageWrapper sx={{ height: '180px', flexShrink: 0 }}>
                    <img
                        src={project.image || fallbackImage || ''}
                        alt={project.title}
                        onError={(e) => {
                            if (!e.target.dataset.usingFallback) {
                                e.target.dataset.usingFallback = 'true';
                                e.target.src = fallbackImage || getRandomSvg();
                            }
                        }}
                    />
                    <ProjectTags>
                        {project.tags && project.tags.map((tag, idx) => (
                            <ProjectTag key={idx}>{tag}</ProjectTag>
                        ))}
                    </ProjectTags>
                </ProjectImageWrapper>
                <Box
                    sx={{
                        pb: 2,
                        px: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        backgroundColor: alpha(theme.palette.background.paper, 0.4),
                        backdropFilter: 'blur(4px)',
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                            ...responsiveStyles.projectTitle,
                            fontWeight: 600,
                            mb: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textAlign: 'left'
                        }}
                    >
                        {project.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            ...responsiveStyles.projectDescription,
                            display: '-webkit-box',
                            WebkitLineClamp: -1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: '1.5em',
                            mb: 1.5,
                            flexGrow: 1,
                            textAlign: 'left'
                        }}
                    >
                        {project.description}
                    </Typography>

                    <Box
                        component={Link}
                        to={"/projects/" + slugify(project?.title)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            marginTop: 'auto',
                            paddingTop: theme.spacing(1),
                            color: theme.palette.primary.main,
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            textDecoration: 'none',
                            '&:hover': {
                                color: theme.palette.primary.dark,
                            }
                        }}
                    >
                        View Details <NorthEastIcon sx={{ ml: 0.5, fontSize: 16 }} />
                    </Box>
                </Box>
            </ProjectCard>
        </Box>
    );
});

export default ProjectCardItem;
