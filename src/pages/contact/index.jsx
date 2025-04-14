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
	useMediaQuery
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import ArticleIcon from '@mui/icons-material/Article'
import { useSelector } from 'react-redux'

import { ContactButton, responsiveStyles } from '../home/styles'

const getSocialIcon = (platform) => {
	switch (platform) {
		case 'linkedin': return LinkedInIcon
		case 'github': return GitHubIcon
		case 'document': return ArticleIcon
		default: return null
	}
}

const Index = () => {
	const userData = useSelector((state) => state.user);
	const theme = useTheme()
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

	// Check if form is valid for enabling/disabling submit button
	const isFormValid = useMemo(() => {
		const { name, email, subject, message } = formData
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		
		return (
			name.trim() !== '' && 
			email.trim() !== '' && 
			emailRegex.test(email) &&
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
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const validateForm = () => {
		const newErrors = {}
		
		if (!formData.name.trim()) newErrors.name = 'Name is required'
		if (!formData.email.trim()) newErrors.email = 'Email is required'
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
		if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
		if (!formData.message.trim()) newErrors.message = 'Message is required'
		
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		
		if (validateForm()) {
			// In a real app, you would send the form data to a server here
			console.log('Form submitted:', formData)
			
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
		}
	}

	const handleCloseSnackbar = () => {
		setSnackbar(prev => ({ ...prev, open: false }))
	}

	return (
		<Box sx={{ 
			bgcolor: theme.palette.background.default,
			minHeight: 'calc(100vh - 64px)', // Adjust for app bar height
			backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(30, 45, 90, 0.15) 0%, rgba(30, 45, 90, 0) 70%)',
			py: { xs: 4, md: 8 },
			pt: { xs: `calc(${appBarHeight}px + 2rem)`, md: `calc(${appBarHeight / 2}px + 4rem)` }
		}}>
			<Container maxWidth="lg">
				{/* Page Title */}
				<Box sx={{ mb: 6, textAlign: 'center' }}>
					<Typography 
						variant="subtitle1" 
						component="p" 
						sx={{
							...responsiveStyles?.sectionSubtitle,
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
						sx={{
							fontSize: { xs: '2rem', md: '3rem' },
							fontWeight: 700,
							mb: 2
						}}
					>
						Contact{' '}
						<Typography 
							variant="h2" 
							component="span" 
							color="primary"
							sx={{
								fontSize: 'inherit',
								fontStyle: 'italic'
							}}
						>
							Me
						</Typography>
					</Typography>
					<Typography 
						variant="body1" 
						sx={{ 
							maxWidth: '700px', 
							mx: 'auto',
							color: theme.palette.text.secondary
						}}
					>
						Feel free to reach out with any questions, project inquiries, or just to say hello. 
						I'm always open to discussing new opportunities and ideas.
					</Typography>
				</Box>

				<Grid container spacing={4}>
					{/* Contact Form */}
					<Grid item xs={12}>
						<Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
							<Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
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
											disabled={!isFormValid}
											endIcon={<SendIcon />}
											sx={{ 
												mt: 2,
												bgcolor: theme.palette.primary.main,
												color: theme.palette.primary.contrastText,
												'&:hover': {
													bgcolor: theme.palette.primary.dark,
													boxShadow: theme.shadows[4],
													transform: 'translateY(-2px)',
												},
												'&.Mui-disabled': {
													bgcolor: theme.palette.action.disabledBackground,
													color: theme.palette.action.disabled,
												},
												border: 'none',
												fontWeight: 500
											}}
										>
											Send Message
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
	)
}

export default Index
