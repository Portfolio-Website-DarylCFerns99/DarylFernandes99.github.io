import { typeMapping, fileToBase64 } from '../../common/common';

import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeCookie, TOKEN_COOKIE_NAME } from '../../utils/cookieUtils';
import { toast } from 'react-toastify';

// Import API services
import { getProfile, updateProfile } from '../../api/services/userService';
import { getAllProjects, createProject, updateProject, deleteProject, updateProjectVisibility, refreshProjectData } from '../../api/services/projectService';
import { getAllReviews, deleteReview, updateReviewVisibility } from '../../api/services/reviewService';
import { createExperience, getAllExperiences, updateExperience, updateExperienceVisibility } from '../../api/services/experienceService';
import { getAllSkillGroups, createSkillGroup, updateSkillGroup, deleteSkillGroup, updateSkillGroupVisibility } from '../../api/services/skillService';

// Delete Confirmation Dialog
const DeleteConfirmationDialog = ({ open, title, onClose, onConfirm, isLoading }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        Confirm Deletion
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Are you sure you want to delete {title}? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          color="primary" 
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          disabled={isLoading}
          autoFocus
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';

// Icons
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import PersonIcon from '@mui/icons-material/Person';
import LinkIcon from '@mui/icons-material/Link';
import InfoIcon from '@mui/icons-material/Info';
import CodeIcon from '@mui/icons-material/Code';
import TimelineIcon from '@mui/icons-material/Timeline';
import AppsIcon from '@mui/icons-material/Apps';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArticleIcon from '@mui/icons-material/Article';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { THEME_MODES, getNextThemeMode } from '../../utils/themeUtils';
import { getTypeName } from '../../common/common';
import { DynamicSEO } from '../../components/SEO/DynamicSEO';

const drawerWidth = 220;

const sections = [
  { id: 'basic', name: 'Basic Info', icon: <PersonIcon /> },
  { id: 'about', name: 'About', icon: <InfoIcon /> },
  { id: 'social', name: 'Social Links', icon: <LinkIcon /> },
  { id: 'skills', name: 'Skills', icon: <CodeIcon /> },
  { id: 'timeline', name: 'Timeline', icon: <TimelineIcon /> },
  { id: 'projects', name: 'Projects', icon: <AppsIcon /> },
  { id: 'reviews', name: 'Reviews', icon: <ArticleIcon /> }
];

const DashboardPage = ({ themeMode, setThemeMode }) => {
  const navigate = useNavigate();
  const appBarRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [appBarHeight, setAppBarHeight] = useState(64); // Default height
  const [activeSection, setActiveSection] = useState('basic');
  const sectionRefs = useRef({});
  
  // Loading states
  const [loading, setLoading] = useState({
    profile: true,
    projects: true,
    reviews: true,
    experiences: true, 
    skills: true
  });

  // Error states
  const [errors, setErrors] = useState({});
  
  // Split userData into separate state objects for each section
  const [basicInfo, setBasicInfo] = useState({
    id: "",
    username: "",
    email: "",
    name: "",
    surname: "",
    title: "",
    phone: "",
    location: "",
    availability: "",
    avatar: "",
    created_at: "",
    updated_at: ""
  });
  
  const [socialLinks, setSocialLinks] = useState([]);
  
  const [aboutInfo, setAboutInfo] = useState({
    description: "",
    shortdescription: "",
    image: ""
  });

  // State for featured skills
  const [featuredSkillIds, setFeaturedSkillIds] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Additional data states
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skillGroups, setSkillGroups] = useState([]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    removeCookie(TOKEN_COOKIE_NAME);
    toast.info('You have been logged out');
    navigate('/admin');
  };

  const handleThemeToggle = () => {
    const nextMode = getNextThemeMode(themeMode);
    setThemeMode(nextMode);
  };

  // Individual save functions for each section
  const handleSaveBasicInfo = async () => {
    try {
      setLoading(prev => ({ ...prev, profile: true }));
      const updatedProfile = await updateProfile(basicInfo);
      
      // Update the basic info with any changes from the server
      const { social_links, about, ...basicInfoData } = updatedProfile;
      setBasicInfo(basicInfoData);
      
      setLoading(prev => ({ ...prev, profile: false }));
      toast.success('Basic information saved successfully!');
    } catch (error) {
      console.error('Error saving basic info:', error);
      setLoading(prev => ({ ...prev, profile: false }));
      toast.error('Failed to save basic information');
    }
  };

  const handleSaveAboutInfo = async () => {
    try {
      setLoading(prev => ({ ...prev, profile: true }));
      // Create payload with updated about info
      const payload = {
        about: aboutInfo
      };
      
      const updatedProfile = await updateProfile(payload);
      
      // Update about info with any changes from the server
      if (updatedProfile.about) {
        setAboutInfo(updatedProfile.about);
      }
      
      setLoading(prev => ({ ...prev, profile: false }));
      toast.success('About information saved successfully!');
    } catch (error) {
      console.error('Error saving about info:', error);
      setLoading(prev => ({ ...prev, profile: false }));
      toast.error('Failed to save about information');
    }
  };

  const scrollToSection = (sectionId) => {
    const sectionRef = sectionRefs.current[sectionId];
    if (sectionRef) {
      // Get the top position of the section and adjust for the app bar height
      const topPosition = sectionRef.offsetTop - appBarHeight - 16; // 16px extra padding
      window.scrollTo({
        top: topPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  // Fetch user profile data
  useEffect(() => {
    setLoading(prev => ({ ...prev, profile: true }));
    getProfile()
      .then(data => {
        data = {
          ...data,
          about: data.about ? data.about : {
            description: "",
            shortdescription: "",
            image: ""
          },
          social_links: data.social_links ? data.social_links : []
        }

        // Split the user data into separate state objects
        const { social_links, about, featured_skill_ids, ...basicInfoData } = data;
        window.document.title = `${basicInfoData.name} ${basicInfoData.surname}`;
        setBasicInfo(basicInfoData);
        setSocialLinks(social_links || []);
        setAboutInfo(about || {
          description: "",
          shortdescription: "",
          image: ""
        });
        
        // Store featured skill IDs in state if they exist
        if (featured_skill_ids && Array.isArray(featured_skill_ids)) {
          setFeaturedSkillIds(featured_skill_ids);
        }
        
        setLoading(prev => ({ ...prev, profile: false }));
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        setErrors(prev => ({ ...prev, profile: 'Failed to load profile data' }));
        setLoading(prev => ({ ...prev, profile: false }));
        toast.error('Failed to load profile data');
      });
  }, []);

  // Fetch projects data
  useEffect(() => {
    setLoading(prev => ({ ...prev, projects: true }));
    getAllProjects()
      .then(data => {
        setProjects(data);
        setLoading(prev => ({ ...prev, projects: false }));
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
        setErrors(prev => ({ ...prev, projects: 'Failed to load projects data' }));
        setLoading(prev => ({ ...prev, projects: false }));
        toast.error('Failed to load projects data');
      });
  }, []);

  // Fetch reviews data
  useEffect(() => {
    setLoading(prev => ({ ...prev, reviews: true }));
    getAllReviews()
      .then(data => {
        setReviews(data?.reviews ?? []);
        setLoading(prev => ({ ...prev, reviews: false }));
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
        setErrors(prev => ({ ...prev, reviews: 'Failed to load reviews data' }));
        setLoading(prev => ({ ...prev, reviews: false }));
        toast.error('Failed to load reviews data');
      });
  }, []);

  // Fetch experiences data
  useEffect(() => {
    setLoading(prev => ({ ...prev, experiences: true }));
    getAllExperiences()
      .then(data => {
        setExperiences(data);
        setLoading(prev => ({ ...prev, experiences: false }));
      })
      .catch(error => {
        console.error('Error fetching experiences:', error);
        setErrors(prev => ({ ...prev, experiences: 'Failed to load experiences data' }));
        setLoading(prev => ({ ...prev, experiences: false }));
        toast.error('Failed to load experiences data');
      });
  }, []);

  // Fetch skill groups data
  useEffect(() => {
    setLoading(prev => ({ ...prev, skills: true }));
    getAllSkillGroups()
      .then(data => {
        setSkillGroups(data);
        setLoading(prev => ({ ...prev, skills: false }));
      })
      .catch(error => {
        console.error('Error fetching skill groups:', error);
        setErrors(prev => ({ ...prev, skills: 'Failed to load skills data' }));
        setLoading(prev => ({ ...prev, skills: false }));
        toast.error('Failed to load skills data');
      });
  }, []);
  
  // Effect to match featured skill IDs with actual skill objects
  // This runs whenever either featuredSkillIds or skillGroups changes
  useEffect(() => {
    // Only proceed if both data are available
    if (featuredSkillIds.length > 0 && skillGroups.length > 0) {
      // Create a flat array of all skills with their group names
      const allSkills = [];
      skillGroups.forEach(group => {
        if (group.skills && Array.isArray(group.skills)) {
          group.skills.forEach(skill => {
            allSkills.push({
              ...skill,
              groupName: group.name
            });
          });
        }
      });
      
      // Find the skills that match the featured skill IDs
      const matchedSkills = allSkills.filter(skill => 
        featuredSkillIds.includes(skill.id)
      );
      
      // Set the selected skills
      setSelectedSkills(matchedSkills);
    }
  }, [featuredSkillIds, skillGroups]);
  
  // Update the section visibility detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + appBarHeight + 100; // Add some offset for better detection
      
      // Find which section is currently visible
      let currentSection = 'basic'; // Default
      let closestDistance = Infinity;
      
      Object.entries(sectionRefs.current).forEach(([sectionId, ref]) => {
        if (ref) {
          const distance = Math.abs(ref.offsetTop - scrollPosition);
          // If this section is closer to the current scroll position
          if (distance < closestDistance) {
            closestDistance = distance;
            currentSection = sectionId;
          }
        }
      });
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check when page loads
    setTimeout(handleScroll, 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, appBarHeight]);

  const drawer = (
    <Box sx={{ bgcolor: 'background.paper', height: '100%', pt: { xs: `${appBarHeight}px`, sm: `${appBarHeight}px`, md: 0 } }}>
      <List>
        {sections.map((section) => (
          <ListItem key={section.id} disablePadding>
            <ListItemButton
              selected={activeSection === section.id}
              onClick={() => scrollToSection(section.id)}
              sx={{
                m: 0.5,
                borderRadius: 1,
                bgcolor: activeSection === section.id ? 'primary.main' : 'background.paper',
                color: activeSection === section.id ? 'white' : 'text.primary',
                '&:hover': {
                  bgcolor: activeSection === section.id ? 'primary.dark' : 'action.hover',
                },
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: activeSection === section.id ? 'white' : 'inherit', 
                minWidth: 40 
              }}>
                {section.icon}
              </ListItemIcon>
              <ListItemText primary={section.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  useEffect(() => {
      // Update appBar height when component mounts
      if (appBarRef.current) {
          setAppBarHeight(appBarRef.current.clientHeight);
      }
      
      // Optional: Add resize listener to handle dynamic changes
      const handleResize = () => {
          if (appBarRef.current) {
              setAppBarHeight(appBarRef.current.clientHeight);
          }
      };
      
      // Add event listener to window object
      if (typeof window !== 'undefined') {
          window.addEventListener('resize', handleResize);
          return () => {
              window.removeEventListener('resize', handleResize);
          };
      }
      return undefined;
  }, []);

  // Helper function to get theme icon
  const getThemeIcon = () => {
    switch (themeMode) {
      case THEME_MODES.LIGHT:
        return <LightModeIcon />;
      case THEME_MODES.DARK:
        return <DarkModeIcon />;
      case THEME_MODES.SYSTEM:
        return <SettingsBrightnessIcon />;
      default:
        return <SettingsBrightnessIcon />;
    }
  };

  return (
    <Fragment>
      <DynamicSEO title="Admin" noIndex={true} />
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" ref={appBarRef} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Portfolio Admin Dashboard
            </Typography>
            <IconButton color="inherit" onClick={handleThemeToggle}>
              {getThemeIcon()}
            </IconButton>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop permanent drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'none', md: 'block' },
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
          open
        >
          <Toolbar />
          {drawer}
        </Drawer>
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 1, sm: 2, md: 3 },  // Responsive padding
            width: '100%',  // Full width
            maxWidth: '100%',  // Constrain to viewport
            overflowX: 'hidden',  // Prevent horizontal scroll
            bgcolor: 'background.default',
            minHeight: '100vh'
          }}
        >
          <Toolbar />
          
          {/* Basic Info Section */}
          <Paper 
            sx={{ p: 2, mb: 4 }}
            ref={(el) => sectionRefs.current['basic'] = el}
            id="basic-section"
          >
            <Typography variant="h5" gutterBottom>
              {sections.find(s => s.id === 'basic')?.name || 'Basic Info'}
            </Typography>
            {loading.profile ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography>Loading profile data...</Typography>
              </Box>
            ) : errors.profile ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography color="error">{errors.profile}</Typography>
              </Box>
            ) : (
              <BasicInfoSection basicInfo={basicInfo} setBasicInfo={setBasicInfo} onSave={handleSaveBasicInfo} />
            )}
          </Paper>
          
          {/* About Section */}
          <Paper 
            sx={{ p: 2, mb: 4 }}
            ref={(el) => sectionRefs.current['about'] = el}
            id="about-section"
          >
            <Typography variant="h5" gutterBottom>
              {sections.find(s => s.id === 'about')?.name || 'About'}
            </Typography>
            {loading.profile ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography>Loading about data...</Typography>
              </Box>
            ) : errors.profile ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography color="error">{errors.profile}</Typography>
              </Box>
            ) : (
              <AboutSection aboutInfo={aboutInfo} setAboutInfo={setAboutInfo} onSave={handleSaveAboutInfo} />
            )}
          </Paper>
          
          {/* Social Links Section */}
          <Paper 
            sx={{ p: 2, mb: 4 }}
            ref={(el) => sectionRefs.current['social'] = el}
            id="social-section"
          >
            <Typography variant="h5" gutterBottom>
              {sections.find(s => s.id === 'social')?.name || 'Social Links'}
            </Typography>
            {loading.profile ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography>Loading social links data...</Typography>
              </Box>
            ) : errors.profile ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography color="error">{errors.profile}</Typography>
              </Box>
            ) : (
              <SocialLinksSection socialLinks={socialLinks} setSocialLinks={setSocialLinks} />
            )}
          </Paper>
          
          {/* Skills Section */}
          <Paper 
          sx={{ p: 2, mb: 4 }}
          ref={(el) => sectionRefs.current['skills'] = el}
          id="skills-section"
          >
          <Typography variant="h5" gutterBottom>
          {sections.find(s => s.id === 'skills')?.name || 'Skills'}
          </Typography>
          {loading.skills ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography>Loading skills data...</Typography>
          </Box>
          ) : errors.skills ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography color="error">{errors.skills}</Typography>
          </Box>
          ) : (
          <SkillsSection 
              skillGroups={skillGroups} 
                  setSkillGroups={setSkillGroups} 
                  selectedSkills={selectedSkills}
                  setSelectedSkills={setSelectedSkills}
                />
              )}
          </Paper>
          
          {/* Timeline Section */}
          <Paper 
            sx={{ p: 2, mb: 4 }}
            ref={(el) => sectionRefs.current['timeline'] = el}
            id="timeline-section"
          >
            <Typography variant="h5" gutterBottom>
              {sections.find(s => s.id === 'timeline')?.name || 'Timeline'}
            </Typography>
            {loading.experiences ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography>Loading timeline data...</Typography>
              </Box>
            ) : errors.experiences ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography color="error">{errors.experiences}</Typography>
              </Box>
            ) : (
              <TimelineSection experiences={experiences} setExperiences={setExperiences} />
            )}
          </Paper>
          
          {/* Projects Section */}
          <Paper 
            sx={{ p: 2, mb: 4 }}
            ref={(el) => sectionRefs.current['projects'] = el}
            id="projects-section"
          >
            <Typography variant="h5" gutterBottom>
              {sections.find(s => s.id === 'projects')?.name || 'Projects'}
            </Typography>
            {loading.projects ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography>Loading projects data...</Typography>
              </Box>
            ) : errors.projects ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography color="error">{errors.projects}</Typography>
              </Box>
            ) : (
              <ProjectsSection projects={projects} setProjects={setProjects} />
            )}
          </Paper>

          {/* Reviews Section */}
          <Paper 
            sx={{ p: 2 }}
            ref={(el) => sectionRefs.current['reviews'] = el}
            id="reviews-section"
          >
            <Typography variant="h5" gutterBottom>
              {sections.find(s => s.id === 'reviews')?.name || 'Reviews'}
            </Typography>
            {loading.reviews ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography>Loading reviews data...</Typography>
              </Box>
            ) : errors.reviews ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography color="error">{errors.reviews}</Typography>
              </Box>
            ) : (
              <ReviewsSection reviews={reviews} setReviews={setReviews} />
            )}
          </Paper>
        </Box>
      </Box>
    </Fragment>
  );
};

