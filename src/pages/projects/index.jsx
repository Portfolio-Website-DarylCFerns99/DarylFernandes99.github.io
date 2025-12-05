import React, { useEffect, useMemo, useCallback, useState, Fragment } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const TiltCard = ({ children }) => {
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const rotateX = useTransform(y, [0, 400], [5, -5]);
	const rotateY = useTransform(x, [0, 300], [-5, 5]);

	function handleMouse(event) {
		const rect = event.currentTarget.getBoundingClientRect();
		x.set(event.clientX - rect.left);
		y.set(event.clientY - rect.top);
	}

	function handleMouseLeave() {
		x.set(150); // Reset to center (approx) or just 0 if using relative
		y.set(200);
	}

	return (
		<motion.div
			style={{
				rotateX,
				rotateY,
				perspective: 1000,
				transformStyle: "preserve-3d",
				height: '100%'
			}}
			onMouseMove={handleMouse}
			onMouseLeave={() => {
				x.set(150); // Assuming approx center
				y.set(200);
			}}
			whileHover={{ scale: 1.02 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
		>
			{children}
		</motion.div>
	);
};

// Helper component for highlighting text
const HighlightText = ({ text, highlight }) => {
	if (!highlight || !text) return text;

	// Escape special regex characters
	const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	// Split search text into words for multi-word highlighting
	const searchWords = highlight.split(/\s+/).filter(word => word.length > 0);
	if (searchWords.length === 0) return text;

	// Create regex pattern to match any of the words
	const pattern = new RegExp(`(${searchWords.map(escapeRegExp).join('|')})`, 'gi');

	const parts = text.split(pattern);

	return (
		<>
			{parts.map((part, i) => {
				const isMatch = searchWords.some(word =>
					part.toLowerCase() === word.toLowerCase()
				);

				return isMatch ? (
					<Box
						component="span"
						key={i}
						sx={{
							bgcolor: '#ffeb3b',
							color: '#000',
							fontWeight: 'bold',
							px: 0.4,
							borderRadius: 0.5
						}}
					>
						{part}
					</Box>
				) : (
					part
				);
			})}
		</>
	);
};
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
	Divider,
	InputBase
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
import StarIcon from '@mui/icons-material/Star'
import CallSplitIcon from '@mui/icons-material/CallSplit'
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
import { slugify } from '../../utils/stringUtils'

// Dynamic import of all SVG files from the loading folder
const loadingSvgs = import.meta.glob('../../assets/loading/*.svg', { eager: true });

// Language colors mapping
const LANGUAGE_COLORS = {
	'JavaScript': '#f1e05a',
	'Python': '#3572A5',
	'TypeScript': '#2b7489',
	'HTML': '#e34c26',
	'CSS': '#563d7c',
	'Java': '#b07219',
	'C++': '#f34b7d',
	'C#': '#178600',
	'C': '#555555',
	'Shell': '#89e051',
	'Go': '#00ADD8',
	'Rust': '#dea584',
	'PHP': '#4F5D95',
	'Ruby': '#701516',
	'Swift': '#ffac45',
	'Kotlin': '#F18E33',
	'Dart': '#00B4AB',
	'Vue': '#2c3e50',
	'React': '#61dafb',
	'Svelte': '#ff3e00'
};

const getLanguageColor = (lang) => {
	return LANGUAGE_COLORS[lang] || '#cccccc'; // Default gray for unknown languages
};

const Index = () => {
	const projects = useSelector((state) => state.user.projects || [])
	const projectCategories = useSelector((state) => state.user.projectCategories || [])
	const theme = useTheme()
	const [appBarHeight, setAppBarHeight] = useState(64) // Default height

	// Category filter state
	const [selectedCategoryId, setSelectedCategoryId] = useState('all') // defaults to all projects

	// Filter states
	const [searchText, setSearchText] = useState('')
	const [debouncedSearchText, setDebouncedSearchText] = useState('')
	const [selectedType, setSelectedType] = useState('')
	const [selectedTags, setSelectedTags] = useState([])
	const [showFilters, setShowFilters] = useState(false)

	// Sort states
	const [sortBy, setSortBy] = useState('date') // Default to date sorting
	const [sortOrder, setSortOrder] = useState('desc') // desc for newest first by default
	const [sortMenuAnchor, setSortMenuAnchor] = useState(null)

	// Debounce search text
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchText(searchText)
		}, 300)

		return () => clearTimeout(timer)
	}, [searchText])

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
			// Search text filter (using debounced value)
			let matchesSearch = true;
			if (debouncedSearchText) {
				const searchKeywords = debouncedSearchText.toLowerCase().split(/\s+/).filter(w => w.length > 0);
				// OR logic: check if ANY keyword matches
				matchesSearch = searchKeywords.some(keyword =>
					project.title?.toLowerCase().includes(keyword) ||
					project.description?.toLowerCase().includes(keyword) ||
					project.tags?.some(tag => tag.toLowerCase().includes(keyword)) ||
					Object.keys(project.additional_data?.languages || {}).some(lang => lang.toLowerCase().includes(keyword))
				);
			}

			// Type filter
			const matchesType = !selectedType || project.type === selectedType

			// Tags filter
			const matchesTags = selectedTags.length === 0 ||
				(project.tags && selectedTags.some(tag => project.tags.includes(tag)))

			return matchesSearch && matchesType && matchesTags
		})

		// Apply relevance sorting if there is search text
		if (debouncedSearchText) {
			const searchKeywords = debouncedSearchText.toLowerCase().split(/\s+/).filter(w => w.length > 0);

			filtered = filtered.map(project => {
				let score = 0;
				const title = (project.title || '').toLowerCase();
				const desc = (project.description || '').toLowerCase();
				const tags = (project.tags || []).map(t => t.toLowerCase());
				const languages = Object.keys(project.additional_data?.languages || {}).map(l => l.toLowerCase());

				searchKeywords.forEach(keyword => {
					// Title matches (highest weight)
					if (title === keyword) score += 10;
					else if (title.includes(keyword)) score += 5;

					// Tag matches (medium weight)
					if (tags.some(t => t === keyword)) score += 4;
					else if (tags.some(t => t.includes(keyword))) score += 3;

					// Language matches (medium weight)
					if (languages.some(l => l === keyword)) score += 4;
					else if (languages.some(l => l.includes(keyword))) score += 3;

					// Description matches (lower weight)
					if (desc.includes(keyword)) score += 1;
				});

				return { ...project, relevanceScore: score };
			}).sort((a, b) => {
				// Sort by score descending
				if (b.relevanceScore !== a.relevanceScore) {
					return b.relevanceScore - a.relevanceScore;
				}
				// Fallback to selected sort
				return 0;
			});
		}

		// Apply sorting if sortBy is selected (and no search or equal scores)
		if (sortBy) {
			filtered = [...filtered].sort((a, b) => {
				// If we have search scores and they differ, preserve that order
				if (debouncedSearchText && a.relevanceScore !== b.relevanceScore) {
					return 0; // Already sorted by score
				}

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
	}, [categoryFilteredProjects, debouncedSearchText, selectedType, selectedTags, sortBy, sortOrder])

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
	// NOTE: Search text is excluded from "Clear All" visibility if it's the only filter,
	// because the search bar has its own clear button.
	const hasActiveFilters = selectedType || selectedTags.length > 0

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
					{/* Refined Category Tabs */}
					{categoryTabs.length > 0 && (
						<Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
							<Paper
								elevation={0}
								sx={{
									display: 'flex',
									flexWrap: 'wrap',
									justifyContent: 'center',
									gap: 0.5,
									p: 0.5,
									borderRadius: '999px',
									bgcolor: alpha(theme.palette.text.primary, 0.03),
									border: `1px solid ${theme.palette.divider}`
								}}
							>
								{categoryTabs.map(tab => {
									const isActive = selectedCategoryId === tab.id;

									return (
										<Box key={tab.id} sx={{ position: 'relative' }}>
											{isActive && (
												<Box
													component={motion.div}
													layoutId="activeCategory"
													transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
													sx={{
														position: 'absolute',
														inset: 0,
														bgcolor: 'primary.main',
														borderRadius: '999px',
														zIndex: 0
													}}
												/>
											)}
											<Button
												onClick={() => setSelectedCategoryId(tab.id)}
												size="small"
												sx={{
													position: 'relative',
													zIndex: 1,
													textTransform: 'none',
													fontWeight: isActive ? 600 : 500,
													borderRadius: '999px',
													minHeight: 36,
													px: 2.5,
													color: isActive ? 'primary.contrastText' : 'text.secondary',
													'&:hover': {
														bgcolor: isActive ? 'transparent' : alpha(theme.palette.text.primary, 0.05)
													},
													'&:focus': {
														outline: 'none',
														boxShadow: 'none'
													},
													'&:focus-visible': {
														outline: 'none',
														boxShadow: 'none'
													},
													transition: 'color 0.2s ease'
												}}
												disableRipple
												variant="text"
											>
												{tab.name}
											</Button>
										</Box>
									);
								})}
							</Paper>
						</Box>
					)}

					{/* Unified Control Bar */}
					<Paper
						elevation={0}
						sx={{
							p: '2px 4px',
							display: 'flex',
							alignItems: 'center',
							width: '100%',
							maxWidth: 800,
							mx: 'auto',
							borderRadius: 4,
							border: `1px solid ${theme.palette.divider}`,
							bgcolor: theme.palette.background.paper,
							transition: 'box-shadow 0.3s ease',
							'&:hover': {
								boxShadow: theme.shadows[4]
							}
						}}
					>
						<Box sx={{ p: 1.5, display: 'flex', color: 'action.active' }}>
							<SearchIcon />
						</Box>
						<InputBase
							sx={{ ml: 1, flex: 1, fontSize: '1rem' }}
							placeholder="Search projects by name, description, or tags..."
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
						/>

						{searchText && (
							<IconButton size="small" onClick={() => setSearchText('')} sx={{ mr: 1 }}>
								<ClearIcon fontSize="small" />
							</IconButton>
						)}

						<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

						<Button
							onClick={handleSortMenuOpen}
							startIcon={<SortIcon />}
							sx={{
								textTransform: 'none',
								color: 'text.secondary',
								px: 2,
								borderRadius: 2,
								display: { xs: 'none', sm: 'flex' }
							}}
						>
							Sort
						</Button>
						<IconButton
							onClick={handleSortMenuOpen}
							sx={{ display: { xs: 'flex', sm: 'none' }, p: 1.5 }}
						>
							<SortIcon />
						</IconButton>

						<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

						<Button
							onClick={() => setShowFilters(!showFilters)}
							startIcon={<FilterListIcon />}
							variant={hasActiveFilters ? "contained" : "text"}
							color={hasActiveFilters ? "primary" : "inherit"}
							sx={{
								textTransform: 'none',
								color: hasActiveFilters ? 'primary.contrastText' : 'text.secondary',
								px: 2,
								borderRadius: 3,
								mr: 0.5,
								display: { xs: 'none', sm: 'flex' }
							}}
						>
							Filters
						</Button>
						<IconButton
							onClick={() => setShowFilters(!showFilters)}
							color={hasActiveFilters ? "primary" : "default"}
							sx={{ display: { xs: 'flex', sm: 'none' }, p: 1.5, mr: 0.5 }}
						>
							<FilterListIcon />
						</IconButton>
					</Paper>

					{/* Sort Menu (Keep existing) */}
					<Menu
						anchorEl={sortMenuAnchor}
						open={Boolean(sortMenuAnchor)}
						onClose={handleSortMenuClose}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
						transformOrigin={{ vertical: 'top', horizontal: 'right' }}
						PaperProps={{ elevation: 3, sx: { minWidth: 180, mt: 1, borderRadius: 2 } }}
					>
						<MenuItem onClick={() => handleSortFieldChange('date')} selected={sortBy === 'date'}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<SortIcon fontSize="small" /> <Typography variant="body2">Date</Typography>
							</Box>
						</MenuItem>
						<MenuItem onClick={() => handleSortFieldChange('name')} selected={sortBy === 'name'}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<SortIcon fontSize="small" /> <Typography variant="body2">Name</Typography>
							</Box>
						</MenuItem>
						<Divider sx={{ my: 1 }} />
						<MenuItem onClick={() => handleSortOrderChange('asc')} selected={sortOrder === 'asc'} disabled={!sortBy}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<ArrowUpwardIcon fontSize="small" /> <Typography variant="body2">Ascending</Typography>
							</Box>
						</MenuItem>
						<MenuItem onClick={() => handleSortOrderChange('desc')} selected={sortOrder === 'desc'} disabled={!sortBy}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<ArrowDownwardIcon fontSize="small" /> <Typography variant="body2">Descending</Typography>
							</Box>
						</MenuItem>
					</Menu>

					{/* Advanced Filters Panel */}
					<Collapse in={showFilters}>
						<Paper
							elevation={0}
							sx={{
								p: 3,
								mt: 2,
								maxWidth: 800,
								mx: 'auto',
								borderRadius: 3,
								border: `1px solid ${theme.palette.divider}`,
								backgroundColor: alpha(theme.palette.background.paper, 0.5)
							}}
						>
							<Grid container spacing={3}>
								{/* Type Filter */}
								{uniqueTypes.length > 1 && (
									<Grid item xs={12} md={6}>
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
								)}

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
												sx={{ cursor: 'pointer' }}
											/>
										))}
									</Box>
								</Grid>
							</Grid>
						</Paper>
					</Collapse>

					{/* Active Filters & Results Summary */}
					<Box sx={{
						mt: 3,
						maxWidth: 800,
						mx: 'auto',
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'row' },
						justifyContent: 'space-between',
						alignItems: { xs: 'flex-start', sm: 'center' },
						gap: 2
					}}>
						<Typography variant="body2" color="text.secondary" fontWeight={500}>
							Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
						</Typography>

						<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
							{/* Sort Indicator */}
							<Chip
								label={`Sort: ${sortBy === 'date' ? 'Date' : 'Name'} (${sortOrder === 'asc' ? 'Asc' : 'Desc'})`}
								size="small"
								variant="outlined"
								sx={{ borderColor: theme.palette.divider }}
							/>

							{/* Active Filters */}
							{hasActiveFilters && (
								<>
									{selectedType && (
										<Chip
											label={`Type: ${selectedType}`}
											size="small"
											onDelete={() => setSelectedType('')}
											color="primary"
											variant="soft"
										/>
									)}
									{selectedTags.map(tag => (
										<Chip
											key={tag}
											label={tag}
											size="small"
											onDelete={() => handleTagToggle(tag)}
											color="primary"
											variant="soft"
										/>
									))}
									<Button
										size="small"
										onClick={clearAllFilters}
										color="error"
										sx={{ textTransform: 'none', ml: 1 }}
									>
										Clear All
									</Button>
								</>
							)}
						</Box>
					</Box>
				</Box>

				<Grid container spacing={3} component={motion.div} layout>
					<AnimatePresence mode="popLayout">
						{filteredProjects.map((project, index) => (
							<Grid item xs={12} md={6} lg={4} key={project.id || index}
								component={motion.div}
								layout
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								transition={{
									duration: 0.3,
									layout: { duration: 0.3 }
								}}
								sx={{ display: 'flex' }}
							>
								<TiltCard>
									<ProjectCard
										sx={{ minHeight: 380, display: 'flex', flexDirection: 'column' }}
									>
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

											{/* GitHub Stats Overlay */}
											<Box
												sx={{
													position: 'absolute',
													top: 12,
													left: 12,
													display: 'flex',
													gap: 1,
													zIndex: 2
												}}
											>
												{project.additional_data?.stargazers_count !== undefined && (
													<Chip
														icon={<StarIcon style={{ color: '#FFD700' }} />}
														label={project.additional_data.stargazers_count}
														size="small"
														sx={{
															bgcolor: 'rgba(0,0,0,0.7)',
															color: 'white',
															backdropFilter: 'blur(4px)',
															border: 'none',
															height: 24,
															'& .MuiChip-icon': { fontSize: 16 }
														}}
													/>
												)}
												{project.additional_data?.forks_count !== undefined && (
													<Chip
														icon={<CallSplitIcon style={{ color: '#fff' }} />}
														label={project.additional_data.forks_count}
														size="small"
														sx={{
															bgcolor: 'rgba(0,0,0,0.7)',
															color: 'white',
															backdropFilter: 'blur(4px)',
															border: 'none',
															height: 24,
															'& .MuiChip-icon': { fontSize: 16 }
														}}
													/>
												)}
											</Box>

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
													<HighlightText text={project.title} highlight={debouncedSearchText} />
												</Typography>

												<Typography
													variant="body2"
													color="text.secondary"
													sx={{ mb: 1.5, flexGrow: 1 }}
												>
													<HighlightText text={project.description} highlight={debouncedSearchText} />
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
													<Box sx={{ mt: 'auto' }}>
														{/* Languages */}
														{project.additional_data?.languages && Object.keys(project.additional_data.languages).length > 0 && (() => {
															const languages = project.additional_data.languages;
															const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
															const languageStats = Object.entries(languages)
																.map(([lang, bytes]) => ({
																	lang,
																	bytes,
																	percent: (bytes / totalBytes) * 100
																}))
																.sort((a, b) => b.bytes - a.bytes); // Sort by size descending

															return (
																<Box sx={{ mb: 2 }}>
																	{/* Language Bar */}
																	<Box sx={{
																		display: 'flex',
																		height: 8,
																		borderRadius: 4,
																		overflow: 'hidden',
																		mb: 1.5,
																		bgcolor: (theme) => alpha(theme.palette.text.primary, 0.1)
																	}}>
																		{languageStats.map((stat, index) => (
																			<Box
																				key={stat.lang}
																				sx={{
																					width: `${stat.percent}%`,
																					bgcolor: getLanguageColor(stat.lang),
																					height: '100%'
																				}}
																			/>
																		))}
																	</Box>

																	{/* Language List with Percentages */}
																	<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
																		{languageStats.map((stat) => (
																			<Box
																				key={stat.lang}
																				sx={{
																					display: 'flex',
																					alignItems: 'center',
																					gap: 0.5
																				}}
																			>
																				<Box sx={{
																					width: 8,
																					height: 8,
																					borderRadius: '50%',
																					bgcolor: getLanguageColor(stat.lang)
																				}} />
																				<Typography
																					variant="caption"
																					sx={{
																						color: 'text.secondary',
																						fontWeight: 500
																					}}
																				>
																					<HighlightText text={stat.lang} highlight={debouncedSearchText} />
																					<Box component="span" sx={{ opacity: 0.7, ml: 0.5 }}>
																						{stat.percent.toFixed(1)}%
																					</Box>
																				</Typography>
																			</Box>
																		))}
																	</Box>
																</Box>
															);
														})()}

														<Box sx={{ display: 'flex', gap: 1 }}>
															<Button
																component={Link}
																to={`/projects/${slugify(project.title)}`}
																variant="contained"
																color="primary"
																endIcon={<NorthEastIcon sx={{ fontSize: 16 }} />}
																sx={{
																	flexGrow: 1,
																	borderRadius: 2,
																	textTransform: 'none',
																	fontWeight: 500,
																	py: 1,
																	'&:hover': {
																		color: theme.palette.primary.contrastText
																	}
																}}
															>
																View Details
															</Button>
															{/* 
															<IconButton
																component="a"
																href={project.html_url}
																target="_blank"
																rel="noopener noreferrer"
																sx={{
																	bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
																	color: 'primary.main',
																	borderRadius: 2,
																	'&:hover': {
																		bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
																	}
																}}
															>
																<GitHubIcon />
															</IconButton>
															*/}
														</Box>
													</Box>
												)}
											</CardContent>
										</ProjectContent>
									</ProjectCard>
								</TiltCard>
							</Grid>
						))}
					</AnimatePresence>
				</Grid>

				{/* No Results Message */}
				{
					filteredProjects.length === 0 && (
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
					)
				}
			</ProjectsContainer >
		</Fragment >
	)
}

export default Index
