import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { 
  Box, 
  Typography, 
  Container, 
  Stack, 
  Grid, 
  useMediaQuery,
  useTheme,
  Tooltip,
  InputAdornment,
  Button,
  IconButton
} from '@mui/material'
import { Link } from 'react-router-dom'
import NorthEastIcon from '@mui/icons-material/NorthEast'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SchoolIcon from '@mui/icons-material/School'
import WorkIcon from '@mui/icons-material/Work'
import GitHubIcon from '@mui/icons-material/GitHub'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import FilterListIcon from '@mui/icons-material/FilterList'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ReactMarkdown from 'react-markdown'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination, Autoplay, Keyboard, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/keyboard'
import 'swiper/css/navigation'
import { alpha } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

// Import SkillGroup component
import SkillGroup from '../../components/skillGroup'
import CompactSkills from '../../components/compactSkills'

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
  ReviewsSection,
  ReviewCard,
  responsiveStyles,
  // Carousel components
  CarouselContainer,
  SwiperStyles,
  // New skills dashboard components
  SkillsDashboardContainer,
  SkillsSearchField,
  SkillsFilterButton,
  SkillsFilterContainer,
  SkillGroupsContainer
} from './styles'
import { getSocialIcon, generateSvgArray } from '../../common/common'
import aboutSectionSvg from '../../assets/aboutSection.svg'
import { DynamicSEO } from '../../components/SEO/DynamicSEO'

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
  const reviewsSectionRef = useRef(null);
  const swiperRef = useRef(null);
  const [appBarHeight, setAppBarHeight] = useState(64); // Default height
  
  // Add refs for timeline items to measure their heights
  const timelineItemRefs = useRef([]);
  // Add state to trigger SVG recalculation
  const [timelineItemHeights, setTimelineItemHeights] = useState([]);
  
  // Skills dashboard state
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [skillsMode, setSkillsMode] = useState('standard'); // 'standard' or 'detailed'
  const [showFilters, setShowFilters] = useState(false); // Toggle for filter visibility
  
  // Generate SVG array for loading images
  const loadingSvgArray = useMemo(() => generateSvgArray(loadingSvgs), []);
  
  // Helper to get a random SVG from the array
  const getRandomSvg = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * loadingSvgArray.length);
    return loadingSvgArray[randomIndex]?.url || '';
  }, [loadingSvgArray]);

  // Generate stable random SVGs for projects to prevent continuous reloading
  const projectFallbackImages = useMemo(() => {
    return userData.projects?.map(() => {
      const randomIndex = Math.floor(Math.random() * loadingSvgArray.length);
      return loadingSvgArray[randomIndex]?.url || '';
    }) || [];
  }, [userData.projects, loadingSvgArray]);
  
  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };
  
  // Get the appBar height
  useEffect(() => {
    window.document.title = `${userData.name} ${userData.surname}`;
    
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
  const slidesPerView = isMobile ? 1 : isTablet ? 2 : 3;
  
  // Projects category filtering
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // defaults to first category when available
  const categoryTabs = useMemo(() => {
    const categories = (userData.projectCategories || [])// include if visible or undefined
    
    return [
      // { id: 'all', name: 'All' },
      ...categories.map(c => ({ id: c.id, name: c.name })),
      // { id: 'uncategorized', name: 'Uncategorized' }
    ];
  }, [userData.projectCategories]);
  
  // Set default to first category when categories load
  useEffect(() => {
    if (!selectedCategoryId && categoryTabs.length > 0) {
      setSelectedCategoryId(categoryTabs[0].id);
    }
  }, [categoryTabs, selectedCategoryId]);
  
  const filteredProjects = useMemo(() => {
    const projects = userData.projects || [];
    // If not selected yet, use first category by default
    const effectiveCategoryId = selectedCategoryId || categoryTabs[0]?.id;
    if (effectiveCategoryId === 'all') return projects;
    if (effectiveCategoryId === 'uncategorized') {
      return projects.filter(p => p?.project_category_id == "None");
    }
    return projects.filter(p => p?.project_category_id === effectiveCategoryId);
  }, [userData.projects, selectedCategoryId, categoryTabs]);
  
  const handleCategoryChange = useCallback((event, value) => {
    setSelectedCategoryId(value);
  }, []);
  
  // When filter changes, reset the swiper to the first slide
  useEffect(() => {
    if (swiperRef.current) {
      try { swiperRef.current.slideTo?.(0); } catch (e) { /* noop */ }
    }
  }, [selectedCategoryId]);
  
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
  const combinedTimelineData = [...userData.timelineData]
    .filter(item => visibleTypes[item.type])
    .sort((a, b) => b.year - a.year);

  // Ensure refs array is updated when timelineData changes
  useEffect(() => {
    // Initialize or resize the refs array
    timelineItemRefs.current = timelineItemRefs.current.slice(0, combinedTimelineData.length);
    
    // Wait for next render cycle to measure heights
    const timeoutId = setTimeout(() => {
      const heights = timelineItemRefs.current.map(ref => 
        ref?.getBoundingClientRect().height || 230
      );
      setTimelineItemHeights(heights);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [combinedTimelineData, visibleTypes]);
  
  // Add resize observer to recalculate heights when window resizes
  useEffect(() => {
    const handleResize = () => {
      // Only recalculate if we have timeline items
      if (timelineItemRefs.current.length > 0) {
        const heights = timelineItemRefs.current.map(ref => 
          ref?.getBoundingClientRect().height || 230
        );
        setTimelineItemHeights(heights);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Memoized wavy path calculation
  const timelineSvgData = useMemo(() => {
    // Generate a wavy line path based on the number of items and their heights
    const totalItems = combinedTimelineData.length;
    if (!totalItems) return { path: '', height: 0, points: [], svgElements: null };
    
    // Get actual heights from measured refs, or use default height if not measured yet
    const itemHeights = timelineItemHeights.length === totalItems
      ? timelineItemHeights
      : Array(totalItems).fill(230);
    
    // Calculate total height and running offsets
    let totalHeight = 0;
    const offsets = itemHeights.map((height, index) => {
      const offset = totalHeight;
      totalHeight += height + 40; // Adding gap between items
      return offset;
    });
    
    // Add padding at bottom
    totalHeight += 70;
    
    // Curve parameters
    const centerX = 110; // Center X position of the wavy line
    const amplitude = 90; // How far the curve extends to the sides
    const tension = 0.4; // Curve tension factor - controls smoothness

    // Starting point (top center)
    let path = `M${centerX},0 `;
    
    // Store points for ellipsis and text
    let points = [];
    
    // Create alternating curves with improved smoothness
    for (let i = 0; i < totalItems; i++) {
      const isEven = i % 2 === 0;
      const direction = isEven ? 1 : -1; // 1 for right, -1 for left
      
      // Calculate points for this segment
      const itemHeight = itemHeights[i];
      const startY = offsets[i];
      
      // Determine the height of this segment (to next item or end)
      const segmentHeight = i < totalItems - 1 ? 
        offsets[i+1] - startY : // Use distance to next item
        itemHeight + 60; // Or standard gap for last item
      
      // Calculate control points with better spacing
      const y1 = startY + (segmentHeight * 0.3); // First control point at 30%
      const y2 = startY + (segmentHeight * 0.7); // Second control point at 70%
      const y3 = startY + segmentHeight; // End point
      
      // Calculate the horizontal displacement for control points
      // Use a sine wave pattern for more natural curves
      const ctrlPointDistance = amplitude + (i % 2 === 0 ? 5 : -5); // Slight variation per curve
      
      // Control point X coordinates with tension factor
      const cp1x = centerX + (direction * ctrlPointDistance * tension);
      const cp2x = centerX + (direction * ctrlPointDistance * 1.2 * tension);
      
      // Add the bezier curve command
      path += `C${cp1x},${y1} ${cp2x},${y2} ${centerX},${y3} `;
      
      // Calculate point for text and year marker (midpoint of the item)
      const pointX = centerX + (direction * amplitude * 0.9); // Position dot at 90% of amplitude
      const pointY = startY + (itemHeight / 2); // Center vertically in the item
      
      // Store the point and associated item
      points.push({
        x: pointX,
        y: pointY,
        item: combinedTimelineData[i]
      });
    }
    
    // Create SVG elements for circles and text
    const svgElements = points.map((point, index) => {
      const isEven = index % 2 === 0;
      const item = point.item;
      
      return (
        <React.Fragment key={`point-${index}`}>
          {/* Ellipsis circle */}
          <circle
            cx={isEven ? point.x - 50 : point.x + 52}
            cy={point.y + 18}
            r="8"
            fill={item.type === 'experience' ? '#f8d07a' : '#a6e1d5'}
          />
          
          {/* Year text */}
          <text
            x={isEven ? point.x : point.x}
            y={point.y + 26}
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
  }, [combinedTimelineData, timelineItemHeights]);

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

  // Handle click for document-type social links
  const handleSocialLinkClick = (social) => {
    // If it's a document type with base64 data, open it in a new tab
    if (social.platform === 'document' && social.url.startsWith('data:')) {
      const newWindow = window.open();
      newWindow.document.write(`
        <iframe 
          src="${social.url}" 
          style="width:100%; height:100vh; border:none;"
          title="${social.tooltip || social.fileName || 'Document'}"
        ></iframe>
      `);
      newWindow.document.title = social.tooltip || social.fileName || 'Document';
    } else {
      // For regular links, just open the URL in a new tab
      window.open(social.url, '_blank', 'noopener,noreferrer');
    }
  };
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
//   const scrollToExperience = () => {
//     experienceSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

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
            src={project.image || projectFallbackImages[index] || ''} 
            alt={project.title}
            onError={(e) => {
              // Prevent continuous reloading by checking if we already set a fallback
              if (!e.target.dataset.usingFallback) {
                e.target.dataset.usingFallback = 'true';
                e.target.src = projectFallbackImages[index] || getRandomSvg();
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
            to={"/projects/" + project?.id}
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
        ref={el => timelineItemRefs.current[index] = el}
      >
        {/* The content card */}
        <TimelineContent itemType={item.type}>
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
            <ReactMarkdown>{item.description}</ReactMarkdown>
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

  // Filter skills groups based on search term
  const filteredSkillGroups = useMemo(() => {
    if (!userData.skillGroups) return [];
    
    return userData.skillGroups
      .map(group => {
        // Filter skills within the group based on search term
        const filteredSkills = group.skills.filter(skill => 
          skill.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Return a new group object with the filtered skills
        return {
          ...group,
          skills: filteredSkills
        };
      })
      // Filter out groups with no matching skills
      .filter(group => group.skills.length > 0);
  }, [userData.skillGroups, searchTerm]);

  // Add this function to render stars for reviews based on rating
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`full-${i}`} sx={{ color: '#f8d07a' }} />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalfIcon key="half" sx={{ color: '#f8d07a' }} />);
    }
    
    // Add empty stars to reach 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarOutlineIcon key={`empty-${i}`} sx={{ color: '#f8d07a' }} />);
    }
    
    return stars;
  };

  // Function to clear search term
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  // Function to toggle filter visibility
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  return (
    <>
      <DynamicSEO title="Home" />
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: theme.palette.background.default,
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(30, 45, 90, 0.15) 0%, rgba(30, 45, 90, 0) 70%)',
        pt: { xs: 0, md: `${appBarHeight}px` } // No padding on mobile since header is hidden
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
            <Grid item xs={12} md={6} sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
              textAlign: { xs: 'center', md: 'left' },
              transition: 'all 0.3s ease-in-out',
              mt: { xs: 2, md: 0 }
            }}>
              {
                userData.availability &&
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
              }
              
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
                {userData.featuredSkills && userData.featuredSkills.map((skill, index) => (
                  <Box 
                    key={skill.name}
                    sx={{
                      bgcolor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      // bgcolor: index === 0 ? theme.palette.primary.main : theme.palette.background.paper,
                      // color: index === 0 ? theme.palette.primary.contrastText : theme.palette.text.primary,
                      px: { xs: 1.5, sm: 2 },
                      py: 0.8,
                      // border: index !== 0 ? `1px solid ${theme.palette.divider}` : 'none',
                      border: 'none',
                      borderRadius: '20px',
                      fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                      boxShadow: theme.shadows[1],
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {skill.name}
                  </Box>
                ))}
				        <Button
                  onClick={scrollToSkills}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: '20px',
                    border: `1px solid ${theme.palette.divider}`,
                    px: { xs: 1.5, sm: 2 },
                    py: 0.8,
                    fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                    color: theme.palette.primary.main,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      borderColor: theme.palette.primary.main,
                    }
                  }}
                >
                  View All Skills
                </Button>
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
                  to="/contact"
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
                      bgcolor: theme.palette.primary.dark,
                      color: theme.palette.primary.contrastText
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
                    onClick={() => handleSocialLinkClick(social)}
                    aria-label={social.platform}
                    sx={{
                      minWidth: { xs: 32, sm: 36, md: 40 },
                      width: { xs: 32, sm: 36, md: 40 },
                      height: { xs: 32, sm: 36, md: 40 },
                      cursor: 'pointer'
                    }}
                  >
                    {getIcon(social.platform, social.tooltip || social.fileName || social.platform)}
                  </SocialButton>
                ))}
              </Stack>
            </Grid>
            
            {/* Right side stats */}
            <Grid item xs={12} md={6} sx={{ 
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
                {
                  userData.heroStats?.experience &&
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
                      {userData.heroStats.experience}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      {userData.heroStats.experience === 1 ? 'Year' : 'Years'} of Experience
                    </Typography>
                  </Box>
                }
                
                {
                  userData.projects?.length > 0 &&
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: { xs: '-20px', sm: '-25px', md: '-30px' },
                    transform: 'translateY(-50%)',
                    bgcolor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
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
                      {userData.projects.length}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      {userData.projects.length === 1 ? 'Project' : 'Projects'}
                    </Typography>
                  </Box>
                }
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
                  to="/contact"
                  variant="outlined"
                  endIcon={<NorthEastIcon fontSize={isMobile ? 'small' : 'medium'} />}
                  sx={{
                    color: theme.palette.primary.contrastText,
                    bgcolor: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                      color: theme.palette.primary.contrastText
                    },
                  }}
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
              <img src={userData.about?.image || aboutSectionSvg} alt='About' />
            </AboutImage>
          </AboutSection>
        </Container>
      </Box>
      
      {/* Skills Section - Updated to Skills Dashboard */}
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
            {/* <SkillsDashboardContainer>
            </SkillsDashboardContainer> */}
            <CompactSkills 
              skillGroups={filteredSkillGroups} 
              filterLevel={skillFilter}
            />
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

          {/* Category Tabs */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 2, md: 3 } }}>
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
              loop={filteredProjects.length > 5 ? true : false}
              navigation={true}
              spaceBetween={isMobile ? 40 : 80}
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
              modules={[EffectCoverflow, Pagination, Autoplay, Keyboard, Navigation]}
              className="mySwiper"
              style={{ height: 'auto', paddingBottom: { xs: 2, md: 6 } }}
            >
              {filteredProjects.length === 0 ? (
                <SwiperSlide key="empty" style={{ height: 'auto' }}>
                  <Box 
                    sx={{
                      flex: '0 0 auto',
                      width: { xs: '300px', md: '350px' },
                      minWidth: { xs: '300px', md: '350px' },
                      height: '100%',
                    }}
                  >
                    <ProjectCard sx={{ height: '100%', minHeight: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>No projects found</Typography>
                        <Typography variant="body2" color="text.secondary">Try another category.</Typography>
                      </Box>
                    </ProjectCard>
                  </Box>
                </SwiperSlide>
              ) : (
                filteredProjects.map((project, index) => (
                  <SwiperSlide key={index} style={{ height: 'auto' }}>
                    {renderProjectCard(project, index)}
                  </SwiperSlide>
                ))
              )}
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