// Section components
const BasicInfoSection = ({ basicInfo, setBasicInfo, onSave }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Phone validation and formatting
  const [phoneError, setPhoneError] = useState('');
  // Country code state
  const [countryCode, setCountryCode] = useState(basicInfo.phone?.startsWith('+') ? basicInfo.phone.split(' ')[0] : '+1');

  // Format just the phone part (without country code)
  const formatPhoneNumber = (phoneNumber) => {
    // Remove all non-digit characters for processing
    const digitsOnly = phoneNumber.replace(/[^\d]/g, '');
    
    // Handle empty input
    if (!digitsOnly) return '';
    
    // Format based on length
    if (digitsOnly.length <= 3) {
      return digitsOnly;
    } else if (digitsOnly.length <= 6) {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
    } else if (digitsOnly.length <= 10) {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
    } else {
      // If more than 10 digits, assume the extra digits are an extension
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)} ext ${digitsOnly.slice(10)}`;
    }
  };

  // Extract phone number without country code from the combined phone
  const extractPhoneWithoutCode = (fullPhone) => {
    if (!fullPhone) return '';
    
    // If it starts with +, remove country code
    if (fullPhone.startsWith('+')) {
      const parts = fullPhone.split(' ');
      if (parts.length > 1) {
        return parts.slice(1).join(' ');
      }
      return '';
    }
    
    return fullPhone;
  };

  const validatePhone = (phoneNumber) => {
    // We're now just validating the phone part without the country code
    const phoneRegex = /^\(([0-9]{3})\)\s([0-9]{3})\-([0-9]{4})(\sext\s[0-9]+)?$/;
    
    if (!phoneNumber) return true; // Empty is valid (not required)
    return phoneRegex.test(phoneNumber);
  };

  const handleCountryCodeChange = (e) => {
    const { value } = e.target;
    setCountryCode(value);
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    
    // Keep cursor position stable during formatting
    const cursorPosition = e.target.selectionStart;
    const previousValue = extractPhoneWithoutCode(basicInfo.phone) || '';
    const previousValueLength = previousValue.length;
    
    // Format the phone number
    const formattedValue = formatPhoneNumber(value);
    
    // Combine country code with formatted phone for storage
    const combinedPhone = formattedValue ? `${countryCode} ${formattedValue}` : countryCode;
    
    // Update the state
    setBasicInfo(prev => ({
      ...prev,
      phone: combinedPhone
    }));
    
    // Validate the phone number
    setPhoneError(validatePhone(formattedValue) ? '' : 'Please enter a valid phone number');
    
    // Adjust cursor position after React updates the DOM
    setTimeout(() => {
      // Only set cursor position if input is still focused
      if (e.target === document.activeElement) {
        // Calculate new cursor position
        const valueAddedLength = formattedValue.length - previousValueLength;
        const newPosition = Math.min(cursorPosition + valueAddedLength, formattedValue.length);
        e.target.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  // Make sure the phone is properly split when the component mounts or when userData changes
  useEffect(() => {
    if (basicInfo.phone) {
      if (basicInfo.phone.startsWith('+')) {
        const parts = basicInfo.phone.split(' ');
        if (parts.length > 0) {
          setCountryCode(parts[0]);
        }
      }
    }
  }, [basicInfo.id]); // Only run when user ID changes (new user loaded)

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Convert the selected image to base64
        const base64 = await fileToBase64(file);
        // Update the basicInfo state with the base64 image
        setBasicInfo(prev => ({
          ...prev,
          avatar: base64
        }));
        toast.success('Avatar uploaded successfully!');
      } catch (error) {
        console.error('Error converting image to base64:', error);
        toast.error('Failed to upload avatar');
      }
    }
  };

  // Create a hidden file input element for avatar upload
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Avatar
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              width: 150,
              height: 150,
              bgcolor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {basicInfo.avatar ? (
              <img src={basicInfo.avatar} alt="User avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: '#868e96',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PersonIcon sx={{ fontSize: 40, color: '#adb5bd' }} />
              </Box>
            )}
          </Box>
          {/* Hidden file input for avatar upload */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleAvatarUpload}
          />
          <Button
            variant="contained"
            color="secondary"
            sx={{ my: 2, color: 'white' }}
            onClick={triggerFileInput}
          >
            Upload Avatar
          </Button>
          {basicInfo.avatar && (
            <Button
              variant="outlined"
              color="error"
              sx={{ ml: 2, my: 2 }}
              onClick={() => setBasicInfo(prev => ({ ...prev, avatar: '' }))}
            >
              Remove Avatar
            </Button>
          )}
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={basicInfo.name}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Surname"
            name="surname"
            value={basicInfo.surname}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={basicInfo.username}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={basicInfo.title}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Contact Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={basicInfo.email}
            margin="normal"
            variant="outlined"
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            {/* Country code field */}
            <TextField
              label="Country Code"
              value={countryCode}
              onChange={handleCountryCodeChange}
              margin="normal"
              variant="outlined"
              placeholder="+1"
              sx={{ width: '30%', minWidth: '80px' }}
            />
            {/* Phone number field */}
            <TextField
              fullWidth
              label="Phone Number"
              value={extractPhoneWithoutCode(basicInfo.phone)}
              onChange={handlePhoneChange}
              margin="normal"
              variant="outlined"
              error={!!phoneError}
              helperText={phoneError || "Format: (123) 456-7890"}
              placeholder="(123) 456-7890"
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={basicInfo.location}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Availability"
            name="availability"
            value={basicInfo.availability}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="outlined" 
          color="inherit"
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={onSave}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Save
        </Button>
      </Box>
    </>
  );
};

const SocialLinksSection = ({ socialLinks, setSocialLinks }) => {
  // State for the form to add/edit a social link
  const [newLink, setNewLink] = useState({
    platform: "",
    url: "",
    tooltip: ""
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    item: null,
    index: -1
  });

  const handleAddLink = () => {
    const firstType = Object.keys(typeMapping)?.[0];
    setNewLink({ platform: firstType, url: "", tooltip: typeMapping?.[firstType]?.tooltip });
    setEditIndex(-1);
    setShowForm(true);
  };

  const handleEditLink = (index) => {
    const tempData = socialLinks[index]
    if (typeMapping?.[tempData?.platform]?.inputType !== "link")
      tempData.url = ""
    setNewLink({ ...socialLinks[index] });
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDeleteClick = (index) => {
    setDeleteDialog({
      open: true,
      item: socialLinks[index],
      index: index
    });
  };

  const handleDeleteConfirm = async () => {
    const { index } = deleteDialog;
    if (index === -1) return;
    
    setLoading(true);
    try {
      // Create updated array without the deleted link
      const updatedLinks = [...socialLinks];
      updatedLinks.splice(index, 1);
      
      // Update API directly
      const payload = {
        social_links: updatedLinks
      };
      
      const updatedProfile = await updateProfile(payload);
      
      // Update state with response from server
      if (updatedProfile.social_links) {
        setSocialLinks(updatedProfile.social_links);
      }
      
      toast.success('Social link deleted successfully');
    } catch (error) {
      console.error('Error deleting social link:', error);
      toast.error('Failed to delete social link');
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false, item: null, index: -1 });
    }
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, item: null, index: -1 });
  };

  const handleLinkChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "platform") {
      const firstType = typeMapping[value];
      setNewLink({ platform: value, url: "", tooltip: firstType?.tooltip });
    } else if (name === "url" && files && files.length > 0) {
      // For file inputs, store the file object itself
      const file = files[0];
      setNewLink(prev => ({ 
        ...prev, 
        [name]: file, 
        fileName: file.name // Store the filename separately
      }));
    } else {
      setNewLink(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveLink = async () => {
    setLoading(true);
    try {
      // Create a copy of the new link object
      const linkToSave = { ...newLink };
      
      // If the URL is a file object, process it
      if (linkToSave.url instanceof File) {
        try {
          // Store the filename for display in the table
          linkToSave.fileName = linkToSave.url.name;
          
          // Convert file to base64
          linkToSave.url = await fileToBase64(linkToSave.url);
          
          console.log(`File prepared for upload: ${linkToSave.fileName}`);
        } catch (error) {
          console.error('Error processing file:', error);
          toast.error('Failed to process file');
          setLoading(false);
          return;
        }
      }
      
      // Create updated links array
      const updatedLinks = [...socialLinks];
      if (editIndex >= 0) {
        updatedLinks[editIndex] = linkToSave;
      } else {
        updatedLinks.push(linkToSave);
      }
      
      // Update API directly
      const payload = {
        social_links: updatedLinks
      };
      
      const updatedProfile = await updateProfile(payload);
      
      // Update state with response from server
      if (updatedProfile.social_links) {
        setSocialLinks(updatedProfile.social_links);
      }
      
      toast.success(`Social link ${editIndex >= 0 ? 'updated' : 'added'} successfully`);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving social link:', error);
      toast.error(`Failed to ${editIndex >= 0 ? 'update' : 'add'} social link`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell width="120px">Actions</TableCell>
            <TableCell>Platform</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Tooltip</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {socialLinks.map((link, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: '2px' }}>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteClick(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleEditLink(index)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  {link.platform && typeMapping[link.platform]?.icon ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {React.createElement(typeMapping[link.platform].icon, { fontSize: 'small', color: 'action' })}
                      {typeMapping[link.platform]?.name || link.platform}
                    </Box>
                  ) : (
                    typeMapping[link.platform]?.name || link.platform
                  )}
                </TableCell>
                <TableCell>
                  {link.url instanceof File ? link.fileName : 
                   (link.fileName || (typeof link.url === 'string' ? link.url : 'File uploaded'))}
                </TableCell>
                <TableCell>{link.tooltip || ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {showForm && (
        <Card sx={{ mt: 2, p: 2, bgcolor: 'background.default' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Platform"
                name="platform"
                value={newLink.platform}
                onChange={handleLinkChange}
                margin="normal"
                variant="outlined"
                required
              >
                {Object.entries(typeMapping).map(([key, { name }]) => (
                  <MenuItem key={key} value={key}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>`
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={(typeMapping[newLink.platform]?.inputType === 'file' ? 'File' : 'URL')}
                name="url"
                value={typeMapping[newLink.platform]?.inputType === 'file' ? '' : newLink.url}
                onChange={handleLinkChange}
                margin="normal"
                variant="outlined"
                type={typeMapping[newLink.platform]?.inputType === 'file' ? 'file' : 'url'}
                InputLabelProps={{ 
                  shrink: typeMapping[newLink.platform]?.inputType === 'file' ? true : undefined 
                }}
                inputProps={{
                  accept: typeMapping[newLink.platform]?.inputType === 'file' ? '.pdf,.doc,.docx,.txt,.rtf' : undefined
                }}
                required
              />
              {typeMapping[newLink.platform]?.inputType === 'file' && newLink.fileName && (
                <Typography variant="caption" display="block" gutterBottom>
                  Selected file: {newLink.fileName}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tooltip (optional)"
                name="tooltip"
                value={newLink.tooltip || typeMapping[newLink.platform]?.tooltip}
                onChange={handleLinkChange}
                margin="normal"
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                placeholder={`Text to appear on hover`}
                helperText="Optional: Text to appear on hover"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  color="inherit"
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleSaveLink}
                  disabled={loading || !newLink.platform || 
                    (typeMapping[newLink.platform]?.inputType === 'file' 
                      ? !(newLink.url instanceof File) 
                      : !newLink.url)}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  {loading ? (
                    <span>Saving...</span>
                  ) : (
                    <span>{editIndex >= 0 ? 'Update' : 'Add'} Link</span>
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      )}
      
      {!showForm && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={handleAddLink}
        >
          <AddIcon color="success" />
          <Typography color="success.main" sx={{ ml: 1 }}>
            Add Social Link
          </Typography>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        title={deleteDialog.item ? `the ${typeMapping[deleteDialog.item.platform]?.name || 'social link'}` : 'this social link'}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        isLoading={loading}
      />
    </>
  );
};

const AboutSection = ({ aboutInfo, setAboutInfo, onSave }) => {
  const handleAboutChange = (e) => {
    const { name, value } = e.target;
    
    // Apply character limits
    let limitedValue = value;
    if (name === 'shortdescription' && value.length > 200) {
      limitedValue = value.slice(0, 200);
    } else if (name === 'description' && value.length > 500) {
      limitedValue = value.slice(0, 500);
    }
    
    setAboutInfo(prev => ({
      ...prev,
      [name]: limitedValue
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Convert the selected image to base64
        const base64 = await fileToBase64(file);
        
        setAboutInfo(prev => ({
          ...prev,
          image: base64
        }));
        toast.success('About image uploaded successfully!');
      } catch (error) {
        console.error('Error converting image to base64:', error);
        toast.error('Failed to upload about image');
      }
    }
  };
  
  // Create a hidden file input element for about image upload
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Short Description"
            name="shortdescription"
            value={aboutInfo?.shortdescription || ''}
            onChange={handleAboutChange}
            margin="normal"
            variant="outlined"
            multiline
            rows={2}
            inputProps={{
              maxLength: 200
            }}
            helperText={`${aboutInfo?.shortdescription?.length || 0}/200 characters`}
            placeholder="Brief introduction (1-2 lines)"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full Description"
            name="description"
            value={aboutInfo?.description || ''}
            onChange={handleAboutChange}
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            inputProps={{
              maxLength: 500
            }}
            helperText={`${aboutInfo?.description?.length || 0}/500 characters`}
            placeholder="Detailed about me section (bio, background, etc.)"
          />
        </Grid>
      </Grid>
      
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        About Image
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            width: 250,
            height: 150,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
            overflow: 'hidden'
          }}
        >
          {aboutInfo?.image ? (
            <img 
              src={aboutInfo.image} 
              alt="About section" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <AddIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
          )}
        </Box>
        {/* Hidden file input for about image upload */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleImageUpload}
        />
        <Button 
          variant="contained" 
          color="secondary" 
          size="small" 
          sx={{ color: 'white' }}
          onClick={triggerFileInput}
        >
          Upload Image
        </Button>
        {aboutInfo?.image && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            sx={{ ml: 2 }}
            onClick={() => setAboutInfo(prev => ({ ...prev, image: '' }))}
          >
            Remove Image
          </Button>
        )}
      </Box>
      
      <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="outlined" 
          color="inherit"
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={onSave}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Save
        </Button>
      </Box>
    </>
  );
};

