import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    useTheme,
    alpha,
    CircularProgress
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { fileToBase64 } from '../../../common/common';
import { getProfile, updateProfile } from '../../../api/services/userService';

const BasicInfoSection = ({ setUserForSidebar }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [basicInfo, setBasicInfo] = useState({
        id: "",
        username: "",
        email: "",
        name: "",
        surname: "",
        title: "",
        phone: "",
        location: "",
        availability: "",
        avatar: "",
        created_at: "",
        updated_at: ""
    });

    // Phone validation and formatting
    const [phoneError, setPhoneError] = useState('');
    const [countryCode, setCountryCode] = useState('+1');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await getProfile();
            const { social_links, about, featured_skill_ids, ...basicInfoData } = data;
            setBasicInfo(basicInfoData);

            // Update sidebar user info if provided
            if (setUserForSidebar) {
                setUserForSidebar({
                    name: basicInfoData.name,
                    surname: basicInfoData.surname,
                    avatar: basicInfoData.avatar
                });
            }

            // Set country code if phone exists
            if (basicInfoData.phone && basicInfoData.phone.startsWith('+')) {
                const parts = basicInfoData.phone.split(' ');
                if (parts.length > 0) {
                    setCountryCode(parts[0]);
                }
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile data');
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const updatedProfile = await updateProfile(basicInfo);
            const { social_links, about, ...basicInfoData } = updatedProfile;
            setBasicInfo(basicInfoData);

            if (setUserForSidebar) {
                setUserForSidebar({
                    name: basicInfoData.name,
                    surname: basicInfoData.surname,
                    avatar: basicInfoData.avatar
                });
            }

            setLoading(false);
            toast.success('Basic information saved successfully!');
        } catch (error) {
            console.error('Error saving basic info:', error);
            setLoading(false);
            toast.error('Failed to save basic information');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBasicInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Format just the phone part (without country code)
    const formatPhoneNumber = (phoneNumber) => {
        // Remove all non-digit characters for processing
        const digitsOnly = phoneNumber.replace(/[^\d]/g, '');

        // Handle empty input
        if (!digitsOnly) return '';

        // Format based on length
        if (digitsOnly.length <= 3) {
            return digitsOnly;
        } else if (digitsOnly.length <= 6) {
            return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
        } else if (digitsOnly.length <= 10) {
            return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
        } else {
            // If more than 10 digits, assume the extra digits are an extension
            return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)} ext ${digitsOnly.slice(10)}`;
        }
    };

    // Extract phone number without country code from the combined phone
    const extractPhoneWithoutCode = (fullPhone) => {
        if (!fullPhone) return '';

        // If it starts with +, remove country code
        if (fullPhone.startsWith('+')) {
            const parts = fullPhone.split(' ');
            if (parts.length > 1) {
                return parts.slice(1).join(' ');
            }
            return '';
        }

        return fullPhone;
    };

    const validatePhone = (phoneNumber) => {
        // We're now just validating the phone part without the country code
        const phoneRegex = /^\(([0-9]{3})\)\s([0-9]{3})\-([0-9]{4})(\sext\s[0-9]+)?$/;

        if (!phoneNumber) return true; // Empty is valid (not required)
        return phoneRegex.test(phoneNumber);
    };

    const handleCountryCodeChange = (e) => {
        const { value } = e.target;
        setCountryCode(value);
    };

    const handlePhoneChange = (e) => {
        const { value } = e.target;

        // Keep cursor position stable during formatting
        const cursorPosition = e.target.selectionStart;
        const previousValue = extractPhoneWithoutCode(basicInfo.phone) || '';
        const previousValueLength = previousValue.length;

        // Format the phone number
        const formattedValue = formatPhoneNumber(value);

        // Combine country code with formatted phone for storage
        const combinedPhone = formattedValue ? `${countryCode} ${formattedValue}` : countryCode;

        // Update the state
        setBasicInfo(prev => ({
            ...prev,
            phone: combinedPhone
        }));

        // Validate the phone number
        setPhoneError(validatePhone(formattedValue) ? '' : 'Please enter a valid phone number');

        // Adjust cursor position after React updates the DOM
        setTimeout(() => {
            // Only set cursor position if input is still focused
            if (e.target === document.activeElement) {
                // Calculate new cursor position
                const valueAddedLength = formattedValue.length - previousValueLength;
                const newPosition = Math.min(cursorPosition + valueAddedLength, formattedValue.length);
                e.target.setSelectionRange(newPosition, newPosition);
            }
        }, 0);
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Convert the selected image to base64
                const base64 = await fileToBase64(file);
                // Update the basicInfo state with the base64 image
                setBasicInfo(prev => ({
                    ...prev,
                    avatar: base64
                }));
                toast.success('Avatar uploaded successfully!');
            } catch (error) {
                console.error('Error converting image to base64:', error);
                toast.error('Failed to upload avatar');
            }
        }
    };

    // Create a hidden file input element for avatar upload
    const fileInputRef = useRef(null);

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    if (loading && !basicInfo.id) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Typography variant="h6" gutterBottom>
                Avatar
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <Box
                        component={motion.div}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        sx={{
                            width: 150,
                            height: 150,
                            bgcolor: 'background.paper',
                            border: '1px dashed',
                            borderColor: 'primary.main',
                            borderRadius: '50%', // Circular avatar container
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            position: 'relative',
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.05)
                            }
                        }}
                        onClick={triggerFileInput}
                    >
                        {basicInfo.avatar ? (
                            <img src={basicInfo.avatar} alt="User avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column'
                                }}
                            >
                                <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
                            </Box>
                        )}
                    </Box>
                    {/* Hidden file input for avatar upload */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleAvatarUpload}
                    />
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            sx={{ color: 'white' }}
                            onClick={triggerFileInput}
                        >
                            Upload
                        </Button>
                        {basicInfo.avatar && (
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => setBasicInfo(prev => ({ ...prev, avatar: '' }))}
                            >
                                Remove
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Personal Information
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={basicInfo.name}
                        onChange={handleInputChange}
                        margin="normal"
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Surname"
                        name="surname"
                        value={basicInfo.surname}
                        onChange={handleInputChange}
                        margin="normal"
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={basicInfo.username}
                        onChange={handleInputChange}
                        margin="normal"
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={basicInfo.title}
                        onChange={handleInputChange}
                        margin="normal"
                        variant="outlined"
                    />
                </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Contact Information
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={basicInfo.email}
                        margin="normal"
                        variant="outlined"
                        disabled
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        {/* Country code field */}
                        <TextField
                            label="Code"
                            value={countryCode}
                            onChange={handleCountryCodeChange}
                            margin="normal"
                            variant="outlined"
                            placeholder="+1"
                            sx={{ width: '80px' }}
                        />
                        {/* Phone number field */}
                        <TextField
                            fullWidth
                            label="Phone Number"
                            value={extractPhoneWithoutCode(basicInfo.phone)}
                            onChange={handlePhoneChange}
                            margin="normal"
                            variant="outlined"
                            error={!!phoneError}
                            helperText={phoneError || "Format: (123) 456-7890"}
                            placeholder="(123) 456-7890"
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={basicInfo.location}
                        onChange={handleInputChange}
                        margin="normal"
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Availability"
                        name="availability"
                        value={basicInfo.availability}
                        onChange={handleInputChange}
                        margin="normal"
                        variant="outlined"
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                    onClick={() => fetchProfile()}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </Box>
        </motion.div>
    );
};

export default BasicInfoSection;
