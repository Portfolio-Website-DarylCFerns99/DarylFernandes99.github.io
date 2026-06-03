import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    useTheme,
    CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { updateProfile } from '../../../api/services/userService';
import { useAdmin } from '../context/AdminContext';

const RagExtraInfoSection = () => {
    const theme = useTheme();
    const { profile, setProfile, loading: contextLoading } = useAdmin();
    const [loading, setLoading] = useState(true);
    const [extraInfo, setExtraInfo] = useState('');

    useEffect(() => {
        if (profile) {
            setExtraInfo(profile.extra_rag_info || '');
            setLoading(false);
        } else if (!contextLoading) {
            setLoading(false);
        }
    }, [profile, contextLoading]);

    const handleCancel = () => {
        if (profile) {
            setExtraInfo(profile.extra_rag_info || '');
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const payload = { extra_rag_info: extraInfo };
            const updatedProfile = await updateProfile(payload);
            setProfile(updatedProfile);
            setLoading(false);
            toast.success('RAG Extra Information saved successfully!');
        } catch (error) {
            console.error('Error saving RAG Extra Info:', error);
            setLoading(false);
            toast.error('Failed to save RAG Extra Information');
        }
    };

    if (contextLoading && !extraInfo) {
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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Provide extra background information or instructions that the AI assistant can use to answer questions, but will NOT be visible on your public portfolio page (e.g. Visa status, notice periods, location preferences, salary expectations).
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Extra RAG Context"
                        name="extra_rag_info"
                        value={extraInfo}
                        onChange={(e) => setExtraInfo(e.target.value)}
                        margin="normal"
                        variant="outlined"
                        multiline
                        rows={10}
                        placeholder="Examples:&#10;- Visa Status: US Citizen / H1B Sponsor needed.&#10;- Relocation: Open to hybrid work in San Francisco/New York or fully remote.&#10;- Availability: Available immediately / 2-week notice period.&#10;- Salary Preference: Open to discuss."
                        helperText="Use clear sentences so the RAG bot retrieves and reads this information correctly."
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                    onClick={handleCancel}
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

export default RagExtraInfoSection;
