import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { 
	Box, 
	Typography, 
	Grid, 
	useTheme,
	CardContent,
	Button,
	IconButton
} from '@mui/material'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import NorthEastIcon from '@mui/icons-material/NorthEast'
import GitHubIcon from '@mui/icons-material/GitHub'
import { generateSvgArray } from '../../common/common'

// Import styled components from styles file
import {
	ProjectsContainer,
	ProjectCard,
	ProjectImageContainer,
	ProjectImage,
	ProjectTags,
	ProjectTag,
	ProjectType,
	ProjectContent,
	ProjectFooter
} from './styles'

// Dynamic import of all SVG files from the loading folder
const loadingSvgs = import.meta.glob('../../assets/loading/*.svg', { eager: true });

const Index = () => {
	const projects = useSelector((state) => state.user.projects || [])
	const theme = useTheme()
	const [appBarHeight, setAppBarHeight] = useState(64) // Default height

	// Generate SVG array for loading images
	const loadingSvgArray = useMemo(() => generateSvgArray(loadingSvgs), []);
	
	// Helper to get a random SVG from the array
	const getRandomSvg = useCallback(() => {
		const randomIndex = Math.floor(Math.random() * loadingSvgArray.length);
		return loadingSvgArray[randomIndex]?.url || '';
	}, [loadingSvgArray]);

	// Get the appBar height
	useEffect(() => {
		// We need to get the appBar element from the DOM
		const appBarElement = document.querySelector('.MuiAppBar-root')
		if (appBarElement) {
			setAppBarHeight(appBarElement.clientHeight)
		}
		
		// Add listener for window resize
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

	return (
		<ProjectsContainer maxWidth="lg" sx={{ 
			pt: { xs: `calc(${appBarHeight}px + 2rem)`, md: `calc(${appBarHeight / 2}px + 4rem)` }
		}}>
			<Box mb={6} textAlign="center">
				<Typography 
					variant="subtitle1" 
					color="primary" 
					gutterBottom
					sx={{ fontWeight: 500 }}
				>
					MY PORTFOLIO
				</Typography>
				<Typography 
					variant="h3" 
					component="h1" 
					gutterBottom
					sx={{ 
						fontWeight: 700,
						[theme.breakpoints.down('sm')]: {
							fontSize: '2rem',
						}
					}}
				>
					Latest <Box component="span" color="primary.main">Projects</Box>
				</Typography>
				<Typography 
					variant="body1" 
					color="text.secondary"
					sx={{ 
						maxWidth: 700,
						mx: 'auto',
						mb: 2,
						[theme.breakpoints.down('sm')]: {
							fontSize: '0.9rem',
						}
					}}
				>
					Explore my recent work showcasing my skills in software engineering, design, and problem-solving.
				</Typography>
			</Box>

			<Grid container spacing={3}>
				{projects.map((project, index) => (
					<Grid item xs={12} md={6} lg={4} key={index}>
						<ProjectCard sx={{ minHeight: 380, display: 'flex', flexDirection: 'column' }}>
							<Box sx={{ position: 'relative' }}>
								<ProjectImageContainer>
									<ProjectImage
										src={project.image || getRandomSvg()}
										alt={project.title}
										onError={(e) => {
											e.target.src = getRandomSvg();
										}}
									/>
								</ProjectImageContainer>
								
								{project.type && (
									<ProjectType type={project.type}>
										{project.type === 'github' ? (
											<><GitHubIcon fontSize="small" sx={{ fontSize: 16 }} /> GitHub</>
										) : project.type}
									</ProjectType>
								)}
							</Box>
							
							<ProjectContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
								<CardContent sx={{ padding: 0, paddingBottom: '0 !important', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
									<Typography
										gutterBottom
										variant="h6"
										component="h2"
										sx={{ fontWeight: 600 }}
									>
										{project.title}
									</Typography>
									
									<Typography 
										variant="body2" 
										color="text.secondary"
										sx={{ mb: 1.5, flexGrow: 1 }}
									>
										{project.description}
									</Typography>
									
									<ProjectFooter sx={{ mb: 2 }}>
										{project.tags && project.tags.map((tag, i) => (
											<ProjectTag
												key={i}
												label={tag}
												size="small"
												color="primary"
												variant={theme.palette.mode === 'dark' ? 'outlined' : 'filled'}
											/>
										))}
									</ProjectFooter>
									
									{/* Only show button if project has readme_file */}
									{project.additional_data?.readme_file && (
										<Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
											<Button
												component={Link}
												to={`/projects/${project.id}`}
												variant="contained"
												color="primary"
												endIcon={<NorthEastIcon sx={{ fontSize: 16 }} />}
												sx={{
													flexGrow: 1,
													borderRadius: 2,
													textTransform: 'none',
													fontWeight: 500,
													py: 1
												}}
											>
												View Details
											</Button>
											
											{/* GitHub button - only show for GitHub projects with URL */}
											{project.type === 'github' && project.additional_data?.html_url && (
												<IconButton
													color="primary"
													href={project.additional_data.html_url}
													target="_blank"
													rel="noopener noreferrer"
													sx={{
														bgcolor: 'rgba(0, 0, 0, 0.04)',
														'&:hover': {
															bgcolor: 'rgba(0, 0, 0, 0.08)',
														},
														border: `1px solid ${theme.palette.divider}`,
													}}
												>
													<GitHubIcon />
												</IconButton>
											)}
										</Box>
									)}
								</CardContent>
							</ProjectContent>
						</ProjectCard>
					</Grid>
				))}
			</Grid>
		</ProjectsContainer>
	)
}

export default Index
