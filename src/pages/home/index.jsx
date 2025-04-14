import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { 
	Box, 
	Typography, 
	Container, 
	Stack, 
	Grid2 as Grid, 
	useMediaQuery,
	useTheme,
	Tooltip
} from '@mui/material'
import { Link } from 'react-router-dom'
import NorthEastIcon from '@mui/icons-material/NorthEast'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SchoolIcon from '@mui/icons-material/School'
import WorkIcon from '@mui/icons-material/Work'
import GitHubIcon from '@mui/icons-material/GitHub'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination, Autoplay, Keyboard, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/keyboard'
import 'swiper/css/navigation'
import { alpha } from '@mui/material/styles'
import { useSelector } from 'react-redux'

// Import styled components from styles file
import { 
	ProfileAvatar, 
	StatusIndicator, 
	SocialButton, 
	ContactButton,
	DownArrowButton,
	AboutSection,
	AboutImage,
	ProjectsSection,
	ProjectCard,
	ProjectImageWrapper,
	ProjectTags,
	ProjectTag,
	SkillsSection,
	SkillsContainer,
	Skill,
	TimelineContainer,
	TimelineItem,
	TimelineContent,
	TimelineRole,
	TimelineCompany,
	TimelineDescription,
	TimelineWavyLine,
	FilterLegendButton,
	TimelineTypeIcon,
	ExperienceSection,
	responsiveStyles,
	// Carousel components
	CarouselContainer,
	SwiperStyles,
} from './styles'
import { getSocialIcon, generateSvgArray } from '../../common/common'
import aboutSectionSvg from '../../assets/aboutSection.svg'

// Dynamic import of all SVG files from the loading folder
const loadingSvgs = import.meta.glob('../../assets/loading/*.svg', { eager: true });