const SkillsSection = ({ skillGroups, setSkillGroups, selectedSkills, setSelectedSkills }) => {  
  // Get all skills from all skill groups
  const allSkills = React.useMemo(() => {
    const skills = [];
    skillGroups.forEach(group => {
      if (group.skills && Array.isArray(group.skills)) {
        group.skills.forEach(skill => {
          skills.push({
            ...skill,
            groupName: group.name
          });
        });
      }
    });
    return skills;
  }, [skillGroups]);
  
  // Handle submit function for the skills selection
  const handleSubmitSelectedSkills = async () => {
    try {
      // Get just the IDs from the selected skills
      const selectedSkillIds = selectedSkills.map(skill => skill.id);
      
      // Create the payload with only the featured_skill_ids
      const payload = {
        featured_skill_ids: selectedSkillIds
      };
      
      // Make the PUT request to update the user profile
      const response = await updateProfile(payload);
      
      // Show success message
      toast.success('Featured skills updated successfully!');
      
      console.log('Updated profile with featured skills:', response);
    } catch (error) {
      console.error('Error updating featured skills:', error);
      toast.error('Failed to update featured skills');
    }
  };
  
  // State for the form to add/edit a skill group
  const [newSkillGroup, setNewSkillGroup] = useState({
    name: "",
    skills: [],
    is_visible: false // Default to false as requested
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    item: null,
    index: -1
  });
  
  // State for the skill being added
  const [currentSkill, setCurrentSkill] = useState({
    name: "",
    proficiency: 1
  });
  
  // Helper function to get color based on proficiency level
  const getProficiencyColor = (proficiency) => {
    switch (parseInt(proficiency, 10)) {
      case 1: return 'default';
      case 2: return 'primary';
      case 3: return 'success';
      case 4: return 'warning';
      case 5: return 'error';
      default: return 'default';
    }
  };

  // Helper function to get label based on proficiency level
  const getProficiencyLabel = (proficiency) => {
    const level = parseInt(proficiency, 10);
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Basic';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return `Level ${level}`;
    }
  };

  const handleAddSkillGroup = () => {
    setNewSkillGroup({
      name: "",
      skills: [],
      is_visible: false
    });
    setEditIndex(-1);
    setShowForm(true);
  };

  const handleEditSkillGroup = (index) => {
    setNewSkillGroup({...skillGroups[index]});
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDeleteSkillGroup = async (index) => {
    const groupToDelete = skillGroups[index];
    setDeleteDialog({
      open: true,
      item: groupToDelete,
      index: index
    });
  };
  
  const handleDeleteConfirm = async () => {
    const { item, index } = deleteDialog;
    if (!item) return;
    
    try {
      setLoading(true);
      
      if (item.id) {
        // Item is saved in the database - use the DELETE endpoint
        await deleteSkillGroup(item.id);
        
        // Update local state
        const updatedGroups = [...skillGroups];
        updatedGroups.splice(index, 1);
        setSkillGroups(updatedGroups);
        
        toast.success('Skill group deleted successfully');
      } else {
        // Item is not yet saved in the database
        // Just remove it from local state
        const updatedGroups = [...skillGroups];
        updatedGroups.splice(index, 1);
        setSkillGroups(updatedGroups);
        
        toast.success('Skill group removed');
      }
    } catch (error) {
      console.error('Error deleting skill group:', error);
      toast.error('Failed to delete skill group');
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false, item: null, index: -1 });
    }
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, item: null, index: -1 });
  };

  const handleToggleVisibility = async (index, isVisible) => {
    const groupToUpdate = skillGroups[index];
    
    // Update local state first for immediate UI feedback
    const updatedGroups = [...skillGroups];
    updatedGroups[index] = {
      ...updatedGroups[index],
      is_visible: isVisible
    };
    setSkillGroups(updatedGroups);
    
    if (!groupToUpdate.id) return; // Not saved to backend yet
    
    try {
      await updateSkillGroupVisibility(groupToUpdate.id, isVisible);
    } catch (error) {
      console.error('Error updating skill group visibility:', error);
      toast.error('Failed to update visibility');
      
      // Revert local state on error
      updatedGroups[index] = {
        ...updatedGroups[index],
        is_visible: !isVisible
      };
      setSkillGroups(updatedGroups);
    }
  };

  const handleSkillGroupChange = (e) => {
    const { name, value, checked } = e.target;
    setNewSkillGroup(prev => ({
      ...prev,
      [name]: name === 'is_visible' ? checked : value
    }));
  };
  
  const handleSkillChange = (e) => {
    const { name, value } = e.target;
    setCurrentSkill(prev => ({
      ...prev,
      [name]: name === 'proficiency' ? parseInt(value, 10) : value
    }));
  };
  
  // Adding skills to the group
  const handleAddSkill = () => {
    if (currentSkill.name.trim() === '') return;
    
    // Add the skill if it's not already in the array
    const skillExists = newSkillGroup.skills.some(skill => 
      skill.name.toLowerCase() === currentSkill.name.trim().toLowerCase()
    );
    
    if (!skillExists) {
      setNewSkillGroup(prev => ({
        ...prev,
        skills: [...prev.skills, {...currentSkill}]
      }));
    } else {
      toast.warning('This skill already exists in this group');
    }
    
    // Reset current skill form
    setCurrentSkill({
      name: "",
      proficiency: 1
    });
  };
  
  const handleRemoveSkill = (index) => {
    setNewSkillGroup(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSaveSkillGroup = async () => {
    if (newSkillGroup.name.trim() === '') return;
    
    try {
      setLoading(true);
      let savedGroup;
      
      if (editIndex >= 0 && skillGroups[editIndex].id) {
        // Update existing group
        const response = await updateSkillGroup(skillGroups[editIndex].id, newSkillGroup);
        savedGroup = response.data;
      } else {
        // Create new group
        const response = await createSkillGroup(newSkillGroup);
        savedGroup = response.data;
      }
      
      const updatedGroups = [...skillGroups];
      if (editIndex >= 0) {
        updatedGroups[editIndex] = savedGroup;
      } else {
        updatedGroups.push(savedGroup);
      }
      
      setSkillGroups(updatedGroups);
      setShowForm(false);
      toast.success(`Skill group ${editIndex >= 0 ? 'updated' : 'created'} successfully`);
      setLoading(false);
    } catch (error) {
      console.error('Error saving skill group:', error);
      toast.error(`Failed to ${editIndex >= 0 ? 'update' : 'create'} skill group`);
      setLoading(false);
    }
  };
  
  // Function to save all skill groups (used by the main save button)
  const handleSaveAllSkillGroups = async () => {
    try {
      setLoading(true);
      
      // Save any unsaved skill groups
      const unsavedGroups = skillGroups.filter(group => !group.id);
      for (const group of unsavedGroups) {
        await createSkillGroup(group);
      }
      
      // Refresh the skill groups list
      const updatedGroups = await getAllSkillGroups();
      setSkillGroups(updatedGroups);
      
      toast.success('All skill groups saved successfully');
      setLoading(false);
    } catch (error) {
      console.error('Error saving all skill groups:', error);
      toast.error('Failed to save all skill groups');
      setLoading(false);
    }
  };

  return (
    <>
      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell width="120px">Actions</TableCell>
              <TableCell width="240px">Group Name</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell width="60px">Visible</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skillGroups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No skill groups found
                </TableCell>
              </TableRow>
            ) : skillGroups.map((group, index) => (
              <TableRow key={group.id || `group_${index}`}>
                <TableCell>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: '2px' }}>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteSkillGroup(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleEditSkillGroup(index)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>{group.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {group.skills && group.skills.length > 0 ? group.skills.map((skill, idx) => (
                      <Chip
                      key={idx}
                      label={`${skill.name} (${skill.proficiency}/5)`}
                      size="small"
                      color={getProficiencyColor(skill.proficiency)}
                      sx={{ my: 0.25 }}
                      />
                    )) : (
                      <Typography color="text.secondary">No skills</Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Switch 
                  checked={group.is_visible} 
                  color="success" 
                  onChange={(e) => handleToggleVisibility(index, e.target.checked)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {showForm && (
        <Card sx={{ mt: 2, p: 2, bgcolor: 'background.default' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Group Name"
                name="name"
                value={newSkillGroup.name}
                onChange={handleSkillGroupChange}
                margin="normal"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 1 }}>Visible</Typography>
                <Switch
                  name="is_visible"
                  checked={newSkillGroup.is_visible}
                  onChange={handleSkillGroupChange}
                  color="success"
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Skills
              </Typography>
              {newSkillGroup.skills.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {newSkillGroup.skills.map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={`${skill.name} (${skill.proficiency}/5)`}
                      size="small"
                      color={getProficiencyColor(skill.proficiency)}
                      onDelete={() => handleRemoveSkill(idx)}
                      sx={{ my: 0.5 }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  No skills added yet
                </Typography>
              )}
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 1, mb: 2 }}>
                <TextField
                  label="Skill Name"
                  name="name"
                  value={currentSkill.name}
                  onChange={handleSkillChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}
                />
                <Box sx={{ display: 'flex', width: { xs: '100%', sm: 'auto' }, alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>Proficiency:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {[1, 2, 3, 4, 5].map(level => (
                      <Chip
                        key={level}
                        label={level}
                        size="small"
                        color={level === currentSkill.proficiency ? getProficiencyColor(level) : 'default'}
                        onClick={() => setCurrentSkill(prev => ({ ...prev, proficiency: level }))}
                        sx={{
                          cursor: 'pointer',
                          fontWeight: level === currentSkill.proficiency ? 'bold' : 'normal',
                          opacity: level === currentSkill.proficiency ? 1 : 0.7
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleAddSkill}
                  disabled={!currentSkill.name.trim()}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Add Skill
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  color="inherit"
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleSaveSkillGroup}
                  disabled={loading || !newSkillGroup.name.trim() || newSkillGroup.skills.length === 0}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  {loading ? 'Saving...' : (editIndex >= 0 ? 'Update' : 'Add') + ' Skill Group'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      )}
      
      {!showForm && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={handleAddSkillGroup}
        >
          <AddIcon color="success" />
          <Typography color="success.main" sx={{ ml: 1 }}>
            Add Skill Group
          </Typography>
        </Box>
      )}

      
      {/* Skills Selection Card */}
      <Card sx={{ p: 2, my: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          Select Featured Skills (Max 4)
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="skill-selection"
              options={allSkills}
              value={selectedSkills}
              onChange={(event, newValue) => {
                // Limit to maximum 4 skills
                if (newValue.length <= 4) {
                  setSelectedSkills(newValue);
                } else {
                  toast.warning('Maximum 4 skills can be selected');
                }
              }}
              getOptionLabel={(option) => option.name}
              groupBy={(option) => option.groupName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Skills"
                  placeholder={selectedSkills.length >= 4 ? '' : 'Select a skill'}
                  helperText={`${selectedSkills.length}/4 skills selected`}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={`${option.name} (${option.proficiency}/5)`}
                    size="small"
                    color={getProficiencyColor(option.proficiency)}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitSelectedSkills}
              disabled={selectedSkills.length === 0}
            >
              Submit Selected Skills
            </Button>
          </Grid>
        </Grid>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        title={deleteDialog.item ? `the skill group "${deleteDialog.item.name}"` : 'this skill group'}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        isLoading={loading}
      />
    </>
  );
};

const TimelineSection = ({ experiences, setExperiences }) => {
  const [tab, setTab] = useState('experience');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    item: null,
    type: ''
  });
  const [searchText, setSearchText] = useState('');
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'start_date', direction: 'desc' });
  
  // Initialize filteredExperiences with all experiences when component mounts
  useEffect(() => {
    setFilteredExperiences(experiences);
  }, [experiences]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort experiences
  useEffect(() => {
    let result = experiences.filter(exp => exp.type === tab);

    // Apply search filter
    if (searchText) {
      const lowercasedFilter = searchText.toLowerCase();
      result = result.filter(experience => {
        return (
          experience.title?.toLowerCase().includes(lowercasedFilter) ||
          experience.organization?.toLowerCase().includes(lowercasedFilter) ||
          experience.description?.toLowerCase().includes(lowercasedFilter)
        );
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortConfig.key === 'start_date' || sortConfig.key === 'end_date') {
        const dateA = new Date(a[sortConfig.key] || '9999-12-31'); // Use far future date for null end dates
        const dateB = new Date(b[sortConfig.key] || '9999-12-31');
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
      const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
      
      if (sortConfig.direction === 'asc') {
        return aValue.localeCompare(bValue);
      }
      return bValue.localeCompare(aValue);
    });

    setFilteredExperiences(result);
  }, [experiences, searchText, sortConfig, tab]);
  
  // New entry template
  const emptyEntry = {
    type: tab, // 'experience' or 'education'
    title: '',
    organization: '',
    start_date: '',
    end_date: '',
    description: '',
    is_visible: true
  };
  
  const [newEntry, setNewEntry] = useState(emptyEntry);
  
  // Update the newEntry.type when tab changes
  useEffect(() => {
    setNewEntry(prev => ({
      ...prev,
      type: tab
    }));
  }, [tab]);
  
  const handleTabChange = (newTab) => {
    if (showForm) {
      // If form is open, show confirmation
      if (window.confirm('Changing tabs will discard unsaved changes. Continue?')) {
        setTab(newTab);
        setShowForm(false);
        setEditingItem(null);
      }
    } else {
      setTab(newTab);
    }
  };
  
  const handleAddEntry = () => {
    setEditingItem(null);
    setNewEntry({
      ...emptyEntry,
      type: tab
    });
    setShowForm(true);
  };
  
  const handleEditEntry = (entry) => {
    setEditingItem(entry.id);
    setNewEntry({
      ...entry,
      // Format dates to YYYY-MM-DD for input fields
      start_date: entry.start_date ? formatDateForInput(entry.start_date) : '',
      end_date: entry.end_date ? formatDateForInput(entry.end_date) : ''
    });
    setShowForm(true);
  };
  
  // Format date string to YYYY-MM-DD for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };
  
  const handleDeleteClick = (entry) => {
    setDeleteDialog({
      open: true,
      item: entry,
      type: entry.type === 'experience' ? 'experience' : 'education'
    });
  };
  
  const handleDeleteConfirm = async () => {
    const { item } = deleteDialog;
    if (!item) return;
    
    setLoading(true);
    try {
      // API call to delete would go here
      // await deleteExperience(item.id);
      
      // Update local state
      setExperiences(prev => prev.filter(exp => exp.id !== item.id));
      toast.success(`${item.type === 'experience' ? 'Experience' : 'Education'} entry deleted successfully`);
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false, item: null, type: '' });
    }
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, item: null, type: '' });
  };
  
  const handleToggleVisibility = async (entry) => {
    const updatedEntry = {
      ...entry,
      is_visible: !entry.is_visible
    };
    
    // Update local state immediately for better UX
    setExperiences(prev => 
      prev.map(exp => exp.id === entry.id ? updatedEntry : exp)
    );
    
    try {
      // Call the specific visibility API endpoint
      await updateExperienceVisibility(entry.id, !entry.is_visible);
      toast.success(`${entry.type === 'experience' ? 'Experience' : 'Education'} visibility updated`);
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
      
      // Revert local state on error
      setExperiences(prev => 
        prev.map(exp => exp.id === entry.id ? entry : exp)
      );
    }
  };
  
  const handleEntryChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    // // Apply character limit for description
    // if (name === 'description' && value.length > 300) {
    //   const limitedValue = value.slice(0, 300);
    //   setNewEntry(prev => ({
    //     ...prev,
    //     [name]: limitedValue
    //   }));
    // } else {
    // }
    setNewEntry(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSaveEntry = async () => {
    if (!newEntry.title || !newEntry.organization || !newEntry.start_date) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    newEntry.end_date = newEntry.end_date === "" ? null : newEntry.end_date
    
    setLoading(true);
    try {
      let savedEntry;
      
      // Make the API call to save the entry
      if (editingItem) {
        savedEntry = await updateExperience(editingItem, newEntry);
      } else {
        savedEntry = await createExperience(newEntry);
      }
      
      // Update the experiences array with the response from the server
      if (editingItem) {
        setExperiences(prev => 
          prev.map(exp => exp.id === editingItem ? savedEntry : exp)
        );
      } else {
        setExperiences(prev => [...prev, savedEntry]);
      }
      
      toast.success(`${newEntry.type === 'experience' ? 'Experience' : 'Education'} ${editingItem ? 'updated' : 'added'} successfully`);
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('Failed to save entry');
    } finally {
      setLoading(false);
    }
  };
  
  const renderEntryTable = (entries, type) => (
    <>
      <Box sx={{ width: '100%', mb: 2 }}>
        <TextField
          label={`Search ${type === 'experience' ? 'experiences' : 'education'}`}
          variant="outlined"
          size="small"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={`Search by ${type === 'experience' ? 'job title, company' : 'degree, institution'}, or description`}
          InputProps={{
            endAdornment: searchText && (
              <IconButton
                size="small"
                onClick={() => setSearchText('')}
                edge="end"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            ),
          }}
        />
      </Box>

      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell width="80px">Actions</TableCell>
              <TableCell onClick={() => handleSort('title')} sx={{ cursor: 'pointer' }}>
                {type === 'experience' ? 'Job Title' : 'Degree/Program'} 
                {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('organization')} sx={{ cursor: 'pointer' }}>
                {type === 'experience' ? 'Company' : 'Institution'}
                {sortConfig.key === 'organization' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('start_date')} sx={{ cursor: 'pointer' }}>
                Start Date
                {sortConfig.key === 'start_date' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('end_date')} sx={{ cursor: 'pointer' }}>
                End Date
                {sortConfig.key === 'end_date' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </TableCell>
              <TableCell width="70px">Visible</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExperiences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No {type === 'experience' ? 'experience' : 'education'} entries found
                </TableCell>
              </TableRow>
            ) : filteredExperiences.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: '4px' }}>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteClick(entry)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleEditEntry(entry)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>{entry.title}</TableCell>
                <TableCell>{entry.organization}</TableCell>
                <TableCell>{formatDateForDisplay(entry.start_date)}</TableCell>
                <TableCell>{entry.end_date ? formatDateForDisplay(entry.end_date) : 'Present'}</TableCell>
                <TableCell>
                  <Switch 
                    checked={entry.is_visible} 
                    onChange={() => handleToggleVisibility(entry)} 
                    color="success" 
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
  
  return (
    <>
      <Box sx={{ bgcolor: 'action.hover', borderRadius: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', p: 1 }}>
          <Button
            variant={tab === 'experience' ? 'contained' : 'text'}
            color="primary"
            onClick={() => handleTabChange('experience')}
            sx={{ mr: 1 }}
            >
            Experience
          </Button>
          <Button
            variant={tab === 'education' ? 'contained' : 'text'}
            color={tab === 'education' ? 'primary' : 'inherit'}
            onClick={() => handleTabChange('education')}
            >
            Education
          </Button>
        </Box>
      </Box>
      
      {tab === 'experience' && !showForm && renderEntryTable(experiences.filter(exp => exp.type === 'experience'), 'experience')}
      {tab === 'education' && !showForm && renderEntryTable(experiences.filter(exp => exp.type === 'education'), 'education')}
      
      {showForm ? (
        <Card sx={{ mt: 2, p: 2, bgcolor: 'background.default' }}>
          <Typography variant="h6" gutterBottom>
            {editingItem ? `Edit ${tab === 'experience' ? 'Experience' : 'Education'}` : `Add ${tab === 'experience' ? 'Experience' : 'Education'}`}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label={tab === 'experience' ? 'Job Title' : 'Degree/Program'}
                name="title"
                value={newEntry.title}
                onChange={handleEntryChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label={tab === 'experience' ? 'Company' : 'Institution'}
                name="organization"
                value={newEntry.organization}
                onChange={handleEntryChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Start Date"
                name="start_date"
                type="date"
                value={newEntry.start_date}
                onChange={handleEntryChange}
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date (Leave empty for current position)"
                name="end_date"
                type="date"
                value={newEntry.end_date}
                onChange={handleEntryChange}
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={newEntry.description}
                onChange={handleEntryChange}
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                // inputProps={{
                //   maxLength: 300
                // }}
                // helperText={`${newEntry.description?.length || 0}/300 characters`}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Switch
                  checked={newEntry.is_visible}
                  onChange={handleEntryChange}
                  name="is_visible"
                  color="success"
                />
                <Typography sx={{ ml: 1 }}>Visible on portfolio</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button 
                  variant="outlined" 
                  color="inherit"
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleSaveEntry}
                  disabled={loading || !newEntry.title || !newEntry.organization || !newEntry.start_date}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  {loading ? 'Saving...' : editingItem ? 'Update' : 'Add'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      ) : (
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={handleAddEntry}
        >
          <AddIcon color="success" />
          <Typography color="success.main" sx={{ ml: 1 }}>
            Add {tab === 'experience' ? 'Experience' : 'Education'} Entry
          </Typography>
        </Box>
      )}
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        title={`this ${deleteDialog.type} entry`}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        isLoading={loading}
      />
    </>

  );
};

const ProjectsSection = ({ projects, setProjects }) => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showDetailPage, setShowDetailPage] = useState(false);
  const [showPreview, setShowPreview] = useState(() => {
    // Initialize based on screen width - on for md+ screens, off for smaller screens
    return window.innerWidth >= 960; // MUI's md breakpoint is 960px
  });
  const [isMobile, setIsMobile] = useState(() => {
    // Check if current screen is mobile (using MUI's sm breakpoint of 600px)
    return window.innerWidth < 600;
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    item: null
  });
  const [refreshing, setRefreshing] = useState({});
  const [searchText, setSearchText] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  
  // Initialize filteredProjects with all projects when component mounts
  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort projects
  useEffect(() => {
    let result = [...projects];

    // Apply search filter
    if (searchText) {
      const lowercasedFilter = searchText.toLowerCase();
      result = result.filter(project => {
        return (
          project.title?.toLowerCase().includes(lowercasedFilter) ||
          project.description?.toLowerCase().includes(lowercasedFilter) ||
          project.type?.toLowerCase().includes(lowercasedFilter) ||
          (project.tags && project.tags.some(tag => tag.toLowerCase().includes(lowercasedFilter)))
        );
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortConfig.key === 'created_at') {
        const dateA = new Date(a[sortConfig.key]);
        const dateB = new Date(b[sortConfig.key]);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
      const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
      
      if (sortConfig.direction === 'asc') {
        return aValue.localeCompare(bValue);
      }
      return bValue.localeCompare(aValue);
    });

    setFilteredProjects(result);
  }, [projects, searchText, sortConfig]);

  // Simple function to convert markdown to HTML
  const convertMarkdownToHtml = (markdown) => {
    if (!markdown) return '';
    
    // Replace ** for bold
    let html = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace * for italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Replace ` for code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Replace [text](url) for links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Replace headers
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    
    // Replace lists (basic)
    html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>\n*)+/g, '<ul>$&</ul>');
    
    // Replace new lines with breaks
    html = html.replace(/\n/g, '<br />');
    
    return html;
  };

  // State for tags input
  const [currentTag, setCurrentTag] = useState('');
  
  // New project template
  const emptyProject = {
    title: '',
    description: '',
    type: 'github', // Default type
    image: '',
    tags: [],
    url: '',
    detail_page: '', // Add this new field
    is_visible: true
  };
  
  const [newProject, setNewProject] = useState(emptyProject);
  
  const handleAddProject = () => {
    setEditingItem(null);
    setNewProject(emptyProject);
    setShowDetailPage(false);
    setShowForm(true);
  };
  
  const handleEditProject = (project) => {
    setEditingItem(project.id);
    
    // Prepare project data for the form
    const projectData = {
      ...project,
      // Make sure tags is an array
      tags: project.tags || []
    };
    
    // For custom projects with a readme_file in additional_data,
    // toggle on detailed view and show the content
    if (project.type === 'custom' && 
        project.additional_data && 
        project.additional_data.readme_file) {
      
      // Set the detail_page content from readme_file
      projectData.detail_page = project.additional_data.readme_file;
      
      // Toggle on detailed view
      setShowDetailPage(true);
    } else {
      // Otherwise, only enable detail page if detail_page field exists
      setShowDetailPage(!!project.detail_page);
    }
    
    setNewProject(projectData);
    setShowForm(true);
  };
  
  const handleDeleteClick = (project) => {
    setDeleteDialog({
      open: true,
      item: project
    });
  };
  
  const handleDeleteConfirm = async () => {
    const { item } = deleteDialog;
    if (!item) return;
    
    setLoading(true);
    try {
      // Call API to delete the project
      await deleteProject(item.id);
      
      // Update local state
      setProjects(prev => prev.filter(project => project.id !== item.id));
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false, item: null });
    }
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, item: null });
  };
  
  const handleToggleVisibility = async (index) => {
    const project = projects[index];
    const newVisibility = !project.is_visible;
    
    // Update local state immediately for better UX
    setProjects(prevProjects => 
      prevProjects.map((p, i) => 
        i === index ? { ...p, is_visible: newVisibility } : p
      )
    );
    
    try {
      // Call API to update visibility
      await updateProjectVisibility(project.id, newVisibility);
    } catch (error) {
      console.error('Error updating project visibility:', error);
      toast.error('Failed to update project visibility');
      
      // Revert local state on error
      setProjects(prevProjects => 
        prevProjects.map((p, i) => 
          i === index ? { ...p, is_visible: !newVisibility } : p
        )
      );
    }
  };
  
  const handleProjectChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    // Update the project data
    setNewProject(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // If changing project type to GitHub, automatically turn off detail page
    if (name === 'type' && value === 'github') {
      setShowDetailPage(false);
    }
  };
  
  const handleAddTag = () => {
    if (currentTag.trim() === '') return;
    
    // Check if we've already reached the maximum of 2 tags
    if (newProject.tags.length >= 2) {
      toast.warning('Maximum 2 tags allowed per project');
      return;
    }
    
    // Add the tag if it's not already in the array
    if (!newProject.tags.includes(currentTag.trim())) {
      setNewProject(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
    }
    
    // Clear the tag input
    setCurrentTag('');
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setNewProject(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Convert the selected image to base64
        const base64 = await fileToBase64(file);
        setNewProject(prev => ({
          ...prev,
          image: base64
        }));
        toast.success('Project image uploaded successfully!');
      } catch (error) {
        console.error('Error converting image to base64:', error);
        toast.error('Failed to upload project image');
      }
    }
  };
  
  // Create a ref for the image upload input
  const fileInputRef = useRef(null);
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const handleSaveProject = async () => {
    // Validate required fields
    if (!newProject.title) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!newProject.description) {
      toast.error('Please enter a description');
      return;
    }
    
    if (newProject.type === 'github' && !newProject.url) {
      toast.error('Please enter a GitHub URL');
      return;
    }
    
    setLoading(true);
    try {
      // Prepare project data with additional_data if needed
      const projectData = { ...newProject };
      
      // For custom projects, store detail_page content in additional_data.readme_file
      if (projectData.type === 'custom') {
        // Initialize additional_data if it doesn't exist
        if (!projectData.additional_data) {
          projectData.additional_data = {};
        }
        
        // Set readme_file to the detail_page content
        projectData.additional_data.readme_file = projectData.detail_page || '';
      }
      
      let response;
      
      if (editingItem) {
        // Update existing project
        response = await updateProject(editingItem, projectData);
      } else {
        // Create new project
        response = await createProject(projectData);
      }
      
      const savedProject = response.data;
      
      // Update projects array
      if (editingItem) {
        setProjects(prev => 
          prev.map(project => project.id === editingItem ? savedProject : project)
        );
      } else {
        setProjects(prev => [...prev, savedProject]);
      }
      
      toast.success(`Project ${editingItem ? 'updated' : 'created'} successfully`);
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setLoading(false);
    }
  };
  
  // Update effect to also check mobile state on resize
  useEffect(() => {
    const handleResize = () => {
      // Update mobile state
      setIsMobile(window.innerWidth < 600);
      
      // Only auto-change preview if form is not open to avoid disrupting user
      if (!showForm) {
        setShowPreview(window.innerWidth >= 960);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showForm]);
  
  const handleRefreshProject = async (projectId) => {
    setRefreshing(prev => ({ ...prev, [projectId]: true }));
    
    try {
      // Use refreshProjectData from the service instead of direct fetch
      await refreshProjectData(projectId);
      
      // Get updated project data
      const updatedProjects = await getAllProjects();
      setProjects(updatedProjects);
      
      toast.success('Project refreshed successfully');
    } catch (error) {
      console.error('Error refreshing project:', error);
      toast.error('Failed to refresh project');
    } finally {
      setRefreshing(prev => ({ ...prev, [projectId]: false }));
    }
  };
  
  return (
    <>
      {!showForm && (
        <>
          <Box sx={{ width: '100%', mb: 2 }}>
            <TextField
              label="Search projects"
              variant="outlined"
              size="small"
              fullWidth
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by title, description, type, or tags"
              InputProps={{
                endAdornment: searchText && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchText('')}
                    edge="end"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                ),
              }}
            />
          </Box>

          <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell width="120px">Actions</TableCell>
                  <TableCell onClick={() => handleSort('type')} sx={{ cursor: 'pointer' }}>
                    Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableCell>
                  <TableCell onClick={() => handleSort('title')} sx={{ cursor: 'pointer' }}>
                    Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell width="80px">Visible</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No projects found
                    </TableCell>
                  </TableRow>
                ) : filteredProjects.map((project, index) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: '2px' }}>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(project)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEditProject(project)}
                        >
                          <EditIcon />
                        </IconButton>
                        {/* Only show refresh button for GitHub projects */}
                        {project.type === 'github' && (
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => handleRefreshProject(project.id)}
                            disabled={refreshing[project.id]}
                            sx={{ 
                              animation: refreshing[project.id] ? 'spin 1s linear infinite' : 'none',
                              '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' }
                              }
                            }}
                          >
                            <RefreshIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{getTypeName(project.type) || 'Custom'}</TableCell>
                    <TableCell>{project.title}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {project.tags && project.tags.length > 0 ? project.tags.map((tag, i) => (
                          <Chip
                            key={i}
                            label={tag}
                            size="small"
                            color="secondary"
                            variant="outlined"
                            sx={{ my: 0.25 }}
                          />
                        )) : (
                          <Typography color="text.secondary">No tags</Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={project.is_visible} 
                        onChange={() => handleToggleVisibility(index)} 
                        color="success" 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      
      {showForm ? (
        <Card sx={{ mt: 2, p: 2, bgcolor: 'background.default' }}>
          <Typography variant="h6" gutterBottom>
            {editingItem ? 'Edit Project' : 'Add Project'}
          </Typography>
          
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Project Image
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    maxWidth: 350,
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    overflow: 'hidden'
                  }}
                >
                  {newProject.image ? (
                    <img
                      src={newProject.image}
                      alt="Project"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Box sx={{ textAlign: 'center' }}>
                      <AddIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                      <Typography color="text.secondary">No image selected</Typography>
                    </Box>
                  )}
                </Box>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={triggerFileInput}
                    sx={{ color: 'white' }}
                  >
                    {newProject.image ? 'Change Image' : 'Upload Image'}
                  </Button>
                  
                  {newProject.image && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => setNewProject(prev => ({ ...prev, image: '' }))}
                    >
                      Remove Image
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Project Title"
                name="title"
                value={newProject.title}
                onChange={handleProjectChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                label="Project Type"
                name="type"
                value={newProject.type}
                onChange={handleProjectChange}
                margin="normal"
                variant="outlined"
                disabled={!!editingItem}
                helperText={editingItem ? "Project type cannot be changed after creation" : ""}
              >
                <MenuItem value="github">GitHub</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </TextField>
            </Grid>
            
            {newProject.type === 'github' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="GitHub URL"
                  name="url"
                  value={newProject.url}
                  onChange={handleProjectChange}
                  margin="normal"
                  variant="outlined"
                  placeholder="https://github.com/username/repository"
                  helperText="GitHub data is automatically refreshed every day. You can also manually refresh using the refresh button."
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Description"
                name="description"
                value={newProject.description}
                onChange={handleProjectChange}
                margin="normal"
                variant="outlined"
                multiline
                rows={3}
                inputProps={{
                  maxLength: 350
                }}
                helperText={`${newProject.description.length}/350 characters`}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Project Tags
              </Typography>
              <Box sx={{ mb: 2 }}>
                {newProject.tags.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {newProject.tags.map((tag, idx) => (
                      <Chip
                        key={idx}
                        label={tag}
                        size="small"
                        color="secondary"
                        variant="outlined"
                        onDelete={() => handleRemoveTag(tag)}
                        sx={{ my: 0.25 }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                    No tags added yet
                  </Typography>
                )}
                
                {
                  newProject.tags.length < 2 && (
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                      <TextField
                        label="Add Tag"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        sx={{ flexGrow: 1 }}
                        helperText={`${newProject.tags.length}/2 tags added (max 2)`}
                      />
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleAddTag}
                        disabled={!currentTag.trim() || newProject.tags.length >= 2}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                      >
                        Add Tag
                      </Button>
                    </Box>
                  )
                }
              </Box>
            </Grid>
            
            {/* Only show detailed page toggle for custom projects */}
            {newProject.type === 'custom' && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                  <Switch
                    checked={showDetailPage}
                    onChange={(e) => setShowDetailPage(e.target.checked)}
                    color="primary"
                  />
                  <Typography sx={{ ml: 1 }}>Create a detailed page for this project</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  If enabled, the detail page will use the content provided in the input field below to display additional information about this project at /projects/{newProject.title ? newProject.title.toLowerCase().replace(/\s+/g, '-') : '[project-name]'}.
                </Typography>
              </Grid>
            )}
            
            {/* For GitHub projects, show info about GitHub data */}
            {newProject.type === 'github' && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  GitHub projects will use the main README file from your repository to create the detail page automatically. No additional content is needed.
                </Typography>
              </Grid>
            )}
            
            {/* Conditional rendering of the detail page content section */}
            {showDetailPage && newProject.type === 'custom' && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">
                    Detail Page Content (Markdown Supported)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {isMobile ? "Show Preview" : "Show Preview"}
                    </Typography>
                    <Switch
                      size="small"
                      checked={showPreview}
                      onChange={(e) => setShowPreview(e.target.checked)}
                    />
                  </Box>
                </Box>
                <Grid 
                  container 
                  spacing={2} 
                  sx={{ 
                    height: 'clamp(300px, 75vh, 800px)' 
                  }}
                >
                  {/* On mobile: show input only when preview is off */}
                  {(!isMobile || !showPreview) && (
                    <Grid item xs={12} md={showPreview && !isMobile ? 6 : 12} sx={{ height: '100%' }}>
                      <TextField
                        fullWidth
                        label="Markdown Content"
                        name="detail_page"
                        value={newProject.detail_page || ''}
                        onChange={handleProjectChange}
                        margin="normal"
                        variant="outlined"
                        multiline
                        rows={4}
                        placeholder="Write markdown content here..."
                        sx={{ 
                          width: '100%',
                          height: 'calc(100% - 32px)', // Adjust for margin
                          m: '16px 0',
                          '& .MuiInputBase-root': {
                            height: '100%', 
                            alignItems: 'flex-start'
                          },
                          '& .MuiInputBase-multiline': {
                            height: '100%'
                          },
                          '& textarea': {
                            height: '100% !important',
                            overflow: 'auto'
                          }
                        }}
                      />
                    </Grid>
                  )}
                  
                  {/* Show preview when enabled */}
                  {showPreview && (
                    <Grid item xs={12} md={!isMobile ? 6 : 12} sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                      <Paper
                        elevation={0}
                        variant="outlined"
                        sx={{ 
                          width: '100%',
                          height: 'calc(100% - 32px)', // Match the height of TextField including margins
                          mt: '16px',
                          mb: '16px',
                          px: 1.75,
                          py: 2,
                          overflow: 'auto',
                          '& img': { maxWidth: '100%' },
                          '& pre': { 
                            backgroundColor: '#f5f5f5', 
                            padding: '0.5rem', 
                            borderRadius: '4px', 
                            overflowX: 'auto' 
                          },
                          '& code': { 
                            backgroundColor: '#f5f5f5',
                            padding: '0.1rem 0.3rem',
                            borderRadius: '3px',
                            fontSize: '0.9em'
                          },
                          '& a': {
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          },
                          '& ul, & ol': {
                            paddingLeft: '1.5rem',
                            marginTop: '0.5rem',
                            marginBottom: '0.5rem'
                          }
                        }}
                      >
                        {newProject.detail_page ? (
                          <Box 
                            dangerouslySetInnerHTML={{ 
                              __html: convertMarkdownToHtml(newProject.detail_page) 
                            }} 
                          />
                        ) : (
                          <Typography color="text.secondary" variant="body2">
                            Markdown preview will appear here...
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  )}
                </Grid>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Use markdown for formatting - **bold**, *italic*, `code`, [links](https://example.com), etc.
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener noreferrer">
                      View Markdown Guide for detailed syntax help
                    </a>
                  </Typography>
                </Box>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveProject}
                  disabled={loading || !newProject.title || !newProject.description || (newProject.type === 'github' && !newProject.url)}
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  {loading ? 'Saving...' : (editingItem ? 'Update' : 'Create') + ' Project'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      ) : (
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={handleAddProject}
        >
          <AddIcon color="success" />
          <Typography color="success.main" sx={{ ml: 1 }}>
            Add Project
          </Typography>
        </Box>
      )}
      
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        title={deleteDialog.item ? `the project "${deleteDialog.item.title}"` : 'this project'}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        isLoading={loading}
      />
    </>
  );
};

const ReviewsSection = ({ reviews, setReviews }) => {
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    item: null
  });
  const [searchText, setSearchText] = useState('');
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [expandedRow, setExpandedRow] = useState(null);

  // Initialize filteredReviews with all reviews when component mounts
  useEffect(() => {
    setFilteredReviews(reviews);
  }, [reviews]);

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort reviews
  useEffect(() => {
    let result = [...reviews];

    // Apply search filter
    if (searchText) {
      const lowercasedFilter = searchText.toLowerCase();
      result = result.filter(review => {
        return (
          review.name?.toLowerCase().includes(lowercasedFilter) ||
          review.content?.toLowerCase().includes(lowercasedFilter) ||
          review.where_known_from?.toLowerCase().includes(lowercasedFilter)
        );
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortConfig.key === 'created_at') {
        const dateA = new Date(a[sortConfig.key]);
        const dateB = new Date(b[sortConfig.key]);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
      const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
      
      if (sortConfig.direction === 'asc') {
        return aValue.localeCompare(bValue);
      }
      return bValue.localeCompare(aValue);
    });

    setFilteredReviews(result);
  }, [reviews, searchText, sortConfig]);

  const handleDeleteClick = (reviewId) => {
    const reviewToDelete = reviews.find(r => r.id === reviewId);
    setDeleteDialog({
      open: true,
      item: reviewToDelete
    });
  };
  
  const handleDeleteConfirm = async () => {
    const { item } = deleteDialog;
    if (!item) return;
    
    setLoading(true);
    try {
      await deleteReview(item.id);
      setReviews(prev => prev.filter(review => review.id !== item.id));
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false, item: null });
    }
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, item: null });
  };
  
  const handleToggleVisibility = async (id, currentVisibility) => {
    const reviewIndex = reviews.findIndex(r => r.id === id);
    if (reviewIndex === -1) return;
    
    const newVisibility = !currentVisibility;
    
    setReviews(prevReviews => 
      prevReviews.map(r => 
        r.id === id ? { ...r, is_visible: newVisibility } : r
      )
    );
    
    try {
      await updateReviewVisibility(id, newVisibility);
    } catch (error) {
      console.error('Error updating review visibility:', error);
      toast.error('Failed to update review visibility');
      
      setReviews(prevReviews => 
        prevReviews.map(r => 
          r.id === id ? { ...r, is_visible: !newVisibility } : r
        )
      );
    }
  };

  const handleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <>
      <Box sx={{ width: '100%', mb: 2 }}>
        <TextField
          label="Search reviews"
          variant="outlined"
          size="small"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by name, content, rating, etc."
          InputProps={{
            endAdornment: searchText && (
              <IconButton
                size="small"
                onClick={() => setSearchText('')}
                edge="end"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell width="120px">Actions</TableCell>
              <TableCell onClick={() => handleSort('name')} sx={{ cursor: 'pointer' }}>
                Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('rating')} sx={{ cursor: 'pointer' }}>
                Rating {sortConfig.key === 'rating' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('where_known_from')} sx={{ cursor: 'pointer' }}>
                Where From {sortConfig.key === 'where_known_from' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('created_at')} sx={{ cursor: 'pointer' }}>
                Date {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell width="100px">Visible</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No reviews found
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <React.Fragment key={review.id}>
                  <TableRow sx={{ borderBottom: 0 }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(review.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleRowExpand(review.id)}
                          sx={{
                            transform: expandedRow === review.id ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }}
                        >
                          <ExpandMoreIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>{review.name}</TableCell>
                    <TableCell>{review.rating}</TableCell>
                    <TableCell>{review.where_known_from}</TableCell>
                    <TableCell>{formatDateForDisplay(review.created_at)}</TableCell>
                    <TableCell>
                      <Switch 
                        checked={review.is_visible} 
                        onChange={() => handleToggleVisibility(review.id, review.is_visible)} 
                        color="success" 
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Collapse in={expandedRow === review.id}>
                        <Box sx={{ 
                          p: 2, 
                          borderTop: '1px solid',
                          borderColor: 'divider',
                        }}>
                          <Typography variant="subtitle2" gutterBottom color="text.secondary">
                            Review Content
                          </Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                            {review.content}
                          </Typography>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteConfirmationDialog
        open={deleteDialog.open}
        title={deleteDialog.item ? `the review from "${deleteDialog.item.name}"` : 'this review'}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        isLoading={loading}
      />
    </>
  );
};

export default DashboardPage;
