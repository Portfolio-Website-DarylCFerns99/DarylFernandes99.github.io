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
import { getCookie, TOKEN_COOKIE_NAME } from './utils/cookieUtils';
import { updateUserData, setGithubDataLoading, setTestDataFlag } from './redux/reducers/userSlice';
import { THEME_MODES, getStoredThemeMode, setStoredThemeMode, resolveTheme, createSystemThemeListener } from './utils/themeUtils';

const ErrorPage = lazy(() => import('./pages/errorPage'));
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));

// Protected Route component for admin pages
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = getCookie(TOKEN_COOKIE_NAME) !== null;
  return isAuthenticated ? children : <Navigate to="/admin" replace />;
};

function App() {
  const [themeMode, setThemeMode] = useState(getStoredThemeMode());
  const [resolvedTheme, setResolvedTheme] = useState(resolveTheme(themeMode));
  const dispatch = useDispatch();
  const isGithubDataLoading = useSelector(state => state.user.isGithubDataLoading);

  // Handle theme mode changes
  const handleThemeModeChange = (newMode) => {
    setThemeMode(newMode);
    setStoredThemeMode(newMode);
    setResolvedTheme(resolveTheme(newMode));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Only fetch user data if we're not on the admin route
        if (!window.location.pathname.startsWith('/admin') && import.meta.env.VITE_USER_ID ) {
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
        // When API fails, we're using the default userData.json, so mark as test data
        dispatch(setTestDataFlag(true));
      } finally {
        dispatch(setGithubDataLoading(false));
      }
    };

    // Fetch user data
    fetchUserData();
    
    // Set up system theme listener for when mode is 'system'
    const cleanupSystemListener = createSystemThemeListener((systemTheme) => {
      if (themeMode === THEME_MODES.SYSTEM) {
        setResolvedTheme(systemTheme);
      }
    });

    // Initial theme resolution
    setResolvedTheme(resolveTheme(themeMode));

    // Clean up the event listener
    return cleanupSystemListener;
  }, [dispatch]);

  const errorHandler = (error, errorInfo) => {
    console.log('Logging', error, errorInfo)
  }

  // If github data is loading, show loading layout
  if (isGithubDataLoading) {
    return (
      <ThemeProvider theme={THEME(resolvedTheme)}>
        <CssBaseline />
        <LoadingLayout />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={THEME(resolvedTheme)}>
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
                  <DashboardPage themeMode={themeMode} setThemeMode={handleThemeModeChange} />
                </ProtectedRoute>
              } />

              {/* Public Routes - With Header/Footer */}
              <Route element={
                <>
                  <Header themeMode={themeMode} setThemeMode={handleThemeModeChange} />
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
              theme={resolvedTheme}
            />
          </AuthProvider>
        </ErrorBoundary>
      </Suspense>
    </ThemeProvider>
  )
}

export default App
