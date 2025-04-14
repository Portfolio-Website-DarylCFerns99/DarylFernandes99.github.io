import React from 'react'
import { Link } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import { Box, Typography, Button, Container } from '@mui/material'

const Index = () => {
	return (
		<Container maxWidth="md">
			<Box 
				sx={{ 
					display: 'flex', 
					flexDirection: 'column', 
					alignItems: 'center', 
					justifyContent: 'center',
					minHeight: '70vh',
					textAlign: 'center',
					py: 8
				}}
			>
				<Typography variant="h1" color="error" gutterBottom>
					404
				</Typography>
				<Typography variant="h4" gutterBottom>
					Page Not Found
				</Typography>
				<Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
					The page you're looking for doesn't exist or has been moved.
				</Typography>
				<Button 
					component={Link} 
					to="/" 
					variant="contained" 
					color="primary" 
					startIcon={<HomeIcon />}
					size="large"
				>
					Back to Home
				</Button>
			</Box>
		</Container>
	)
}

export default Index
