import { useState, useEffect, useMemo, Fragment } from 'react'
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
	useMediaQuery
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { sendContactMessage } from '../../api/services/contactService'

import { useSelector } from 'react-redux'
import { ContactButton, responsiveStyles } from './styles'
import { DynamicSEO } from '../../components/SEO/DynamicSEO'

// Define validation patterns
const VALIDATION_PATTERNS = {
	// Allow letters, spaces, hyphens and apostrophes with min 2 chars
	name: /^[A-Za-z\s'-]{2,50}$/,
	// More comprehensive email validation
	email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
}

const Index = () => {
	const theme = useTheme()
	const userData = useSelector((state) => state.user);
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const [appBarHeight, setAppBarHeight] = useState(64) // Default height
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: ''
	})
	const [errors, setErrors] = useState({})
	const [snackbar, setSnackbar] = useState({
		open: false,
		severity: 'success',
		message: ''
	})
	const [loading, setLoading] = useState(false)

	// Check if form is valid for enabling/disabling submit button
	const isFormValid = useMemo(() => {
		const { name, email, subject, message } = formData
		
		return (
			name.trim() !== '' && 
			email.trim() !== '' && 
			VALIDATION_PATTERNS.name.test(name) &&
			VALIDATION_PATTERNS.email.test(email) &&
			subject.trim() !== '' && 
			message.trim() !== '' &&
			Object.keys(errors).length === 0
		)
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

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
		
		// Clear error when user types
		if (errors[name]) {
			setErrors(prev => {
				const newErrors = { ...prev }
				delete newErrors[name]
				return newErrors
			})
		}
		
		// Validate field on change if it has a value
		if (value.trim() && VALIDATION_PATTERNS[name]) {
			if (!VALIDATION_PATTERNS[name].test(value)) {
				setErrors(prev => ({ 
					...prev, 
					[name]: name === 'name' 
						? 'Please enter a valid name (letters, spaces, hyphens and apostrophes only)'
						: 'Please enter a valid email address'
				}))
			}
		}
	}

	const validateForm = () => {
		const newErrors = {}
		
		// Validate name field
		if (!formData.name.trim()) {
			newErrors.name = 'Name is required'
		} else if (!VALIDATION_PATTERNS.name.test(formData.name)) {
			newErrors.name = 'Please enter a valid name (letters, spaces, hyphens and apostrophes only)'
		}
		
		// Validate email field
		if (!formData.email.trim()) {
			newErrors.email = 'Email is required'
		} else if (!VALIDATION_PATTERNS.email.test(formData.email)) {
			newErrors.email = 'Please enter a valid email address'
		}
		
		// Validate other fields
		if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
		if (!formData.message.trim()) newErrors.message = 'Message is required'
		
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		
		if (validateForm()) {
			setLoading(true)
			try {
				// Use the portfolio owner's ID - in a real app, this might come from an environment variable or state
				const userId = import.meta.env.VITE_USER_ID || 'default-user-id'
				
				// Send the contact form data to the API
				await sendContactMessage(userId, formData)
				
				// Show success message
				setSnackbar({
					open: true,
					severity: 'success',
					message: 'Thank you for your message! I will get back to you soon.'
				})
				
				// Reset form
				setFormData({
					name: '',
					email: '',
					subject: '',
					message: ''
				})
			} catch (error) {
				console.error('Error sending contact message:', error)
				setSnackbar({
					open: true,
					severity: 'error',
					message: 'Sorry, there was an error sending your message. Please try again later.'
				})
			} finally {
				setLoading(false)
			}
		}
	}

	const handleCloseSnackbar = () => {
		setSnackbar(prev => ({ ...prev, open: false }))
	}

	return (
		<Fragment>
			<DynamicSEO 
				title="Contact"
				description={`Contact ${userData?.name} ${userData?.surname}`}
			/>
			<Box sx={{ 
				...responsiveStyles.mainContainer,
				pt: { xs: `calc(${appBarHeight}px + 2rem)`, md: `calc(${appBarHeight / 2}px + 4rem)` },
				bgcolor: theme.palette.background.default,
			}}>
				<Container maxWidth="lg">
					{/* Page Title */}
					<Box sx={{ mb: 6, textAlign: 'center' }}>
						<Typography 
							variant="subtitle1" 
							component="p" 
							sx={{
								...responsiveStyles.sectionSubtitle,
								color: theme.palette.text.secondary,
								fontWeight: 500,
								mb: 1
							}}
						>
							Get in Touch
						</Typography>
						<Typography 
							variant="h2" 
							component="h1" 
							sx={responsiveStyles.pageTitle}
						>
							Contact{' '}
							<Typography 
								variant="h2" 
								component="span" 
								color="primary"
								sx={responsiveStyles.pageTitleSpan}
							>
								Me
							</Typography>
						</Typography>
						<Typography 
							variant="body1" 
							sx={{ 
								...responsiveStyles.pageDescription,
								color: theme.palette.text.secondary
							}}
						>
							Feel free to reach out with any questions, project inquiries, or just to say hello. 
							I&apos;m always open to discussing new opportunities and ideas.
						</Typography>
					</Box>

					<Grid container spacing={4}>
						{/* Contact Form */}
						<Grid item xs={12}>
							<Paper elevation={3} sx={responsiveStyles.contactForm}>
								<Typography variant="h5" component="h2" sx={responsiveStyles.formTitle}>
									Send a Message
								</Typography>
								
								<form onSubmit={handleSubmit}>
									<Grid container spacing={2}>
										<Grid item xs={12} sm={6}>
											<TextField
												fullWidth
												label="Your Name"
												name="name"
												value={formData.name}
												onChange={handleChange}
												error={!!errors.name}
												helperText={errors.name}
												required
												variant="outlined"
											/>
										</Grid>
										<Grid item xs={12} sm={6}>
											<TextField
												fullWidth
												label="Your Email"
												name="email"
												type="email"
												value={formData.email}
												onChange={handleChange}
												error={!!errors.email}
												helperText={errors.email}
												required
												variant="outlined"
											/>
										</Grid>
										<Grid item xs={12}>
											<TextField
												fullWidth
												label="Subject"
												name="subject"
												value={formData.subject}
												onChange={handleChange}
												error={!!errors.subject}
												helperText={errors.subject}
												required
												variant="outlined"
											/>
										</Grid>
										<Grid item xs={12}>
											<TextField
												fullWidth
												label="Your Message"
												name="message"
												value={formData.message}
												onChange={handleChange}
												error={!!errors.message}
												helperText={errors.message}
												multiline
												rows={5}
												required
												variant="outlined"
											/>
										</Grid>
										<Grid item xs={12}>
											<ContactButton
												type="submit"
												variant="contained"
												color="primary"
												fullWidth={isMobile}
												size="large"
												disabled={!isFormValid || loading || userData.isTestData}
												endIcon={<SendIcon />}
											>
												{loading ? 'Sending...' : 'Send Message'}
											</ContactButton>
										</Grid>
									</Grid>
								</form>
							</Paper>
						</Grid>
					</Grid>
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
		</Fragment>
	)
}

export default Index
