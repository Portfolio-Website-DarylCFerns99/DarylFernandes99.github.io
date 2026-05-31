import React, { memo, useState, useMemo } from 'react';
import {
	Box,
	Container,
	Typography,
	useTheme,
	Stack,
	IconButton,
	Tooltip,
	Grid,
	Avatar,
	TextField,
	Button
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import { getSocialIcon } from '../../common/common';
import { sendContactMessage } from '../../api/services/contactService';

const VALIDATION_PATTERNS = {
	name: /^[A-Za-z\s'-]{2,50}$/,
	email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
};

const Footer = memo(() => {
	const userData = useSelector((state) => state.user);
	const theme = useTheme();
	const currentYear = new Date().getFullYear();

	// Form states
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: ''
	});
	const [formErrors, setFormErrors] = useState({});
	const [formLoading, setFormLoading] = useState(false);

	const isContactFormValid = useMemo(() => {
		const { name, email, subject, message } = formData;
		return (
			name.trim() !== '' &&
			email.trim() !== '' &&
			VALIDATION_PATTERNS.name.test(name) &&
			VALIDATION_PATTERNS.email.test(email) &&
			subject.trim() !== '' &&
			message.trim() !== '' &&
			Object.keys(formErrors).length === 0
		);
	}, [formData, formErrors]);

	const handleContactChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));

		if (name === 'name' || name === 'email') {
			if (value.trim() && VALIDATION_PATTERNS[name]) {
				if (!VALIDATION_PATTERNS[name].test(value)) {
					setFormErrors(prev => ({
						...prev,
						[name]: name === 'name'
							? 'Please enter a valid name (letters/spaces)'
							: 'Please enter a valid email address'
					}));
				} else {
					setFormErrors(prev => {
						const copy = { ...prev };
						delete copy[name];
						return copy;
					});
				}
			} else {
				setFormErrors(prev => {
					const copy = { ...prev };
					delete copy[name];
					return copy;
				});
			}
		}
	};

	const handleContactSubmit = async (e) => {
		e.preventDefault();
		if (!isContactFormValid) return;

		setFormLoading(true);
		try {
			const userId = import.meta.env.VITE_USER_ID || 'default-user-id';
			await sendContactMessage(userId, formData);
			toast.success('Thank you! Your message was sent successfully.');
			setFormData({ name: '', email: '', subject: '', message: '' });
		} catch (error) {
			console.error(error);
			toast.error('Error sending message. Please try again later.');
		} finally {
			setFormLoading(false);
		}
	};

	const handleSocialLinkClick = (social) => {
		if (social.platform === 'document' && social.url?.startsWith('data:')) {
			const newWindow = window.open();
			if (newWindow) {
				newWindow.document.write(`
					<iframe 
						src="${social.url}" 
						style="width:100%; height:100vh; border:none; margin:0; padding:0; display:block;"
						title="${social.tooltip || social.fileName || 'Document'}"
					></iframe>
					<style>body { margin: 0; overflow: hidden; }</style>
				`);
				newWindow.document.title = social.tooltip || social.fileName || 'Document';
				newWindow.document.close();
			}
		} else {
			window.open(social.url, '_blank', 'noopener,noreferrer');
		}
	};

	return (
		<Box
			component="footer"
			id="contact"
			sx={{
				backgroundColor: theme => theme.palette.mode === 'dark' ? '#0b0f10' : '#f8f9ff',
				borderTop: theme => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#E2E8F0'}`,
				padding: theme => theme.spacing(10, 0, 4),
				width: '100%',
				position: 'relative',
				zIndex: 10,
			}}
		>
			<Container maxWidth="lg">
				<Grid container spacing={6}>
					{/* Column 1: Let's Build */}
					<Grid item xs={12} md={6} sx={{ textAlign: 'left' }}>
						<Typography
							variant="h6"
							sx={{
								fontWeight: 700,
								fontSize: '0.85rem',
								fontFamily: `'JetBrains Mono', monospace`,
								color: 'primary.main',
								letterSpacing: '0.1em',
								textTransform: 'uppercase',
								mb: 3,
							}}
						>
							Let's Build Something
						</Typography>
						<Typography
							variant="h5"
							sx={{
								fontWeight: 800,
								fontSize: '1.25rem',
								lineHeight: 1.3,
								mb: 3,
								textTransform: 'uppercase',
							}}
						>
							Have a project in mind or just want to say hello? I'd love to hear from you.
						</Typography>

						<Stack spacing={2.5}>
							{userData.email && (
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
									<EmailIcon sx={{ color: 'primary.main', fontSize: 20 }} />
									<Typography
										component="a"
										href={`mailto:${userData.email}`}
										target="_blank"
										rel="noopener noreferrer"
										variant="body2"
										sx={{
											color: 'text.secondary',
											textDecoration: 'none',
											'&:hover': {
												color: 'primary.main',
												textDecoration: 'underline',
											}
										}}
									>
										{userData.email}
									</Typography>
								</Box>
							)}
							{userData.location && (
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
									<Box sx={{ width: 20, display: 'flex', justifyContent: 'center' }}>
										<Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>@</Typography>
									</Box>
									<Typography variant="body2" color="text.secondary">
										{userData.location}
									</Typography>
								</Box>
							)}
							{userData.socialLinks?.map((social, index) => {
								if (social.platform === 'document') return null;
								const Icon = getSocialIcon(social.platform) || GitHubIcon;
								return (
									<Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
										<Icon sx={{ color: 'primary.main', fontSize: 20 }} />
										<Typography
											component="a"
											href={social.url}
											target="_blank"
											rel="noopener noreferrer"
											variant="body2"
											sx={{
												color: 'text.secondary',
												textDecoration: 'none',
												'&:hover': {
													color: 'primary.main',
													textDecoration: 'underline',
												}
											}}
										>
											{social.url.replace(/^https?:\/\/(www\.)?/, '')}
										</Typography>
									</Box>
								);
							})}
						</Stack>
					</Grid>

					{/* Column 2: Contact Form */}
					<Grid item xs={12} md={6} sx={{ textAlign: 'left' }}>
						<Typography
							variant="h6"
							sx={{
								fontWeight: 700,
								fontSize: '0.85rem',
								fontFamily: `'JetBrains Mono', monospace`,
								color: 'primary.main',
								letterSpacing: '0.1em',
								textTransform: 'uppercase',
								mb: 3,
							}}
						>
							Send a Message
						</Typography>

						<form onSubmit={handleContactSubmit}>
							<Stack spacing={2}>
								<TextField
									fullWidth
									label="Your Name"
									name="name"
									value={formData.name}
									onChange={handleContactChange}
									error={!!formErrors.name}
									helperText={formErrors.name}
									required
									variant="outlined"
									size="small"
									sx={{
										'& .MuiOutlinedInput-root': {
											borderRadius: '4px',
											bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
										}
									}}
								/>
								<TextField
									fullWidth
									label="Your Email"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleContactChange}
									error={!!formErrors.email}
									helperText={formErrors.email}
									required
									variant="outlined"
									size="small"
									sx={{
										'& .MuiOutlinedInput-root': {
											borderRadius: '4px',
											bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
										}
									}}
								/>
								<TextField
									fullWidth
									label="Subject"
									name="subject"
									value={formData.subject}
									onChange={handleContactChange}
									error={!!formErrors.subject}
									helperText={formErrors.subject}
									required
									variant="outlined"
									size="small"
									sx={{
										'& .MuiOutlinedInput-root': {
											borderRadius: '4px',
											bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
										}
									}}
								/>
								<TextField
									fullWidth
									label="Your Message"
									name="message"
									value={formData.message}
									onChange={handleContactChange}
									error={!!formErrors.message}
									helperText={formErrors.message}
									multiline
									rows={4}
									required
									variant="outlined"
									size="small"
									sx={{
										'& .MuiOutlinedInput-root': {
											borderRadius: '4px',
											bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
										}
									}}
								/>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									disabled={!isContactFormValid || formLoading}
									endIcon={<SendIcon />}
									sx={{
										py: 1.2,
										fontSize: '0.85rem',
										fontWeight: 600,
									}}
								>
									{formLoading ? 'Sending...' : 'Send Message'}
								</Button>
							</Stack>
						</form>
					</Grid>
				</Grid>

				{/* Bottom Bar */}
				<Box sx={{
					mt: 8,
					pt: 4,
					borderTop: theme => `1px solid ${theme.palette.divider}`,
					display: 'flex',
					flexDirection: { xs: 'column', sm: 'row' },
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: 2,
				}}>
					<Typography variant="caption" color="text.secondary">
						© {currentYear} {userData.name} {userData.surname}. All rights reserved.
					</Typography>
					<Typography
						variant="caption"
						color="text.secondary"
						sx={{
							fontFamily: `'JetBrains Mono', monospace`,
							textTransform: 'uppercase',
							letterSpacing: '0.05em',
						}}
					>
						Built with code. Guided by values. Ruled by purpose.
					</Typography>
					<Stack direction="row" spacing={1.5}>
						{userData.socialLinks?.map((social, index) => {
							if (social.platform === 'document') return null;
							const Icon = getSocialIcon(social.platform) || GitHubIcon;
							return (
								<IconButton
									key={index}
									onClick={() => handleSocialLinkClick(social)}
									size="small"
									sx={{
										color: 'text.secondary',
										'&:hover': { color: 'primary.main' }
									}}
								>
									<Icon fontSize="small" />
								</IconButton>
							);
						})}
					</Stack>
				</Box>
			</Container>
		</Box>
	);
});

export default Footer;
