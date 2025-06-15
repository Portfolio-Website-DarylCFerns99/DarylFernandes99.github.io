import { Box, Container, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

const Footer = () => {
	const userData = useSelector((state) => state.user);
	const theme = useTheme();
	const currentYear = new Date().getFullYear();

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
				py: { xs: 1, md: 2 },
				mt: 'auto',
				position: 'relative',
				zIndex: 10
			}}
		>
			<Container maxWidth="lg">
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
