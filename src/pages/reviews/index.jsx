import React, { useState, useEffect, useMemo } from 'react'
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  TextField, 
  Paper,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Pagination,
  Stack
} from '@mui/material'
import RateReviewIcon from '@mui/icons-material/RateReview'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SortIcon from '@mui/icons-material/Sort'
import { useSelector, useDispatch } from 'react-redux'

import { submitPublicReview } from '../../api/services/reviewService'
import { updateUserData } from '../../redux/reducers/userSlice'
import { 
  ContactButton, 
  pageContainerStyles, 
  pageTitleStyles, 
  sectionSubtitleStyles, 
  mainHeadingStyles, 
  headingSpanStyles, 
  descriptionTextStyles, 
  paperContainerStyles, 
  formHeadingStyles, 
  submitButtonStyles 
} from './styles'

const Index = () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [appBarHeight, setAppBarHeight] = useState(64) // Default height
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    rating: 0,
    where_known_from: '',
    other_source: ''
  })
  const [errors, setErrors] = useState({})
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: ''
  })
  
  // State for showing/hiding the form
  const [showForm, setShowForm] = useState(false)
  
  // Pagination state
  const [page, setPage] = useState(1)
  const reviewsPerPage = 9
  
  // Sorting state
  const [sortOption, setSortOption] = useState('newest')
  
  // Get reviews from userData
  const reviews = useMemo(() => {
    return userData.reviews || [];
  }, [userData.reviews]);
  
  // Sort reviews based on current sort option
  const sortedReviews = useMemo(() => {
    if (!reviews.length) return [];
    
    const reviewsCopy = [...reviews];
    
    switch (sortOption) {
      case 'newest':
        return reviewsCopy.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      case 'oldest':
        return reviewsCopy.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
      case 'highest':
        return reviewsCopy.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return reviewsCopy.sort((a, b) => a.rating - b.rating);
      default:
        return reviewsCopy;
    }
  }, [reviews, sortOption]);
  
  // Calculate total pages and current page reviews
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage)
  const currentReviews = sortedReviews.slice(
    (page - 1) * reviewsPerPage, 
    page * reviewsPerPage
  )

  // Options for where you know the portfolio owner from
  const knownFromOptions = [
    'LinkedIn',
    'GitHub',
    'Professional Network',
    'Personal Referral',
    'Online Search',
    'Conference/Event',
    'Previous Collaboration',
    'Other'
  ]

  // Check if form is valid for enabling/disabling submit button
  const isFormValid = useMemo(() => {
    const { name, content, rating, where_known_from } = formData
    
    // Basic validation - all required fields must be filled
    const requiredFieldsValid = 
      name.trim() !== '' && 
      content.trim() !== '' && 
      rating > 0 &&
      where_known_from.trim() !== '';
      
    // If "Other" is selected, we don't require other_source (it's optional)
    // But we still need to check the errors array is empty
    return requiredFieldsValid && Object.keys(errors).length === 0;
  }, [formData, errors])

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
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value)
    // Scroll to top of reviews section
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleRatingChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, rating: newValue }))
    
    // Clear error for rating
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Full name is required'
    if (!formData.content.trim()) newErrors.content = 'Review content is required'
    if (formData.content.length > 500) newErrors.content = 'Review content must be 500 characters or less'
    if (!formData.rating) newErrors.rating = 'Please provide a rating'
    if (!formData.where_known_from.trim()) newErrors.where_known_from = 'Please select how you know me'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      try {
        // Prepare the data for submission
        const reviewData = {
          name: formData.name,
          content: formData.content,
          rating: formData.rating,
          where_known_from: formData.where_known_from === 'Other' && formData.other_source.trim() ? 
            formData.other_source : formData.where_known_from
        }
        
        // Use the reviewService to submit the review
        const response = await submitPublicReview(reviewData)
        
        // Add the new review to Redux store
        const newReview = {
          ...reviewData,
          _id: response.data._id || `temp_${Date.now()}`, // Use returned ID or create temporary one
          created_at: new Date().toISOString() // Add timestamp
        }
        
        // Update Redux store with new review
        dispatch(updateUserData({
          reviews: [...userData.reviews || [], newReview]
        }))
        
        // Switch back to reviews view
        setShowForm(false)
        
        // Show success message
        setSnackbar({
          open: true,
          severity: 'success',
          message: 'Thank you for your review! It will be visible after approval.'
        })
        
        // Reset form
        setFormData({
          name: '',
          content: '',
          rating: 0,
          where_known_from: '',
          other_source: ''
        })
      } catch (error) {
        console.error('Error submitting review:', error)
        
        // Show error message
        setSnackbar({
          open: true,
          severity: 'error',
          message: 'Failed to submit review. Please try again later.'
        })
      }
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const getAvatarColor = (name) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      '#FF5722', // deep orange
      '#8BC34A', // light green
      '#9C27B0', // purple
      '#2196F3', // blue
      '#FF9800', // orange
    ]
    
    // Simple hash function to get consistent color for same name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Handle sort change
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setPage(1); // Reset to first page when sort changes
  };

  return (
    <Box sx={pageContainerStyles(theme, appBarHeight)}>
      <Container maxWidth="lg">
        {/* Page Title */}
        <Box sx={pageTitleStyles}>
          <Typography 
            variant="subtitle1" 
            component="p" 
            sx={sectionSubtitleStyles(theme)}
          >
            Share Your Experience
          </Typography>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={mainHeadingStyles}
          >
            Client{' '}
            <Typography 
              variant="h2" 
              component="span" 
              color="primary"
              sx={headingSpanStyles}
            >
              Reviews
            </Typography>
          </Typography>
          <Typography 
            variant="body1" 
            sx={descriptionTextStyles(theme)}
          >
            See what others have to say about working with me. Your feedback is valuable!
          </Typography>
        </Box>

        {!showForm ? (
          <>
            {/* Section header with review count and submit button */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 2,
                mb: 4
              }}
            >
              {/* Sort filter - Left */}
              {reviews.length > 0 && (
                <FormControl 
                  size="small" 
                  sx={{ 
                    minWidth: 150,
                    width: isMobile ? '100%' : 'auto',
                    order: isMobile ? 2 : 1
                  }}
                >
                  <InputLabel id="sort-reviews-label">Sort By</InputLabel>
                  <Select
                    labelId="sort-reviews-label"
                    id="sort-reviews"
                    value={sortOption}
                    onChange={handleSortChange}
                    label="Sort By"
                    startAdornment={<SortIcon fontSize="small" sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                    <MenuItem value="highest">Highest Rating</MenuItem>
                    <MenuItem value="lowest">Lowest Rating</MenuItem>
                  </Select>
                </FormControl>
              )}
              
              {/* Review count - Center */}
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{ 
                  textAlign: 'center',
                  order: isMobile ? 1 : 2,
                  flexGrow: 1
                }}
              >
                {reviews.length > 0 
                  ? `${reviews.length} ${reviews.length === 1 ? 'Review' : 'Reviews'}`
                  : 'No reviews yet'
                }
              </Typography>
              
              {/* Submit button - Right */}
              <ContactButton
                onClick={() => setShowForm(true)}
                variant="contained"
                color="primary"
                size="large"
                endIcon={<RateReviewIcon />}
                disabled={userData.isTestData}
                sx={{
                  minWidth: isMobile ? '100%' : '200px',
                  order: isMobile ? 3 : 3
                }}
              >
                Submit a Review
              </ContactButton>
            </Box>
            
            {/* Reviews Display Section */}
            {reviews.length > 0 ? (
              <>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  {currentReviews.map((review, index) => (
                    <Grid item xs={12} md={6} lg={4} key={review._id || index}>
                      <Card 
                        elevation={3} 
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          position: 'relative',
                          p: 2 
                        }}
                      >
                        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                          <FormatQuoteIcon color="primary" fontSize="large" />
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: getAvatarColor(review.name),
                                mr: 2
                              }}
                            >
                              {getInitials(review.name)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" component="div">
                                {review.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                via {review.where_known_from}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Rating 
                            value={review.rating} 
                            readOnly 
                            size="small" 
                            sx={{ mb: 2 }}
                          />
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {review.content}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                    <Pagination 
                      count={totalPages} 
                      page={page} 
                      onChange={handlePageChange} 
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                    />
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: 'center', my: 4, p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  No reviews yet. Be the first to leave a review!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Your feedback is important and helps others learn about my work.
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <>
            {/* Review Form */}
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={8}>
                <Paper elevation={3} sx={paperContainerStyles}>
                  {/* Form Header with Title and Back Button */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 3,
                    position: 'relative',
                    gap: isMobile ? 2 : 0
                  }}>
                    <Button
                      onClick={() => setShowForm(false)}
                      startIcon={<ArrowBackIcon />}
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ 
                        position: isMobile ? 'relative' : 'absolute', 
                        left: 0 
                      }}
                    >
                      Back to Reviews
                    </Button>
                    
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      sx={{ 
                        ...formHeadingStyles,
                        width: '100%',
                        textAlign: 'center',
                        fontSize: isMobile ? '1.5rem' : '1.75rem'
                      }}
                    >
                      Submit Your Review
                    </Typography>
                  </Box>
                  
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          error={!!errors.name}
                          helperText={errors.name}
                          required
                          variant="outlined"
                          placeholder="John Doe"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControl fullWidth required error={!!errors.where_known_from}>
                          <InputLabel id="where-known-from-label">How Do You Know Me?</InputLabel>
                          <Select
                            labelId="where-known-from-label"
                            name="where_known_from"
                            value={formData.where_known_from}
                            onChange={handleChange}
                            label="How Do You Know Me?"
                          >
                            {knownFromOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.where_known_from && (
                            <FormHelperText>{errors.where_known_from}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      
                      {/* Conditional text field when "Other" is selected */}
                      {formData.where_known_from === 'Other' && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Please specify"
                            name="other_source"
                            value={formData.other_source}
                            onChange={handleChange}
                            variant="outlined"
                            placeholder="Where did you hear about me?"
                            helperText="Optional - please let me know where you found me"
                          />
                        </Grid>
                      )}
                      
                      <Grid item xs={12}>
                        <Typography component="legend" sx={{ mb: 1, color: errors.rating ? theme.palette.error.main : 'inherit' }}>
                          Your Rating*
                        </Typography>
                        <Rating
                          name="rating"
                          value={Number(formData.rating)}
                          onChange={handleRatingChange}
                          precision={1}
                          size="large"
                          sx={{ mb: 1 }}
                        />
                        {errors.rating && (
                          <FormHelperText error>{errors.rating}</FormHelperText>
                        )}
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Review Content"
                          name="content"
                          value={formData.content}
                          onChange={handleChange}
                          error={!!errors.content}
                          helperText={errors.content || `${formData.content.length}/500 characters`}
                          multiline
                          rows={5}
                          required
                          variant="outlined"
                          placeholder="Share your experience working with me or using my services..."
                          inputProps={{ maxLength: 500 }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <ContactButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth={isMobile}
                            size="large"
                            disabled={!isFormValid}
                            endIcon={<RateReviewIcon />}
                            sx={submitButtonStyles(theme, isMobile)}
                          >
                            Submit Review
                          </ContactButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Container>

      {/* Success/Error notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          elevation={6} 
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Index 