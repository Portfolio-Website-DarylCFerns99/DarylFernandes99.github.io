import PropTypes from 'prop-types';
import React from 'react';
import { Box, Container, Grid, Typography, Divider, IconButton, Button, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useSelector } from 'react-redux';

import { getSocialIcon, ROUTES } from '../../common/common';

const Footer = () => {
	const userData = useSelector((state) => state.user);
	const theme = useTheme();
	const location = useLocation();
	const currentYear = new Date().getFullYear();

	// Get social media links from userData
	const getUserSocialLinks = () => {
		return userData.socialLinks.map(link => {
			const Icon = getSocialIcon(link.platform)
			return ({
				icon: <Icon />,
				url: link.url,
				label: link.platform.charAt(0).toUpperCase() + link.platform.slice(1)
			})
		});
	};

	const socialLinks = getUserSocialLinks();
	const userLocation = userData.location ? userData.location.replace("Based in ", "") : "Boston, MA";
	// Hardcoded values for demo, normally would come from userData
	const email = userData.email;
	const phone = userData.phone;

	return (
		<Box 
			component="footer" 
			sx={{ 
				background: theme.palette.mode === 'dark' 
					? 'rgba(10, 15, 30, 0.75)' 
					: 'rgba(250, 250, 255, 0.85)',
				backdropFilter: 'blur(15px)',
				WebkitBackdropFilter: 'blur(15px)', // For Safari
				color: theme.palette.mode === 'dark' ? '#fff' : '#3a3a4c',
				borderTop: '1px solid',
				borderColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(255, 255, 255, 0.5)',
				boxShadow: theme.palette.mode === 'dark'
					? '0 -4px 20px rgba(0, 0, 0, 0.1)'
					: '0 -4px 20px rgba(0, 0, 0, 0.03)',
				py: 4,
				mt: 'auto',
				position: 'relative',
				zIndex: 10
			}}
		>
			<Container maxWidth="lg">
				<Grid container spacing={4} justifyContent="space-between">
					{/* Brand and description */}
					<Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
						<Typography variant="h6" fontWeight={600} gutterBottom>
							{userData.name} {userData.surname}
						</Typography>
						<Typography 
							variant="body2" 
							sx={{ 
								mb: 3,
								color: theme.palette.mode === 'dark' 
									? 'rgba(255, 255, 255, 0.7)' 
									: 'rgba(58, 58, 76, 0.8)'
							}}
						>
							{userData.about.shortdescription}
						</Typography>
						<Box sx={{ mt: 2 }}>
							{socialLinks.map((social, index) => (
								<IconButton 
									key={index}
									component="a"
									href={social.url}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={social.label}
									sx={{ 
										mr: 1.5, 
										color: theme.palette.mode === 'dark' ? '#fff' : '#3a3a4c',
										bgcolor: theme.palette.mode === 'dark' 
											? 'rgba(255, 255, 255, 0.1)' 
											: 'rgba(93, 113, 168, 0.1)',
										'&:hover': {
											bgcolor: theme.palette.mode === 'dark' 
												? 'rgba(255, 255, 255, 0.2)' 
												: 'rgba(93, 113, 168, 0.2)',
											transform: 'translateY(-3px)',
										},
										transition: 'all 0.2s'
									}}
								>
									{social.icon}
								</IconButton>
							))}
						</Box>
					</Grid>

					{/* Quick links - Hidden on mobile */}
					<Grid item xs={12} sm={6} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
						<Typography variant="h6" fontWeight={600} gutterBottom>
							Quick Links
						</Typography>
						<Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
							{ROUTES.map((route) => route.hide ? null : (
								<Button 
									key={route.path} 
									component={Link} 
									to={route.path}
									variant="text"
									startIcon={route.icon && <route.icon />}
									endIcon={<ArrowForwardIcon />}
									sx={{ 
										color: theme.palette.mode === 'dark' ? '#fff' : '#3a3a4c',
										borderColor: theme.palette.mode === 'dark' 
											? 'rgba(255, 255, 255, 0.2)' 
											: 'rgba(93, 113, 168, 0.2)',
										position: 'relative',
										'&:hover': {
											bgcolor: theme.palette.mode === 'dark' 
												? 'rgba(255, 255, 255, 0.1)' 
												: 'rgba(93, 113, 168, 0.1)'
										},
										justifyContent: 'flex-start',
										width: '100%',
										padding: '8px 16px',
										textTransform: 'none',
										fontWeight: location.pathname === route.path ? 500 : 400,
										fontSize: '0.9rem',
									}}
								>
									{route.title}
								</Button>
							))}
						</Box>
					</Grid>

					{/* Contact info */}
					<Grid item xs={12} sm={6} md={4}>
						<Typography variant="h6" fontWeight={600} gutterBottom>
							Contact
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
							<Box component="a" 
								href={`mailto:${email}`}
								sx={{ 
									display: 'flex', 
									alignItems: 'center', 
									gap: 1,
									color: theme.palette.mode === 'dark' ? '#fff' : '#3a3a4c',
									textDecoration: 'none',
									padding: '6px 8px',
									borderRadius: 1,
									transition: 'all 0.2s',
									'&:hover': { 
										backgroundColor: theme.palette.mode === 'dark' 
											? 'rgba(255, 255, 255, 0.1)' 
											: 'rgba(93, 113, 168, 0.1)',
										transform: 'translateX(5px)'
									}
								}}
							>
								<EmailIcon fontSize="small" />
								<Typography variant="body2">
									<strong>Email</strong>: {email}
								</Typography>
							</Box>
							
							<Box component="a" 
								href={`tel:${phone}`}
								sx={{ 
									display: 'flex', 
									alignItems: 'center', 
									gap: 1,
									color: theme.palette.mode === 'dark' ? '#fff' : '#3a3a4c',
									textDecoration: 'none',
									padding: '6px 8px',
									borderRadius: 1,
									transition: 'all 0.2s',
									'&:hover': { 
										backgroundColor: theme.palette.mode === 'dark' 
											? 'rgba(255, 255, 255, 0.1)' 
											: 'rgba(93, 113, 168, 0.1)',
										transform: 'translateX(5px)'
									}
								}}
							>
								<PhoneIcon fontSize="small" />
								<Typography variant="body2">
									<strong>Phone</strong>: {phone}
								</Typography>
							</Box>
							
							<Box component="a" 
								href={`https://maps.app.goo.gl/b2oHYq1jJbZovPgq5`}
								target="_blank"
								rel="noopener noreferrer"
								sx={{ 
									display: 'flex', 
									alignItems: 'center', 
									gap: 1,
									color: theme.palette.mode === 'dark' ? '#fff' : '#3a3a4c',
									textDecoration: 'none',
									padding: '6px 8px',
									borderRadius: 1,
									transition: 'all 0.2s',
									'&:hover': { 
										backgroundColor: theme.palette.mode === 'dark' 
											? 'rgba(255, 255, 255, 0.1)' 
											: 'rgba(93, 113, 168, 0.1)',
										transform: 'translateX(5px)'
									}
								}}
							>
								<LocationOnIcon fontSize="small" />
								<Typography variant="body2">
									<strong>Location</strong>: {userLocation}
								</Typography>
							</Box>
						</Box>
					</Grid>
				</Grid>

				<Divider sx={{ 
					mt: 4, 
					mb: 3, 
					bgcolor: theme.palette.mode === 'dark' 
						? 'rgba(255, 255, 255, 0.1)' 
						: 'rgba(93, 113, 168, 0.1)' 
				}} />
				
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<Typography 
						variant="body2" 
						align="center"
						sx={{ 
							color: theme.palette.mode === 'dark' 
								? 'rgba(255, 255, 255, 0.6)' 
								: 'rgba(58, 58, 76, 0.6)'
						}}
					>
						© {currentYear} {userData.name} {userData.surname}
					</Typography>
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;
