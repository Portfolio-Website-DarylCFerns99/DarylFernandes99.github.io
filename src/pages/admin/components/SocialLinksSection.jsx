import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Card,
    Grid,
    TextField,
    MenuItem,
    Button,
    useTheme,
    alpha,
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { typeMapping, fileToBase64 } from '../../../common/common';
import { getProfile, updateProfile } from '../../../api/services/userService';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const SocialLinksSection = () => {
    const theme = useTheme();
    const [socialLinks, setSocialLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for the form to add/edit a social link
    const [newLink, setNewLink] = useState({
        platform: "",
        url: "",
        tooltip: ""
    });
    const [editIndex, setEditIndex] = useState(-1);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        item: null,
        index: -1
    });

    useEffect(() => {
        fetchSocialLinks();
    }, []);

    const fetchSocialLinks = async () => {
        try {
            setLoading(true);
            const data = await getProfile();
            setSocialLinks(data.social_links || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching social links:', error);
            toast.error('Failed to load social links');
            setLoading(false);
        }
    };

    const handleAddLink = () => {
        const firstType = Object.keys(typeMapping)?.[0];
        setNewLink({ platform: firstType, url: "", tooltip: typeMapping?.[firstType]?.tooltip });
        setEditIndex(-1);
        setShowForm(true);
    };

    const handleEditLink = (index) => {
        const tempData = socialLinks[index]
        if (typeMapping?.[tempData?.platform]?.inputType !== "link")
            tempData.url = ""
        setNewLink({ ...socialLinks[index] });
        setEditIndex(index);
        setShowForm(true);
    };

    const handleDeleteClick = (index) => {
        setDeleteDialog({
            open: true,
            item: socialLinks[index],
            index: index
        });
    };

    const handleDeleteConfirm = async () => {
        const { index } = deleteDialog;
        if (index === -1) return;

        setSaving(true);
        try {
            // Create updated array without the deleted link
            const updatedLinks = [...socialLinks];
            updatedLinks.splice(index, 1);

            // Update API directly
            const payload = {
                social_links: updatedLinks
            };

            const updatedProfile = await updateProfile(payload);

            // Update state with response from server
            if (updatedProfile.social_links) {
                setSocialLinks(updatedProfile.social_links);
            }

            toast.success('Social link deleted successfully');
        } catch (error) {
            console.error('Error deleting social link:', error);
            toast.error('Failed to delete social link');
        } finally {
            setSaving(false);
            setDeleteDialog({ open: false, item: null, index: -1 });
        }
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialog({ open: false, item: null, index: -1 });
    };

    const handleLinkChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "platform") {
            const firstType = typeMapping[value];
            setNewLink({ platform: value, url: "", tooltip: firstType?.tooltip });
        } else if (name === "url" && files && files.length > 0) {
            // For file inputs, store the file object itself
            const file = files[0];
            setNewLink(prev => ({
                ...prev,
                [name]: file,
                fileName: file.name // Store the filename separately
            }));
        } else {
            setNewLink(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSaveLink = async () => {
        setSaving(true);
        try {
            // Create a copy of the new link object
            const linkToSave = { ...newLink };

            // If the URL is a file object, process it
            if (linkToSave.url instanceof File) {
                try {
                    // Store the filename for display in the table
                    linkToSave.fileName = linkToSave.url.name;

                    // Convert file to base64
                    linkToSave.url = await fileToBase64(linkToSave.url);

                    console.log(`File prepared for upload: ${linkToSave.fileName}`);
                } catch (error) {
                    console.error('Error processing file:', error);
                    toast.error('Failed to process file');
                    setSaving(false);
                    return;
                }
            }

            // Create updated links array
            const updatedLinks = [...socialLinks];
            if (editIndex >= 0) {
                updatedLinks[editIndex] = linkToSave;
            } else {
                updatedLinks.push(linkToSave);
            }

            // Update API directly
            const payload = {
                social_links: updatedLinks
            };

            const updatedProfile = await updateProfile(payload);

            // Update state with response from server
            if (updatedProfile.social_links) {
                setSocialLinks(updatedProfile.social_links);
            }

            toast.success(`Social link ${editIndex >= 0 ? 'updated' : 'added'} successfully`);
            setShowForm(false);
        } catch (error) {
            console.error('Error saving social link:', error);
            toast.error(`Failed to ${editIndex >= 0 ? 'update' : 'add'} social link`);
        } finally {
            setSaving(false);
        }
    };

    if (loading && socialLinks.length === 0) {
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
            <TableContainer sx={{ width: '100%', overflowX: 'auto', maxHeight: 520, overflowY: 'auto' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell width="120px">Actions</TableCell>
                            <TableCell>Platform</TableCell>
                            <TableCell>URL</TableCell>
                            <TableCell>Tooltip</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {socialLinks.map((link, index) => (
                            <TableRow
                                key={index}
                                component={motion.tr}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <TableCell>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: '2px' }}>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteClick(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleEditLink(index)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {link.platform && typeMapping[link.platform]?.icon ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {React.createElement(typeMapping[link.platform].icon, { fontSize: 'small', color: 'action' })}
                                            {typeMapping[link.platform]?.name || link.platform}
                                        </Box>
                                    ) : (
                                        typeMapping[link.platform]?.name || link.platform
                                    )}
                                </TableCell>
                                <TableCell>
                                    {link.url instanceof File ? link.fileName :
                                        (link.fileName || (typeof link.url === 'string' ? link.url : 'File uploaded'))}
                                </TableCell>
                                <TableCell>{link.tooltip || ''}</TableCell>
                            </TableRow>
                        ))}
                        {socialLinks.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                                        No social links added yet
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card sx={{ mt: 2, p: 2, bgcolor: 'background.default' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Platform"
                                        name="platform"
                                        value={newLink.platform}
                                        onChange={handleLinkChange}
                                        margin="normal"
                                        variant="outlined"
                                        required
                                    >
                                        {Object.entries(typeMapping).map(([key, { name }]) => (
                                            <MenuItem key={key} value={key}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label={(typeMapping[newLink.platform]?.inputType === 'file' ? 'File' : 'URL')}
                                        name="url"
                                        value={typeMapping[newLink.platform]?.inputType === 'file' ? '' : newLink.url}
                                        onChange={handleLinkChange}
                                        margin="normal"
                                        variant="outlined"
                                        type={typeMapping[newLink.platform]?.inputType === 'file' ? 'file' : 'url'}
                                        InputLabelProps={{
                                            shrink: typeMapping[newLink.platform]?.inputType === 'file' ? true : undefined
                                        }}
                                        inputProps={{
                                            accept: typeMapping[newLink.platform]?.inputType === 'file' ? '.pdf,.doc,.docx,.txt,.rtf' : undefined
                                        }}
                                        required
                                    />
                                    {typeMapping[newLink.platform]?.inputType === 'file' && newLink.fileName && (
                                        <Typography variant="caption" display="block" gutterBottom>
                                            Selected file: {newLink.fileName}
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Tooltip (optional)"
                                        name="tooltip"
                                        value={newLink.tooltip || typeMapping[newLink.platform]?.tooltip}
                                        onChange={handleLinkChange}
                                        margin="normal"
                                        variant="outlined"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            },
                                        }}
                                        placeholder={`Text to appear on hover`}
                                        helperText="Optional: Text to appear on hover"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            color="inherit"
                                            onClick={() => setShowForm(false)}
                                            disabled={saving}
                                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSaveLink}
                                            disabled={saving || !newLink.platform ||
                                                (typeMapping[newLink.platform]?.inputType === 'file'
                                                    ? !(newLink.url instanceof File)
                                                    : !newLink.url)}
                                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                                        >
                                            {saving ? (
                                                <span>Saving...</span>
                                            ) : (
                                                <span>{editIndex >= 0 ? 'Update' : 'Add'} Link</span>
                                            )}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {!showForm && (
                <Box
                    component={motion.div}
                    whileHover={{ scale: 1.01, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}
                    whileTap={{ scale: 0.99 }}
                    sx={{
                        mt: 2,
                        p: 2,
                        border: '1px dashed',
                        borderColor: 'primary.main',
                        borderRadius: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onClick={handleAddLink}
                >
                    <AddIcon color="primary" />
                    <Typography color="primary" sx={{ ml: 1, fontWeight: 600 }}>
                        Add Social Link
                    </Typography>
                </Box>
            )}

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                open={deleteDialog.open}
                title={deleteDialog.item ? `the ${typeMapping[deleteDialog.item.platform]?.name || 'social link'}` : 'this social link'}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteConfirm}
                isLoading={saving}
            />
        </motion.div>
    );
};

export default SocialLinksSection;
