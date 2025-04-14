import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ErrorBoundary } from 'react-error-boundary';
import { useState, lazy, Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import './App.css'

import THEME from './common/theme';
import Header from './components/header'
import Footer from './components/footer'
import { ROUTES, fetchAllGitHubProjectsData } from './common/common'
import LoadingLayout from './pages/loading'
import { GuestRoute } from './authRouter/authGuestRoute.jsx'
import { AuthProvider } from './authRouter/authContext.jsx'
import ScrollToTop from './components/ScrollToTop';
import { updateProjectData, setGithubDataLoading } from './redux/reducers/userSlice';

const ErrorPage = lazy(() => import('./pages/errorPage'))

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const dispatch = useDispatch();
  const projects = useSelector(state => state.user.projects);
  const isGithubDataLoading = useSelector(state => state.user.isGithubDataLoading);

  useEffect(() => {
    // Fetch GitHub data for all projects on initialization
    fetchAllGitHubProjectsData(projects, dispatch, updateProjectData, setGithubDataLoading);
  }, []);

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
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              minHeight: '100vh'
            }}>
              <ScrollToTop />
              <Header darkMode={darkMode} setDarkMode={setDarkMode} />
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                  <Route element={<GuestRoute />}>
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
                  </Route>
                  <Route path="*" element={<ErrorPage />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </AuthProvider>
        </ErrorBoundary>
      </Suspense>
    </ThemeProvider>
  )
}

export default App
