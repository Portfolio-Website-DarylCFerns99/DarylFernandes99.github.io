import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { 
	Box, 
	Typography, 
	Grid, 
	useTheme,
	CardContent,
	Button,
	IconButton,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	Paper,
	InputAdornment,
	Collapse
} from '@mui/material'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import NorthEastIcon from '@mui/icons-material/NorthEast'
import GitHubIcon from '@mui/icons-material/GitHub'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import ClearIcon from '@mui/icons-material/Clear'
import SortIcon from '@mui/icons-material/Sort'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
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
	
	// Filter states
	const [searchText, setSearchText] = useState('')
	const [selectedType, setSelectedType] = useState('')
	const [selectedTags, setSelectedTags] = useState([])
	const [showFilters, setShowFilters] = useState(false)
	
	// Sort states
	const [sortBy, setSortBy] = useState('')
	const [sortOrder, setSortOrder] = useState('desc') // desc for newest first by default

	// Generate SVG array for loading images
	const loadingSvgArray = useMemo(() => generateSvgArray(loadingSvgs), []);
	
	// Helper to get a random SVG from the array
	const getRandomSvg = useCallback(() => {
		const randomIndex = Math.floor(Math.random() * loadingSvgArray.length);
		return loadingSvgArray[randomIndex]?.url || '';
	}, [loadingSvgArray]);

	// Get unique types and tags from projects
	const { uniqueTypes, uniqueTags } = useMemo(() => {
		const types = new Set()
		const tags = new Set()
		
		projects.forEach(project => {
			if (project.type) types.add(project.type)
			if (project.tags) {
				project.tags.forEach(tag => tags.add(tag))
			}
		})
		
		return {
			uniqueTypes: Array.from(types).sort(),
			uniqueTags: Array.from(tags).sort()
		}
	}, [projects])

	// Filter projects based on current filters
	const filteredProjects = useMemo(() => {
		let filtered = projects.filter(project => {
			// Search text filter
			const matchesSearch = !searchText || 
				project.title?.toLowerCase().includes(searchText.toLowerCase()) ||
				project.description?.toLowerCase().includes(searchText.toLowerCase())
			
			// Type filter
			const matchesType = !selectedType || project.type === selectedType
			
			// Tags filter
			const matchesTags = selectedTags.length === 0 || 
				(project.tags && selectedTags.some(tag => project.tags.includes(tag)))
			
			return matchesSearch && matchesType && matchesTags
		})

		// Apply sorting if sortBy is selected
		if (sortBy) {
			filtered = [...filtered].sort((a, b) => {
				let compareValue = 0
				
				if (sortBy === 'date') {
					const dateA = new Date(a.created_at || 0)
					const dateB = new Date(b.created_at || 0)
					compareValue = dateA - dateB
				} else if (sortBy === 'name') {
					const nameA = (a.title || '').toLowerCase()
					const nameB = (b.title || '').toLowerCase()
					compareValue = nameA.localeCompare(nameB)
				}
				
				return sortOrder === 'asc' ? compareValue : -compareValue
			})
		}

		return filtered
	}, [projects, searchText, selectedType, selectedTags, sortBy, sortOrder])

	// Handle tag selection
	const handleTagToggle = (tag) => {
		setSelectedTags(prev => 
			prev.includes(tag) 
				? prev.filter(t => t !== tag)
				: [...prev, tag]
		)
	}

	// Clear all filters
	const clearAllFilters = () => {
		setSearchText('')
		setSelectedType('')
		setSelectedTags([])
		setSortBy('')
		setSortOrder('desc')
	}

	// Check if any filters are active
	const hasActiveFilters = searchText || selectedType || selectedTags.length > 0 || sortBy

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

			{/* Filter Section */}
			<Box mb={4}>
				{/* Filter Toggle and Search */}
				<Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
					<TextField
						placeholder="Search projects..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						sx={{ flex: 1, minWidth: 300 }}
						size="small"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon color="action" />
								</InputAdornment>
							),
							endAdornment: searchText && (
								<InputAdornment position="end">
									<IconButton
										size="small"
										onClick={() => setSearchText('')}
									>
										<ClearIcon fontSize="small" />
									</IconButton>
								</InputAdornment>
							)
						}}
					/>
					
					<Button
						startIcon={<FilterListIcon />}
						onClick={() => setShowFilters(!showFilters)}
						variant={hasActiveFilters ? "contained" : "outlined"}
						size="small"
						sx={{ 
							minWidth: 120,
							backgroundColor: hasActiveFilters ? theme.palette.primary.main : 'transparent'
						}}
					>
						Filters {hasActiveFilters && `(${(selectedType ? 1 : 0) + selectedTags.length + (searchText ? 1 : 0) + (sortBy ? 1 : 0)})`}
					</Button>

					{hasActiveFilters && (
						<Button
							startIcon={<ClearIcon />}
							onClick={clearAllFilters}
							variant="text"
							size="small"
							color="secondary"
						>
							Clear All
						</Button>
					)}
				</Box>

				{/* Advanced Filters */}
				<Collapse in={showFilters}>
					<Paper 
						elevation={1} 
						sx={{ 
							p: 3, 
							borderRadius: 2, 
							backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' 
						}}
					>
						<Grid container spacing={3}>
							{/* Sort Controls */}
							<Grid item xs={12} md={4}>
								<FormControl fullWidth size="small">
									<InputLabel>Sort By</InputLabel>
									<Select
										value={sortBy}
										label="Sort By"
										onChange={(e) => setSortBy(e.target.value)}
									>
										<MenuItem value="">No Sorting</MenuItem>
										<MenuItem value="date">
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
												<SortIcon fontSize="small" />
												Date Created
											</Box>
										</MenuItem>
										<MenuItem value="name">
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
												<SortIcon fontSize="small" />
												Name
											</Box>
										</MenuItem>
									</Select>
								</FormControl>
							</Grid>

							{/* Sort Order - only show when sorting is selected */}
							{sortBy && (
								<Grid item xs={12} md={4}>
									<FormControl fullWidth size="small">
										<InputLabel>Sort Order</InputLabel>
										<Select
											value={sortOrder}
											label="Sort Order"
											onChange={(e) => setSortOrder(e.target.value)}
										>
											<MenuItem value="asc">
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
													<ArrowUpwardIcon fontSize="small" />
													{sortBy === 'date' ? 'Oldest First' : 'A to Z'}
												</Box>
											</MenuItem>
											<MenuItem value="desc">
												<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
													<ArrowDownwardIcon fontSize="small" />
													{sortBy === 'date' ? 'Newest First' : 'Z to A'}
												</Box>
											</MenuItem>
										</Select>
									</FormControl>
								</Grid>
							)}

							{/* Type Filter */}
							{
								uniqueTypes.length > 1 && (
									<Grid item xs={12} md={sortBy ? 4 : 6}>
										<FormControl fullWidth size="small">
											<InputLabel>Project Type</InputLabel>
											<Select
												value={selectedType}
												label="Project Type"
												onChange={(e) => setSelectedType(e.target.value)}
											>
												<MenuItem value="">All Types</MenuItem>
												{uniqueTypes.map(type => (
													<MenuItem key={type} value={type}>
														<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
															{type === 'github' && <GitHubIcon fontSize="small" />}
															{type.charAt(0).toUpperCase() + type.slice(1)}
														</Box>
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Grid>
								)
							}

							{/* Tags Filter */}
							<Grid item xs={12} md={uniqueTypes.length > 1 ? (sortBy ? 12 : 6) : 12}>
								<Typography variant="subtitle2" gutterBottom color="text.secondary">
									Technologies & Tags
								</Typography>
								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: 120, overflowY: 'auto' }}>
									{uniqueTags.map(tag => (
										<Chip
											key={tag}
											label={tag}
											onClick={() => handleTagToggle(tag)}
											color={selectedTags.includes(tag) ? "primary" : "default"}
											variant={selectedTags.includes(tag) ? "filled" : "outlined"}
											size="small"
											sx={{ 
												cursor: 'pointer',
												'&:hover': {
													backgroundColor: selectedTags.includes(tag) 
														? theme.palette.primary.dark 
														: theme.palette.action.hover
												}
											}}
										/>
									))}
								</Box>
							</Grid>
						</Grid>
					</Paper>
				</Collapse>

				{/* Results Summary */}
				<Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Typography variant="body2" color="text.secondary">
						Showing {filteredProjects.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
					</Typography>
					
					{/* Active Filter Tags */}
					{hasActiveFilters && (
						<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
							{searchText && (
								<Chip 
									label={`Search: "${searchText}"`} 
									size="small" 
									onDelete={() => setSearchText('')}
									color="primary"
									variant="outlined"
								/>
							)}
							{selectedType && (
								<Chip 
									label={`Type: ${selectedType}`} 
									size="small" 
									onDelete={() => setSelectedType('')}
									color="primary"
									variant="outlined"
								/>
							)}
							{sortBy && (
								<Chip 
									label={`Sort: ${sortBy === 'date' ? 'Date' : 'Name'} (${
										sortOrder === 'asc' 
											? (sortBy === 'date' ? 'Oldest First' : 'A-Z')
											: (sortBy === 'date' ? 'Newest First' : 'Z-A')
									})`} 
									size="small" 
									onDelete={() => setSortBy('')}
									color="primary"
									variant="outlined"
								/>
							)}
							{selectedTags.map(tag => (
								<Chip 
									key={tag}
									label={`Tag: ${tag}`} 
									size="small" 
									onDelete={() => handleTagToggle(tag)}
									color="primary"
									variant="outlined"
								/>
							))}
						</Box>
					)}
				</Box>
			</Box>

			<Grid container spacing={3}>
				{filteredProjects.map((project, index) => (
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

			{/* No Results Message */}
			{filteredProjects.length === 0 && (
				<Box 
					sx={{ 
						textAlign: 'center', 
						py: 8,
						opacity: 0.7
					}}
				>
					<Typography variant="h6" gutterBottom>
						No projects found
					</Typography>
					<Typography variant="body2" color="text.secondary" gutterBottom>
						Try adjusting your search criteria or clear the filters to see all projects.
					</Typography>
					{hasActiveFilters && (
						<Button 
							onClick={clearAllFilters}
							variant="outlined"
							sx={{ mt: 2 }}
						>
							Clear All Filters
						</Button>
					)}
				</Box>
			)}
		</ProjectsContainer>
	)
}

export default Index
