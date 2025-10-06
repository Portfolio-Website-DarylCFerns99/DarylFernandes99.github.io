import React, { useEffect, useMemo, useCallback, useState, Fragment } from 'react'
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
	Collapse,
	Menu,
	Divider
} from '@mui/material'
import { alpha } from '@mui/material/styles'
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
import { DynamicSEO } from '../../components/SEO/DynamicSEO'

// Dynamic import of all SVG files from the loading folder
const loadingSvgs = import.meta.glob('../../assets/loading/*.svg', { eager: true });

const Index = () => {
	const projects = useSelector((state) => state.user.projects || [])
	const projectCategories = useSelector((state) => state.user.projectCategories || [])
	const theme = useTheme()
	const [appBarHeight, setAppBarHeight] = useState(64) // Default height
	
	// Category filter state
	const [selectedCategoryId, setSelectedCategoryId] = useState('all') // defaults to all projects
	
	// Filter states
	const [searchText, setSearchText] = useState('')
	const [selectedType, setSelectedType] = useState('')
	const [selectedTags, setSelectedTags] = useState([])
	const [showFilters, setShowFilters] = useState(false)
	
	// Sort states
	const [sortBy, setSortBy] = useState('date') // Default to date sorting
	const [sortOrder, setSortOrder] = useState('desc') // desc for newest first by default
	const [sortMenuAnchor, setSortMenuAnchor] = useState(null)

	// Generate SVG array for loading images
	const loadingSvgArray = useMemo(() => generateSvgArray(loadingSvgs), []);
	
	// Helper to get a random SVG from the array
	const getRandomSvg = useCallback(() => {
		const randomIndex = Math.floor(Math.random() * loadingSvgArray.length);
		return loadingSvgArray[randomIndex]?.url || '';
	}, [loadingSvgArray]);

	// Build category tabs with "All Projects" option
	const categoryTabs = useMemo(() => {
		const allTab = { id: 'all', name: 'All Projects' };
		const categoryTabs = projectCategories.map(c => ({ id: c.id, name: c.name }));
		return [allTab, ...categoryTabs];
	}, [projectCategories]);

	// First filter by category
	const categoryFilteredProjects = useMemo(() => {
		// If "all" is selected or no category is selected, return all projects
		if (selectedCategoryId === 'all') {
			return projects;
		}
		return projects.filter(project => project.project_category_id === selectedCategoryId);
	}, [projects, selectedCategoryId]);

	// Get unique types and tags from category-filtered projects
	const { uniqueTypes, uniqueTags } = useMemo(() => {
		const types = new Set()
		const tags = new Set()
		
		categoryFilteredProjects.forEach(project => {
			if (project.type) types.add(project.type)
			if (project.tags) {
				project.tags.forEach(tag => tags.add(tag))
			}
		})
		
		return {
			uniqueTypes: Array.from(types).sort(),
			uniqueTags: Array.from(tags).sort()
		}
	}, [categoryFilteredProjects]);

	// Then apply filter panel filters on top of category-filtered projects
	const filteredProjects = useMemo(() => {
		let filtered = categoryFilteredProjects.filter(project => {
			// Search text filter
			const matchesSearch = !searchText || 
				project.title?.toLowerCase().includes(searchText.toLowerCase()) ||
				project.description?.toLowerCase().includes(searchText.toLowerCase()) ||
				project.tags?.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
			
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
	}, [categoryFilteredProjects, searchText, selectedType, selectedTags, sortBy, sortOrder])

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
		setSortBy('date') // Reset to default date sorting
		setSortOrder('desc') // Reset to default descending order
		// Reset category to all
		setSelectedCategoryId('all');
	}

	// Check if any filters are active (excluding category and sort)
	const hasActiveFilters = searchText || selectedType || selectedTags.length > 0

	// Handle sort menu
	const handleSortMenuOpen = (event) => {
		setSortMenuAnchor(event.currentTarget)
	}

	const handleSortMenuClose = () => {
		setSortMenuAnchor(null)
	}

	const handleSortFieldChange = (sortField) => {
		setSortBy(sortField)
	}

	const handleSortOrderChange = (order) => {
		setSortOrder(order)
	}

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
		<Fragment>
			<DynamicSEO
				title="Projects"
				description={`Browse ${projects.length} projects`}
			/>
			<ProjectsContainer maxWidth="lg" sx={{ 
				pt: { xs: '2rem', md: `calc(${appBarHeight / 2}px + 4rem)` } // Less padding on mobile since no header
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

					{/* Category Pill Tabs */}
					{categoryTabs.length > 0 && (
						<Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, mt: 2 }}>
							<Box sx={{
								display: 'flex',
								flexWrap: 'wrap',
								gap: 1,
								justifyContent: 'center'
							}}>
								{categoryTabs.map(tab => {
									const isActive = selectedCategoryId === tab.id;
									return (
										<Button
											key={tab.id}
											onClick={() => setSelectedCategoryId(tab.id)}
											size="small"
											sx={{
												textTransform: 'none',
												fontWeight: 500,
												borderRadius: '999px',
												border: `1px solid ${isActive ? theme.palette.primary.main : theme.palette.divider}`,
												minHeight: 32,
												px: 1.75,
												py: 0.5,
												color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
												backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
												'&:hover': {
													backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.18) : theme.palette.action.hover
												}
											}}
											variant="outlined"
										>
											{tab.name}
										</Button>
									);
								})}
							</Box>
						</Box>
					)}

					{/* Filter Toggle and Search */}
					<Box sx={{ 
						display: 'flex', 
						flexDirection: { xs: 'column', sm: 'row' },
						gap: 2, 
						mb: 2, 
						alignItems: 'stretch'
					}}>
						<TextField
							placeholder="Search projects..."
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							sx={{ 
								flex: { xs: 'none', sm: 1 },
								width: { xs: '100%', sm: 'auto' },
								minWidth: { sm: 300 }
							}}
							size="medium"
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

						{/* Sort and Filter Controls Row */}
						<Box sx={{ 
							display: 'flex', 
							gap: 2, 
							alignItems: 'stretch'
						}}>
							<IconButton
								onClick={handleSortMenuOpen}
								sx={{
									width: { sm: theme.spacing(7), xs: theme.spacing(5) },
									height: { sm: theme.spacing(7), xs: theme.spacing(5) },
									borderRadius: '50%',
									border: `1px solid ${theme.palette.divider}`,
									backgroundColor: 'transparent',
									color: theme.palette.text.secondary,
									flexShrink: 0,
									'&:hover': {
										backgroundColor: theme.palette.action.hover,
										borderColor: theme.palette.primary.main
									}
								}}
							>
								<SortIcon />
							</IconButton>

							<Menu
								anchorEl={sortMenuAnchor}
								open={Boolean(sortMenuAnchor)}
								onClose={handleSortMenuClose}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'right',
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								PaperProps={{
									elevation: 3,
									sx: {
										minWidth: 180,
										mt: 1
									}
								}}
							>
								<MenuItem 
									onClick={() => handleSortFieldChange('date')}
									selected={sortBy === 'date'}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
										<SortIcon fontSize="small" />
										<Typography variant="body2">Date</Typography>
									</Box>
								</MenuItem>
								<MenuItem 
									onClick={() => handleSortFieldChange('name')}
									selected={sortBy === 'name'}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
										<SortIcon fontSize="small" />
										<Typography variant="body2">Name</Typography>
									</Box>
								</MenuItem>
								
								<Divider sx={{ my: 1 }} />
								
								<MenuItem 
									onClick={() => handleSortOrderChange('asc')}
									selected={sortOrder === 'asc'}
									disabled={!sortBy}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
										<ArrowUpwardIcon fontSize="small" />
										<Typography variant="body2">Ascending</Typography>
									</Box>
								</MenuItem>
								<MenuItem 
									onClick={() => handleSortOrderChange('desc')}
									selected={sortOrder === 'desc'}
									disabled={!sortBy}
								>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
										<ArrowDownwardIcon fontSize="small" />
										<Typography variant="body2">Descending</Typography>
									</Box>
								</MenuItem>
							</Menu>
							
							<Button
								startIcon={<FilterListIcon />}
								onClick={() => setShowFilters(!showFilters)}
								variant={hasActiveFilters ? "contained" : "outlined"}
								size="large"
								sx={{ 
									flex: 1,
									height: { sm: theme.spacing(7), xs: theme.spacing(5) },
									backgroundColor: hasActiveFilters ? theme.palette.primary.main : 'transparent'
								}}
							>
								Filters {hasActiveFilters && `(${(selectedType ? 1 : 0) + selectedTags.length + (searchText ? 1 : 0)})`}
							</Button>

							{hasActiveFilters && (
								<Button
									startIcon={<ClearIcon />}
									onClick={clearAllFilters}
									variant="text"
									size="large"
									color="secondary"
									sx={{
										display: { xs: 'none', sm: 'flex' },
										height: '56px'
									}}
								>
									Clear All
								</Button>
							)}
						</Box>
					</Box>

					{/* Mobile Clear All Button */}
					{hasActiveFilters && (
						<Box sx={{ display: { xs: 'block', sm: 'none' }, width: '100%' }}>
							<Button
								startIcon={<ClearIcon />}
								onClick={clearAllFilters}
								variant="text"
								fullWidth
								size="medium"
								color="secondary"
							>
								Clear All Filters
							</Button>
						</Box>
					)}

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
								{/* Type Filter */}
								{
									uniqueTypes.length > 1 && (
										<Grid item xs={12} md={6}>
											<FormControl fullWidth size="medium">
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
								<Grid item xs={12} md={uniqueTypes.length > 1 ? 6 : 12}>
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
					<Box sx={{ 
						mt: 2, 
						display: 'flex', 
						flexDirection: { xs: 'column', sm: 'row' },
						justifyContent: 'space-between', 
						alignItems: { xs: 'flex-start', sm: 'center' },
						gap: { xs: 1.5, sm: 2 }
					}}>
						<Typography variant="body2" color="text.secondary">
							Showing {filteredProjects.length} of {categoryFilteredProjects.length} project{categoryFilteredProjects.length !== 1 ? 's' : ''}
						</Typography>
						
						{/* Filter Tags and Sort Indicator */}
						<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
							{/* Sort Indicator (always visible, non-deletable) */}
							<Chip 
								label={`Sort: ${sortBy === 'date' ? 'Date' : 'Name'} (${
									sortOrder === 'asc' 
										? (sortBy === 'date' ? 'Oldest First' : 'A-Z')
										: (sortBy === 'date' ? 'Newest First' : 'Z-A')
								})`} 
								size="small" 
								color="primary"
								variant="outlined"
							/>
							
							{/* Active Filter Tags */}
							{hasActiveFilters && (
								<>
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
								</>
							)}
						</Box>
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
		</Fragment>
	)
}

export default Index