const Index = () => {
	const userData = useSelector((state) => state.user);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
	const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
	const aboutSectionRef = useRef(null);
	const projectsSectionRef = useRef(null);
	const skillsSectionRef = useRef(null);
	const experienceSectionRef = useRef(null);
	const swiperRef = useRef(null);
	const [appBarHeight, setAppBarHeight] = useState(64); // Default height
	
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
		const appBarElement = document.querySelector('.MuiAppBar-root');
		if (appBarElement) {
			setAppBarHeight(appBarElement.clientHeight);
		}
		
		// Add listener for window resize
		const handleResize = () => {
			if (appBarElement) {
				setAppBarHeight(appBarElement.clientHeight);
			}
		};
		
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);
	
	// State to track visible timeline types (experience/education)
	const [visibleTypes, setVisibleTypes] = useState({
		experience: true,
		education: true
	});

	// Carousel state
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAutoScrolling, setIsAutoScrolling] = useState(true);
	const carouselRef = useRef(null);
	const trackRef = useRef(null);
	const slidesPerView = isMobile ? 1 : isTablet ? 2 : 3;
	
	// Touch swipe state
	const [touchStart, setTouchStart] = useState(null);
	const [touchEnd, setTouchEnd] = useState(null);
	const [isSwiping, setIsSwiping] = useState(false);
	const [swipeDistance, setSwipeDistance] = useState(0);
	
	// Toggle visibility for timeline item type
	const toggleTypeVisibility = (type) => {
		setVisibleTypes(prev => {
			// Create new state with the type toggled
			const newState = { ...prev, [type]: !prev[type] };
			
			// If both types are now false, reset to both being true
			if (!newState.experience && !newState.education) {
				return { experience: true, education: true };
			}
			
			return newState;
		});
	};

	// Combined timeline data (experience + education) sorted by year and filtered by visible types
	const combinedTimelineData = [...userData.timelineData.experience, ...userData.timelineData.education]
		.filter(item => visibleTypes[item.type])
		.sort((a, b) => b.year - a.year);

	// Memoized wavy path calculation
	const timelineSvgData = useMemo(() => {
		// Generate a wavy line path based on the number of items
		const totalItems = combinedTimelineData.length;
		if (!totalItems) return { path: '', height: 0, points: [], svgElements: null };
		
		// Set a fixed height per item for consistency
		const itemHeight = 230;
		const totalHeight = totalItems * itemHeight + 70; // Extra padding at bottom
		
		// Starting point (top center)
		let path = 'M110,0 ';
		
		// Store points for ellipsis and text
		let points = [];
		
		// Create alternating curves
		for (let i = 0; i < totalItems; i++) {
			const isEven = i % 2 === 0;
			const y1 = i * itemHeight + (itemHeight / 3);
			const y2 = i * itemHeight + (itemHeight * 2/3);
			const y3 = (i + 1) * itemHeight;
			
			// Calculate point for text and ellipsis (at max curve point)
			// For even curves (right), the max point is around x=90
			// For odd curves (left), the max point is around x=10
			const pointX = isEven ? 135 : 85;
			const pointY = i * itemHeight + (itemHeight / 2);
			
			// Store the point and associated item
			points.push({
				x: pointX,
				y: pointY,
				item: combinedTimelineData[i]
			});
			
			// Control points for bezier curves
			if (isEven) {
				// Curve to the right
				path += `C140,${y1} 150,${y2} 110,${y3} `;
			} else {
				// Curve to the left
				path += `C80,${y1} 70,${y2} 110,${y3} `;
			}
		}
		
		// Create SVG elements for circles and text
		const svgElements = points.map((point, index) => {
			const isEven = index % 2 === 0;
			const item = point.item;
			
			return (
				<React.Fragment key={`point-${index}`}>
					{/* Ellipsis circle */}
					<circle
						cx={point.x}
						cy={point.y}
						r="8"
						fill={item.type === 'experience' ? '#f8d07a' : '#a6e1d5'}
					/>
					
					{/* Year text */}
					<text
						x={isEven ? point.x + 45 : point.x - 45}
						y={point.y + 8}
						textAnchor="middle"
						fontSize="24"
						fontWeight="bold"
						fill={item.type === 'experience' ? '#f8d07a' : '#a6e1d5'}
						style={{ userSelect: 'none' }}
					>
						{item.year}
					</text>
				</React.Fragment>
			);
		});
		
		return { path, height: totalHeight, points, svgElements };
	}, [combinedTimelineData]);

	// Social media icon mapping
	const getIcon = (platform, tooltip) => {
		const iconSize = isMobile ? 'small' : 'medium';

		const Icon = getSocialIcon(platform)

		return (
			<Tooltip title={tooltip}>
				<Icon fontSize={iconSize} />
			</Tooltip>
		)
	};

	// Fallback for avatar if image fails to load
	const handleAvatarError = (e) => {
		e.target.src = getRandomSvg();
	};

	// Smooth scroll to about section
	const scrollToAbout = () => {
		aboutSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	// Smooth scroll to projects section
	const scrollToProjects = () => {
		projectsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	// Smooth scroll to skills section
	const scrollToSkills = () => {
		skillsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	// Smooth scroll to experience section
	const scrollToExperience = () => {
		experienceSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	// Project card component
	const renderProjectCard = (project, index) => (
		<Box 
			key={index}
			sx={{
				flex: '0 0 auto',
				width: { xs: '300px', md: '350px' },
				minWidth: { xs: '300px', md: '350px' },
				height: '100%',
				transition: 'all 0.3s ease'
			}}
		>
			<ProjectCard sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 380 }}>
				<ProjectImageWrapper sx={{ height: '180px', flexShrink: 0 }}>
					<img 
						src={project.image} 
						alt={project.title}
						onError={(e) => {
							e.target.src = getRandomSvg();
						}}
					/>
					<ProjectTags>
						{project.tags && project.tags.map((tag, idx) => (
							<ProjectTag key={idx}>{tag}</ProjectTag>
						))}
					</ProjectTags>
					{project.type && (
						<Box
							sx={{
								position: 'absolute',
								top: theme.spacing(1.5),
								right: theme.spacing(1.5),
								zIndex: 2,
								display: 'flex',
								alignItems: 'center',
								gap: theme.spacing(0.5),
								padding: theme.spacing(0.5, 1),
								borderRadius: theme.shape.borderRadius * 5,
								backgroundColor: project.type === 'github' 
									? alpha(theme.palette.mode === 'dark' ? '#333' : '#24292e', 0.85)
									: alpha(theme.palette.primary.main, 0.15),
								color: project.type === 'github'
									? theme.palette.common.white
									: theme.palette.primary.main,
								fontSize: '0.75rem',
								fontWeight: 500,
								backdropFilter: 'blur(4px)',
								cursor: 'pointer',
							}}
							onClick={() => window.open(project.html_url, '_blank', 'noopener,noreferrer')}
						>
							{project.type === 'github' ? (
								<><GitHubIcon fontSize="small" sx={{ fontSize: 16 }} /> GitHub</>
							) : project.type}
						</Box>
					)}
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
						to={"/projects/" + (index+1)}
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
							textDecoration: 'none'
						}}
					>
						View Details <NorthEastIcon sx={{ ml: 0.5, fontSize: 16 }} />
					</Box>
				</Box>
			</ProjectCard>
		</Box>
	);

	// Timeline Item Renderer with wavy line
	const renderTimelineItem = (item, index) => {
		const isExperience = item.type === 'experience';
		const isEven = index % 2 === 0;
		// Alternate sides for desktop, all on right for mobile
		const align = isMediumScreen ? 'right' : isEven ? 'left' : 'right';
		
		return (
			<TimelineItem 
				key={item.id} 
				align={align} 
				index={index}
				itemType={item.type}
			>
				{/* The content card */}
				<TimelineContent itemType={item.type} align={align}>
					{/* Type icon in left center column */}
					<TimelineTypeIcon itemType={item.type}>
						{isExperience ? <WorkIcon /> : <SchoolIcon />}
					</TimelineTypeIcon>
					
					{/* Mobile-only year display */}
					<Box 
						sx={{ 
							display: { xs: 'flex', md: 'none' },
							justifyContent: 'center',
							alignItems: 'center',
							bgcolor: item.type === 'experience' ? '#f8d07a' : '#a6e1d5',
							color: '#000',
							width: 'auto',
							minWidth: '100px',
							height: '32px',
							borderRadius: '16px',
							fontWeight: 'bold',
							fontSize: '16px',
							margin: '0 auto 16px auto',
							boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
							gap: 1,
							px: 2
						}}
					>
						{isExperience ? <WorkIcon fontSize="small" /> : <SchoolIcon fontSize="small" />}
						{item.period ? item.period : item.year}
					</Box>
					<TimelineRole variant="h6">
						{isExperience ? item.title : item.degree}
					</TimelineRole>
					
					<TimelineCompany variant="subtitle1" sx={{ display: { xs: 'none', md: 'block' }}}>
						{isExperience ? item.company : item.institution}{' '}
						({item.period ? item.period : item.year})
					</TimelineCompany>
					<TimelineCompany variant="subtitle1" sx={{ display: { xs: 'block', md: 'none' }}}>
						{isExperience ? item.company : item.institution}{' '}
					</TimelineCompany>
					
					<TimelineDescription variant="body2">
						{item.description}
					</TimelineDescription>
				</TimelineContent>
			</TimelineItem>
		);
	};

	// Carousel navigation functions
	const goToSlide = useCallback((index) => {
		let newIndex = index;
		
		// Handle boundary cases
		if (newIndex < 0) {
			newIndex = userData.projects.length - slidesPerView;
		} else if (newIndex > userData.projects.length - slidesPerView) {
			newIndex = 0;
		}
		
		setCurrentIndex(newIndex);
		// Pause auto-scrolling for 5 seconds after manual navigation
		if (isAutoScrolling) {
			setIsAutoScrolling(false);
			setTimeout(() => setIsAutoScrolling(true), 5000);
		}
	}, [userData.projects.length, slidesPerView, isAutoScrolling]);
	
	const goToNext = useCallback(() => {
		goToSlide(currentIndex + 1);
	}, [currentIndex, goToSlide]);
	
	const goToPrev = useCallback(() => {
		goToSlide(currentIndex - 1);
	}, [currentIndex, goToSlide]);

	// Auto-scrolling effect
	useEffect(() => {
		let interval;
		
		if (isAutoScrolling) {
			interval = setInterval(() => {
				goToSlide((currentIndex + 1) % (userData.projects.length - slidesPerView + 1));
			}, 5000);
		}
		
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [currentIndex, isAutoScrolling, goToSlide, userData.projects.length, slidesPerView]);

	return (
		<>
			{/* Hero Section */}
			<Box sx={{ 
				bgcolor: theme.palette.background.default,
				position: 'relative',
				overflow: 'hidden',
				backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(30, 45, 90, 0.15) 0%, rgba(30, 45, 90, 0) 70%)',
				pt: { xs: `${appBarHeight}px` }
			}}>
				<Container maxWidth="lg">
					<Grid 
						container 
						direction={{ xs: 'column-reverse', md: 'row' }}
						alignItems="center" 
						justifyContent={{ xs: 'center', md: 'space-between' }}
						spacing={{ xs: 5, md: 4 }}
						sx={{ 
							pt: { xs: 2 },
							py: { xs: 6, sm: 8, md: 8 },
							transition: 'padding 0.3s ease-in-out',
						}}
					>
						{/* Left side content */}
						<Grid xs={12} md={6} sx={{ 
							display: 'flex', 
							flexDirection: 'column',
							alignItems: { xs: 'center', md: 'flex-start' },
							textAlign: { xs: 'center', md: 'left' },
							transition: 'all 0.3s ease-in-out',
							mt: { xs: 2, md: 0 }
						}}>
							<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
								<StatusIndicator />
								<Typography 
									variant="body2" 
									color="text.secondary"
									sx={responsiveStyles.availabilityText}
								>
									{userData.availability}
								</Typography>
							</Box>
							
							<Typography 
								variant="h2" 
								component="h1" 
								sx={{
									...responsiveStyles.nameText,
									mb: 1,
									fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
								}}
							>
								{userData.name}{' '}
								<Typography 
									variant="h2" 
									component="span" 
									color={theme.palette.primary.main}
									sx={{
										...responsiveStyles.surnameText,
										fontSize: 'inherit'
									}}
								>
									{userData.surname}
								</Typography>
							</Typography>
							
							<Typography 
								variant="h6" 
								color="text.secondary"
								sx={{
									...responsiveStyles.titleText,
									pl: { xs: 2, md: 0 },
									pr: { xs: 2, md: 0 },
									mb: 3,
									fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
								}}
							>
								{userData.title} {userData.location && `${userData.location}`}
							</Typography>
							
							<Stack 
								direction="row" 
								spacing={{ xs: 1, sm: 1.5, md: 2 }}
								sx={{ 
									mb: { xs: 3, md: 4 },
									flexWrap: { xs: 'wrap', sm: 'nowrap' },
									justifyContent: { xs: 'center', md: 'flex-start' },
									gap: { xs: 1, md: 0 }
								}}
							>
								{userData.heroSkills ? userData.heroSkills.map((skill, index) => (
									<Box 
										key={index}
										sx={{
											bgcolor: index === 0 ? theme.palette.primary.main : theme.palette.background.paper,
											color: index === 0 ? theme.palette.primary.contrastText : theme.palette.text.primary,
											px: { xs: 1.5, sm: 2 },
											py: 0.8,
											border: index !== 0 ? `1px solid ${theme.palette.divider}` : 'none',
											borderRadius: '20px',
											fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
											boxShadow: theme.shadows[1],
											whiteSpace: 'nowrap'
										}}
									>
										{skill}
									</Box>
								)) : userData.skills.slice(0, 3).map((skill, index) => (
									<Box 
										key={index}
										sx={{
											bgcolor: index === 0 ? theme.palette.primary.main : theme.palette.background.paper,
											color: index === 0 ? theme.palette.primary.contrastText : theme.palette.text.primary,
											px: { xs: 1.5, sm: 2 },
											py: 0.8,
											border: index !== 0 ? `1px solid ${theme.palette.divider}` : 'none',
											borderRadius: '20px',
											fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
											boxShadow: theme.shadows[1],
											whiteSpace: 'nowrap'
										}}
									>
										{skill}
									</Box>
								))}
							</Stack>
							
							<Box sx={{ 
								display: 'flex',
								flexDirection: { xs: 'column', sm: 'row' },
								gap: { xs: 2, sm: 2 },
								width: { xs: '100%', sm: 'auto' },
								alignItems: { xs: 'stretch', sm: 'center' },
								justifyContent: { xs: 'center', md: 'flex-start' }
							}}>
								<ContactButton 
									component={Link}
									to={userData.contactLink}
									variant="contained"
									color="primary"
									endIcon={<NorthEastIcon fontSize={isMobile ? 'small' : 'medium'} />}
									sx={{
										px: 3,
										py: { xs: 1, sm: 1.2 },
										borderRadius: '30px',
										boxShadow: theme.shadows[4],
										textTransform: 'none',
										bgcolor: theme.palette.primary.main,
										'&:hover': {
											bgcolor: theme.palette.primary.dark
										},
										fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' }
									}}
								>
									Contact Me
								</ContactButton>
								
								<ContactButton 
									onClick={scrollToProjects}
									variant="outlined"
									endIcon={<KeyboardArrowDownIcon fontSize={isMobile ? 'small' : 'medium'} />}
									sx={{
										px: 3,
										py: { xs: 1, sm: 1.2 },
										borderRadius: '30px',
										textTransform: 'none',
										fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' }
									}}
								>
									View Projects
								</ContactButton>
							</Box>
							
							<Stack 
								direction="row" 
								spacing={{ xs: 1, sm: 2 }}
								sx={{ 
									mt: { xs: 3, md: 4 },
									justifyContent: { xs: 'center', md: 'flex-start' }
								}}
							>
								{userData.socialLinks.map((social, index) => (
									<SocialButton 
										key={index} 
										component="a" 
										href={social.url}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={social.platform}
										sx={{
											minWidth: { xs: 32, sm: 36, md: 40 },
											width: { xs: 32, sm: 36, md: 40 },
											height: { xs: 32, sm: 36, md: 40 }
										}}
									>
										{getIcon(social.platform, social.tooltip)}
									</SocialButton>
								))}
							</Stack>
						</Grid>
						
						{/* Right side stats */}
						<Grid xs={12} md={6} sx={{ 
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							position: 'relative'
						}}>
							<Box sx={{ 
								position: 'relative',
								width: { xs: '250px', sm: '280px', md: '360px' },
								height: { xs: '250px', sm: '280px', md: '360px' },
								borderRadius: '50%',
								border: `2px dashed ${alpha(theme.palette.primary.main, 0.4)}`,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								background: alpha(theme.palette.background.paper, 0.03)
							}}>
								<ProfileAvatar 
									src={userData.avatar} 
									alt={`${userData.name} ${userData.surname}`}
									onError={handleAvatarError}
									sx={{
										width: { xs: '200px', sm: '220px', md: '280px' },
										height: { xs: '200px', sm: '220px', md: '280px' },
										border: 'none',
										boxShadow: 'none'
									}}
								/>
								
								{/* Stats around the circle */}
								<Box sx={{
									position: 'absolute',
									top: { xs: '-15px', md: '-20px' },
									left: '50%',
									transform: 'translateX(-50%)',
									bgcolor: theme.palette.primary.main,
									color: theme.palette.primary.contrastText,
									borderRadius: '12px',
									py: { xs: 0.8, md: 1 },
									px: { xs: 2, md: 2.5 },
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									minWidth: { xs: '100px', md: '120px' },
									boxShadow: theme.shadows[3],
									zIndex: 1
								}}>
									<Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
										{userData.heroStats?.experience || "2+ Years"}
									</Typography>
									<Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
										Experience
									</Typography>
								</Box>
								
								<Box sx={{
									position: 'absolute',
									top: '50%',
									right: { xs: '-20px', sm: '-25px', md: '-30px' },
									transform: 'translateY(-50%)',
									bgcolor: theme.palette.background.paper,
									color: theme.palette.text.primary,
									borderRadius: '12px',
									py: { xs: 0.8, md: 1 },
									px: { xs: 2, md: 2.5 },
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									minWidth: { xs: '80px', md: '100px' },
									border: `1px solid ${theme.palette.divider}`,
									boxShadow: theme.shadows[2],
									zIndex: 1
								}}>
									<Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
										{userData.projects?.length || "50+"}
									</Typography>
									<Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
										Projects
									</Typography>
								</Box>
							</Box>
						</Grid>
					</Grid>
					
					<Box sx={{ textAlign: 'center', pb: 4 }}>
						<DownArrowButton 
							onClick={scrollToAbout}
							aria-label="Scroll to about section"
						>
							<KeyboardArrowDownIcon fontSize={isMobile ? 'medium' : 'large'} />
						</DownArrowButton>
					</Box>
				</Container>
			</Box>

			{/* About Section */}
			<Box ref={aboutSectionRef} sx={{ 
				bgcolor: theme.palette.background.paper, 
				width: '100%',
				position: 'relative',
				zIndex: 1
			}}>
				<Container maxWidth="lg">
					<AboutSection>
						<Box sx={{ 
							flex: 1, 
							pr: { md: 4 },
							order: { xs: 2, md: 1 }
						}}>
							<Typography variant="h2" component="h2" sx={responsiveStyles.sectionTitle}>
								{userData.about.title}{' '}
								<Typography 
									variant="h2" 
									component="span" 
									sx={responsiveStyles.highlightItalic}
								>
									{userData.about.highlight}
								</Typography>
							</Typography>
							
							<Typography 
								variant="body1"
								sx={responsiveStyles.aboutDescription}
							>
								{userData.about.description}
							</Typography>

							<Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
								<ContactButton 
									component={Link}
									to={userData.contactLink}
									variant="outlined"
									endIcon={<NorthEastIcon fontSize={isMobile ? 'small' : 'medium'} />}
								>
									Contact Me
								</ContactButton>
								
								<ContactButton 
									onClick={scrollToProjects}
									variant="outlined"
									endIcon={<KeyboardArrowDownIcon fontSize={isMobile ? 'small' : 'medium'} />}
								>
									See Projects
								</ContactButton>
							</Box>
						</Box>
						
						<AboutImage sx={{ order: { xs: 1, md: 2 } }}>
							<img src={aboutSectionSvg} alt='About' />
						</AboutImage>
					</AboutSection>
				</Container>
			</Box>
			
			{/* Skills Section */}
			<Box sx={{ bgcolor: theme.palette.background.default }}>
				<SkillsSection ref={skillsSectionRef}>
					<Container maxWidth="lg">
						<Typography 
							variant="subtitle1" 
							component="p" 
							sx={responsiveStyles.sectionSubtitle}
						>
							{userData.skillsSection.subtitle}
						</Typography>
						<Typography 
							variant="h2" 
							component="h2" 
							sx={responsiveStyles.sectionTitle}
						>
							{userData.skillsSection.title}{' '}
							<Typography 
								variant="h2" 
								component="span" 
								sx={responsiveStyles.highlightItalic}
							>
								{userData.skillsSection.highlight}
							</Typography>
						</Typography>

						<SkillsContainer>
							{userData.skills.map((skill, index) => (
								<Skill key={index}>{skill}</Skill>
							))}
						</SkillsContainer>

					</Container>
				</SkillsSection>
			</Box>

			{/* Projects Section */}
			<Box sx={{ bgcolor: theme.palette.background.paper }}>
				<ProjectsSection ref={projectsSectionRef}>
					<Container maxWidth="lg" sx={{ mb: { xs: 4, md: 6 } }}>
						<Typography 
							variant="subtitle1" 
							component="p" 
							sx={responsiveStyles.sectionSubtitle}
						>
							{userData.projectsSection.subtitle}
						</Typography>
						<Typography 
							variant="h2" 
							component="h2" 
							sx={responsiveStyles.sectionTitle}
						>
							{userData.projectsSection.title}{' '}
							<Typography 
								variant="h2" 
								component="span" 
								sx={responsiveStyles.highlightItalic}
							>
								{userData.projectsSection.highlight}
							</Typography>
						</Typography>
					</Container>

					{/* Swiper Carousel Implementation */}
					<CarouselContainer ref={carouselRef} sx={{...SwiperStyles, '.swiper-slide': { height: 'auto' }}}>
						<Swiper
							onSwiper={(swiper) => {
								swiperRef.current = swiper;
							}}
							effect={'coverflow'}
							grabCursor={true}
							centeredSlides={true}
							slidesPerView={'auto'}
							loop={userData.projects.length > 5 ? true : false}
							navigation={true}
							spaceBetween={80}
							coverflowEffect={{
								rotate: 30,
								stretch: 0,
								depth: 100,	
								modifier: 1,
								slideShadows: false,
							}}
							pagination={{
								clickable: true,
								el: '.swiper-pagination',
							}}
							keyboard={{
								enabled: true,
							}}
							// autoplay={{
							// 	delay: 5000,
							// 	disableOnInteraction: true,
							// }}
							modules={[EffectCoverflow, Pagination, Autoplay, Keyboard, Navigation]}
							className="mySwiper"
							style={{ height: 'auto', paddingBottom: { xs: 2, md: 6 } }}
						>
							{userData.projects.map((project, index) => (
								<SwiperSlide key={index} style={{ height: 'auto' }}>
									{renderProjectCard(project, index)}
								</SwiperSlide>
							))}
							<div className="swiper-pagination"></div>
						</Swiper>
					</CarouselContainer>

					<Box sx={{ mt: { xs: 4, md: 8 }, display: 'flex', justifyContent: 'center' }}>
						<ContactButton 
							component={Link}
							to="/projects"
							variant="outlined"
							endIcon={<ArrowForwardIcon />}
						>
							See All Projects
						</ContactButton>
					</Box>
				</ProjectsSection>
			</Box>
			
			{/* Experience Section */}
			<Box sx={{ bgcolor: theme.palette.background.default }}>
				<ExperienceSection ref={experienceSectionRef}>
					<Container maxWidth="lg">
						<Typography 
							variant="subtitle1" 
							component="p" 
							sx={responsiveStyles.sectionSubtitle}
						>
							{userData.timelineSection.subtitle}
						</Typography>
						<Typography 
							variant="h2" 
							component="h2" 
							sx={responsiveStyles.sectionTitle}
						>
							{userData.timelineSection.title}{' '}
							<Typography 
								variant="h2" 
								component="span" 
								sx={responsiveStyles.highlightItalic}
							>
								{userData.timelineSection.highlight}
							</Typography>
						</Typography>

						{/* Timeline Legend - Now with clickable filters */}
						<Box sx={{ 
							display: 'flex', 
							justifyContent: 'center', 
							gap: 3, 
							mt: 5,
							flexWrap: 'wrap'
						}}>
							<FilterLegendButton 
								itemType="experience"
								isActive={visibleTypes.experience}
								onClick={() => toggleTypeVisibility('experience')}
							>
								<WorkIcon sx={{ 
									color: visibleTypes.experience ? '#f8d07a' : theme.palette.text.disabled 
								}} />
								<Typography variant="body2">Work Experience</Typography>
							</FilterLegendButton>
							
							<FilterLegendButton 
								itemType="education"
								isActive={visibleTypes.education}
								onClick={() => toggleTypeVisibility('education')}
							>
								<SchoolIcon sx={{ 
									color: visibleTypes.education ? '#a6e1d5' : theme.palette.text.disabled 
								}} />
								<Typography variant="body2">Education</Typography>
							</FilterLegendButton>
						</Box>

						{/* Timeline with wavy line */}
						<TimelineContainer>
							{/* SVG wavy line - Only for desktop/tablet */}
							<TimelineWavyLine sx={{ display: { xs: 'none', md: 'block' } }}>
								<svg width="220" height={timelineSvgData.height} xmlns="http://www.w3.org/2000/svg">
									{/* Main path */}
									<path
										d={timelineSvgData.path}
										fill="none"
										stroke={theme.palette.divider}
										strokeWidth="2"
										strokeLinecap="round"
									/>
									
									{/* Render all ellipsis points and year text in one go */}
									{timelineSvgData.svgElements}
								</svg>
							</TimelineWavyLine>
							
							{/* Desktop timeline items - Only visible on desktop */}
							<Box sx={{ width: '100%' }}>
								{combinedTimelineData.map((item, index) => renderTimelineItem(item, index))}
							</Box>
						</TimelineContainer>
					</Container>
				</ExperienceSection>
			</Box>
		</>
	);
};

export default Index;