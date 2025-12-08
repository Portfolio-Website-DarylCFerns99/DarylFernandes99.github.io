import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeCookie, TOKEN_COOKIE_NAME } from '../../utils/cookieUtils';
import { toast } from 'react-toastify';

import {
  Box,
  Card,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
  Typography
} from '@mui/material';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import LinkIcon from '@mui/icons-material/Link';
import InfoIcon from '@mui/icons-material/Info';
import CodeIcon from '@mui/icons-material/Code';
import TimelineIcon from '@mui/icons-material/Timeline';
import AppsIcon from '@mui/icons-material/Apps';
import MenuIcon from '@mui/icons-material/Menu';
import ArticleIcon from '@mui/icons-material/Article';
import ChatIcon from '@mui/icons-material/Chat';

import { getNextThemeMode } from '../../utils/themeUtils';
import { DynamicSEO } from '../../components/SEO/DynamicSEO';
import BasicInfoSection from './components/BasicInfoSection';
import AboutSection from './components/AboutSection';
import SocialLinksSection from './components/SocialLinksSection';
import SkillsSection from './components/SkillsSection';
import TimelineSection from './components/TimelineSection';
import ProjectsSection from './components/ProjectsSection';
import ReviewsSection from './components/ReviewsSection';
import ChatHistorySection from './components/ChatHistorySection';
import Sidebar from './components/Sidebar';

const drawerWidth = 280;

const sections = [
  { id: 'basic', name: 'Basic Info', icon: <PersonIcon /> },
  { id: 'about', name: 'About', icon: <InfoIcon /> },
  { id: 'social', name: 'Social Links', icon: <LinkIcon /> },
  { id: 'skills', name: 'Skills', icon: <CodeIcon /> },
  { id: 'timeline', name: 'Timeline', icon: <TimelineIcon /> },
  { id: 'projects', name: 'Projects', icon: <AppsIcon /> },
  { id: 'reviews', name: 'Reviews', icon: <ArticleIcon /> },
  { id: 'chat', name: 'Chat History', icon: <ChatIcon /> }
];

const DashboardPage = ({ themeMode, setThemeMode }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const sectionRefs = React.useRef({});

  // Mock user data for sidebar until BasicInfo fetches it or we move it to context
  const [user, setUser] = useState({ name: 'Admin', surname: 'User', avatar: '' });

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

  const scrollToSection = (sectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 80; // Header height + padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  // Scroll detection
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset

      let current = 'basic';
      Object.entries(sectionRefs.current).forEach(([id, ref]) => {
        if (ref && ref.offsetTop <= scrollPosition) {
          current = id;
        }
      });

      if (current !== activeSection) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
    <Fragment>
      <DynamicSEO title="Admin" noIndex={true} />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>

        {/* Mobile Header */}
        <Box sx={{
          display: { md: 'none', xs: 'flex' },
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          p: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'background.header',
          backdropFilter: 'blur(12px)',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <IconButton onClick={handleDrawerToggle} edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            Admin
          </Typography>
          <Box width={40} /> {/* Spacer */}
        </Box>

        {/* Sidebar */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            <Sidebar
              sections={sections}
              activeSection={activeSection}
              onSectionClick={scrollToSection}
              user={user}
              onLogout={handleLogout}
              themeMode={themeMode}
              onThemeToggle={handleThemeToggle}
              onClose={handleDrawerToggle}
            />
          </Drawer>

          {/* Desktop Sidebar */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                border: 'none',
                bgcolor: 'transparent'
              },
            }}
            open
          >
            <Box sx={{ p: 2, height: '100%', position: 'fixed', width: drawerWidth }}>
              <Card sx={{ height: '100%', overflow: 'hidden' }}>
                <Sidebar
                  sections={sections}
                  activeSection={activeSection}
                  onSectionClick={scrollToSection}
                  user={user}
                  onLogout={handleLogout}
                  themeMode={themeMode}
                  onThemeToggle={handleThemeToggle}
                />
              </Card>
            </Box>
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            mt: { xs: 8, md: 0 },
            overflowX: 'hidden'
          }}
        >
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>

            {/* Basic Info Section */}
            <Box ref={el => sectionRefs.current['basic'] = el} sx={{ mb: 6, scrollMarginTop: '100px' }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary" sx={{ mb: 3 }}>
                  Basic Info
                </Typography>
                <BasicInfoSection setUserForSidebar={setUser} />
              </Card>
            </Box>

            {/* About Section */}
            <Box ref={el => sectionRefs.current['about'] = el} sx={{ mb: 6, scrollMarginTop: '100px' }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary" sx={{ mb: 3 }}>
                  About
                </Typography>
                <AboutSection />
              </Card>
            </Box>

            {/* Social Links Section */}
            <Box ref={el => sectionRefs.current['social'] = el} sx={{ mb: 6, scrollMarginTop: '100px' }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary" sx={{ mb: 3 }}>
                  Social Links
                </Typography>
                <SocialLinksSection />
              </Card>
            </Box>

            {/* Skills Section */}
            <Box ref={el => sectionRefs.current['skills'] = el} sx={{ mb: 6, scrollMarginTop: '100px' }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary" sx={{ mb: 3 }}>
                  Skills
                </Typography>
                <SkillsSection />
              </Card>
            </Box>

            {/* Timeline Section */}
            <Box ref={el => sectionRefs.current['timeline'] = el} sx={{ mb: 6, scrollMarginTop: '100px' }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary" sx={{ mb: 3 }}>
                  Timeline
                </Typography>
                <TimelineSection />
              </Card>
            </Box>

            {/* Projects Section */}
            <Box ref={el => sectionRefs.current['projects'] = el} sx={{ mb: 6, scrollMarginTop: '100px' }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary" sx={{ mb: 3 }}>
                  Projects
                </Typography>
                <ProjectsSection />
              </Card>
            </Box>

            {/* Reviews Section */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary" sx={{ mb: 3 }}>
                Reviews
              </Typography>
              <ReviewsSection />
            </Card>
          </Box>

          {/* Chat History Section */}
          <Box ref={el => sectionRefs.current['chat'] = el} sx={{ mb: 6, scrollMarginTop: '100px' }}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary" sx={{ mb: 3 }}>
                Chat History
              </Typography>
              <ChatHistorySection />
            </Card>
          </Box>

        </Box>
      </Box>
    </Fragment >
  );
};

export default DashboardPage;
