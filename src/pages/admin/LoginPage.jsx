import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/services/userService';
import { toast } from 'react-toastify';
import { getCookie } from '../../utils/cookieUtils';
import { TOKEN_COOKIE_NAME } from '../../utils/cookieUtils';
import { motion } from 'framer-motion';

// Material UI imports
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Card,
  Avatar,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon
} from '@mui/icons-material';
import { DynamicSEO } from '../../components/SEO/DynamicSEO';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  // Check if already logged in
  useEffect(() => {
    const token = getCookie(TOKEN_COOKIE_NAME);
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(credentials);
      toast.success('Login successful!');

      // Redirect to admin dashboard after a short delay
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(
        error.response?.data?.detail ||
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Fragment>
      <DynamicSEO title="Admin" noIndex={true} />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #090909 0%, #1a1a2e 100%)'
            : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          py: 3
        }}
      >
        <Container maxWidth="xs">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              elevation={3}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Decorative top bar */}
              <Box
                sx={{
                  height: 8,
                  width: '100%',
                  backgroundColor: theme.palette.primary.main,
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 4,
                }}
              >
                <Avatar
                  sx={{
                    m: 1,
                    bgcolor: theme.palette.primary.main,
                    width: 56,
                    height: 56,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <LockIcon fontSize="large" />
                </Avatar>

                <Typography
                  component="h1"
                  variant="h5"
                  fontWeight="700"
                  sx={{ mb: 1 }}
                >
                  Portfolio Admin
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 3 }}
                >
                  Enter your credentials to access the dashboard
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ width: '100%' }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username or Email"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={credentials.username}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={credentials.password}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: theme.palette.background.paper }} />
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Protected area. Authorized personnel only.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </motion.div>
        </Container>
      </Box>
    </Fragment>
  );
};

export default LoginPage;
