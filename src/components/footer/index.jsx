import React, { memo } from 'react';
import { Box, Container, Typography, useTheme, Stack, IconButton, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { getSocialIcon } from '../../common/common';

const Footer = memo(() => {
	const userData = useSelector((state) => state.user);
	const theme = useTheme();
	const currentYear = new Date().getFullYear();

	const getIcon = (platform) => {
		const Icon = getSocialIcon(platform);
		return <Icon fontSize="small" />;
	};

	const handleSocialLinkClick = (social) => {
		if (social.platform === 'document' && social.url.startsWith('data:')) {
			const newWindow = window.open();
			newWindow.document.write(`
                <iframe 
                    src="${social.url}" 
                    style="width:100%; height:100vh; border:none;"
                    title="${social.tooltip || social.fileName || 'Document'}"
                ></iframe>
            `);
			newWindow.document.title = social.tooltip || social.fileName || 'Document';
		} else {
			window.open(social.url, '_blank', 'noopener,noreferrer');
		}
	};

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
				py: 2,
				mt: 'auto',
				position: 'relative',
				zIndex: 10
			}}
		>
			<Container maxWidth="lg">
				<Box sx={{
					display: 'flex',
					flexDirection: { xs: 'column', md: 'row' },
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: 2
				}}>
					<Typography
						variant="body2"
						align="center"
						sx={{
							color: theme.palette.mode === 'dark'
								? 'rgba(255, 255, 255, 0.6)'
								: 'rgba(58, 58, 76, 0.6)'
						}}
					>
						© {currentYear} {userData.name} {userData.surname}. All rights reserved.
					</Typography>

					<Stack direction="row" spacing={1}>
						{userData.socialLinks && userData.socialLinks.map((social, index) => (
							<Tooltip key={index} title={social.tooltip || social.platform}>
								<IconButton
									onClick={() => handleSocialLinkClick(social)}
									size="small"
									sx={{
										color: theme.palette.text.secondary,
										transition: 'all 0.2s',
										'&:hover': {
											color: theme.palette.primary.main,
											transform: 'translateY(-2px)',
											bgcolor: theme.palette.mode === 'dark'
												? 'rgba(255, 255, 255, 0.05)'
												: 'rgba(0, 0, 0, 0.05)'
										}
									}}
								>
									{getIcon(social.platform)}
								</IconButton>
							</Tooltip>
						))}
					</Stack>
				</Box>
			</Container>
		</Box>
	);
});

export default Footer;
