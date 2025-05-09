import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ErrorBoundary } from 'react-error-boundary';
import { useState, lazy, Suspense, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css'

import THEME from './common/theme';
import Header from './components/header'
import Footer from './components/footer'
import { ROUTES } from './common/common'
import LoadingLayout from './pages/loading'
import { GuestRoute } from './authRouter/authGuestRoute.jsx'
import { AuthProvider } from './authRouter/authContext.jsx'
import ScrollToTop from './components/ScrollToTop';
import { updateUserData, setGithubDataLoading } from './redux/reducers/userSlice';
import { getCookie, TOKEN_COOKIE_NAME } from './utils/cookieUtils';

const ErrorPage = lazy(() => import('./pages/errorPage'));
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));

// Protected Route component for admin pages
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = getCookie(TOKEN_COOKIE_NAME) !== null;
  return isAuthenticated ? children : <Navigate to="/admin" replace />;
};

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const dispatch = useDispatch();
  const isGithubDataLoading = useSelector(state => state.user.isGithubDataLoading);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Only fetch user data if we're not on the admin route
        if (!window.location.pathname.startsWith('/admin')) {
          dispatch(setGithubDataLoading(true));
          
          // Import and use the userService
          const { getPublicUserData } = await import('./api/services/userService');
          
          // Get user ID from environment variables
          const userId = import.meta.env.VITE_USER_ID;
          
          // Fetch user data from API
          const userData = await getPublicUserData(userId);
          
          // Update Redux store with the user data
          dispatch(updateUserData(userData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        dispatch(setGithubDataLoading(false));
      }
    };

    // Fetch user data
    fetchUserData();
    
    // Handle theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      setDarkMode(e.matches);
    };

    // Set initial theme based on system preference
    setDarkMode(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    // Clean up the event listener
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [dispatch]);

  const errorHandler = (error, errorInfo) => {
    console.log('Logging', error, errorInfo)
  }

  // If github data is loading, show loading layout
  if (isGithubDataLoading) {
    return (
      <ThemeProvider theme={THEME(darkMode ? 'dark' : 'light')}>
        <CssBaseline />
        <LoadingLayout />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={THEME(darkMode ? 'dark' : 'light')}>
      <Suspense fallback={<LoadingLayout />}>
        <ErrorBoundary
          FallbackComponent={ErrorPage}
          onError={errorHandler}
        >
          <CssBaseline />
          <AuthProvider>
            <ScrollToTop />
            <Routes>
              {/* Admin Routes - No Header/Footer */}
              <Route path="/admin" element={<LoginPage />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage darkMode={darkMode} setDarkMode={setDarkMode} />
                </ProtectedRoute>
              } />

              {/* Public Routes - With Header/Footer */}
              <Route element={
                <>
                  <Header darkMode={darkMode} setDarkMode={setDarkMode} />
                  <Box component="main" sx={{ flexGrow: 1 }}>
                    <GuestRoute />
                  </Box>
                  <Footer />
                </>
              }>
                {ROUTES.map((route) => {
                  const RouteComponent = route.component;
                  return (
                    <Route 
                      key={route.path}
                      path={route.path} 
                      element={<RouteComponent />} 
                    />
                  );
                })}
                <Route path="*" element={<ErrorPage />} />
              </Route>
            </Routes>
            {/* Toast Container for notifications */}
            <ToastContainer 
              position="top-right" 
              autoClose={3000} 
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={darkMode ? 'dark' : 'light'}
            />
          </AuthProvider>
        </ErrorBoundary>
      </Suspense>
    </ThemeProvider>
  )
}

export default App
