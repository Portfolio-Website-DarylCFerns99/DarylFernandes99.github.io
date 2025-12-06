import React, { useRef, useState, useEffect } from 'react';
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
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import { fileToBase64 } from '../../../common/common';
import { motion } from 'framer-motion';
import { getProfile, updateProfile } from '../../../api/services/userService';

const AboutSection = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [aboutInfo, setAboutInfo] = useState({
        description: "",
        shortdescription: "",
        image: ""
    });

    useEffect(() => {
        fetchAboutInfo();
    }, []);

    const fetchAboutInfo = async () => {
        try {
            setLoading(true);
            const data = await getProfile();
            setAboutInfo(data.about || { description: "", shortdescription: "", image: "" });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching about info:', error);
            toast.error('Failed to load about information');
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const payload = { about: aboutInfo };
            const updatedProfile = await updateProfile(payload);
            if (updatedProfile.about) {
                setAboutInfo(updatedProfile.about);
            }
            setLoading(false);
            toast.success('About information saved successfully!');
        } catch (error) {
            console.error('Error saving about info:', error);
            setLoading(false);
            toast.error('Failed to save about information');
        }
    };

    const handleAboutChange = (e) => {
        const { name, value } = e.target;

        // Apply character limits
        let limitedValue = value;
        if (name === 'shortdescription' && value.length > 200) {
            limitedValue = value.slice(0, 200);
        } else if (name === 'description' && value.length > 500) {
            limitedValue = value.slice(0, 500);
        }

        setAboutInfo(prev => ({
            ...prev,
            [name]: limitedValue
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Convert the selected image to base64
                const base64 = await fileToBase64(file);

                setAboutInfo(prev => ({
                    ...prev,
                    image: base64
                }));
                toast.success('About image uploaded successfully!');
            } catch (error) {
                console.error('Error converting image to base64:', error);
                toast.error('Failed to upload about image');
            }
        }
    };

    // Create a hidden file input element for about image upload
    const fileInputRef = useRef(null);

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    if (loading && !aboutInfo.description && !aboutInfo.shortdescription) {
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
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Short Description"
                        name="shortdescription"
                        value={aboutInfo?.shortdescription || ''}
                        onChange={handleAboutChange}
                        margin="normal"
                        variant="outlined"
                        multiline
                        rows={2}
                        inputProps={{
                            maxLength: 200
                        }}
                        helperText={`${aboutInfo?.shortdescription?.length || 0}/200 characters`}
                        placeholder="Brief introduction (1-2 lines)"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Full Description"
                        name="description"
                        value={aboutInfo?.description || ''}
                        onChange={handleAboutChange}
                        margin="normal"
                        variant="outlined"
                        multiline
                        rows={4}
                        inputProps={{
                            maxLength: 500
                        }}
                        helperText={`${aboutInfo?.description?.length || 0}/500 characters`}
                        placeholder="Detailed about me section (bio, background, etc.)"
                    />
                </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                About Image
            </Typography>
            <Box sx={{ mb: 2 }}>
                <Box
                    component={motion.div}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    sx={{
                        width: 250,
                        height: 150,
                        bgcolor: 'background.paper',
                        border: '1px dashed',
                        borderColor: 'primary.main',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        position: 'relative',
                        '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                        }
                    }}
                    onClick={triggerFileInput}
                >
                    {aboutInfo?.image ? (
                        <img
                            src={aboutInfo.image}
                            alt="About section"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <Box sx={{ textAlign: 'center' }}>
                            <AddIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
                            <Typography variant="caption" display="block" color="primary.main">
                                Click to upload
                            </Typography>
                        </Box>
                    )}
                </Box>
                {/* Hidden file input for about image upload */}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleImageUpload}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        sx={{ color: 'white' }}
                        onClick={triggerFileInput}
                    >
                        {aboutInfo?.image ? 'Change Image' : 'Upload Image'}
                    </Button>
                    {aboutInfo?.image && (
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => setAboutInfo(prev => ({ ...prev, image: '' }))}
                        >
                            Remove Image
                        </Button>
                    )}
                </Box>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                    onClick={() => fetchAboutInfo()}
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

export default AboutSection;
