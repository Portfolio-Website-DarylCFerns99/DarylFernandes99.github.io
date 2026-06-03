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
import PsychologyIcon from '@mui/icons-material/Psychology';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HubIcon from '@mui/icons-material/Hub';
import CodeIcon from '@mui/icons-material/Code';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getProfile, updateProfile } from '../../../api/services/userService';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const getServiceIcon = (iconName) => {
    switch (iconName) {
        case "Psychology": return <PsychologyIcon fontSize="small" color="primary" />;
        case "CloudUpload": return <CloudUploadIcon fontSize="small" color="primary" />;
        case "Code": return <CodeIcon fontSize="small" color="primary" />;
        case "Hub": return <HubIcon fontSize="small" color="primary" />;
        default: return <CodeIcon fontSize="small" color="primary" />;
    }
};

const iconOptions = [
    { value: "Psychology", label: "Psychology (AI/ML)" },
    { value: "CloudUpload", label: "CloudUpload (Infrastructure)" },
    { value: "Code", label: "Code (Engineering)" },
    { value: "Hub", label: "Hub (Distributed Systems)" }
];

const ServicesSection = () => {
    const theme = useTheme();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // State for form
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);
    const [newService, setNewService] = useState({
        title: "",
        description: "",
        iconName: "Code"
    });

    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        item: null,
        index: -1
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const data = await getProfile();
            setServices(data.services || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Failed to load services');
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setNewService({ title: "", description: "", iconName: "Code" });
        setEditIndex(-1);
        setShowForm(true);
    };

    const handleEditClick = (index) => {
        setNewService({ ...services[index] });
        setEditIndex(index);
        setShowForm(true);
    };

    const handleDeleteClick = (index) => {
        setDeleteDialog({
            open: true,
            item: services[index],
            index: index
        });
    };

    const handleDeleteConfirm = async () => {
        const { index } = deleteDialog;
        if (index === -1) return;

        setSaving(true);
        try {
            const updatedServices = [...services];
            updatedServices.splice(index, 1);

            const payload = {
                services: updatedServices
            };

            const updatedProfile = await updateProfile(payload);

            if (updatedProfile.services) {
                setServices(updatedProfile.services);
            } else {
                setServices([]);
            }

            toast.success('Service card deleted successfully');
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Failed to delete service');
        } finally {
            setSaving(false);
            setDeleteDialog({ open: false, item: null, index: -1 });
        }
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialog({ open: false, item: null, index: -1 });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewService(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveService = async () => {
        if (!newService.title || !newService.description) {
            toast.warning('Please fill in all required fields');
            return;
        }

        setSaving(true);
        try {
            const serviceToSave = { ...newService };
            
            // Assign numeric ID if new service
            if (editIndex === -1) {
                const maxId = services.length > 0 
                    ? Math.max(...services.map(s => Number(s.id) || 0)) 
                    : 0;
                serviceToSave.id = maxId + 1;
            }

            const updatedServices = [...services];
            if (editIndex >= 0) {
                updatedServices[editIndex] = serviceToSave;
            } else {
                updatedServices.push(serviceToSave);
            }

            const payload = {
                services: updatedServices
            };

            const updatedProfile = await updateProfile(payload);

            if (updatedProfile.services) {
                setServices(updatedProfile.services);
            }

            toast.success(`Service card ${editIndex >= 0 ? 'updated' : 'added'} successfully`);
            setShowForm(false);
        } catch (error) {
            console.error('Error saving service:', error);
            toast.error(`Failed to ${editIndex >= 0 ? 'update' : 'add'} service card`);
        } finally {
            setSaving(false);
        }
    };

    if (loading && services.length === 0) {
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
                            <TableCell width="80px">Icon</TableCell>
                            <TableCell width="200px">Title</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {services.map((service, index) => (
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
                                            onClick={() => handleEditClick(index)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    {getServiceIcon(service.iconName)}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                    {service.title}
                                </TableCell>
                                <TableCell>
                                    {service.description}
                                </TableCell>
                            </TableRow>
                        ))}
                        {services.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                                        No service cards added yet
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
                                        fullWidth
                                        label="Title"
                                        name="title"
                                        value={newService.title}
                                        onChange={handleInputChange}
                                        margin="normal"
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Icon"
                                        name="iconName"
                                        value={newService.iconName}
                                        onChange={handleInputChange}
                                        margin="normal"
                                        variant="outlined"
                                        required
                                    >
                                        {iconOptions.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {getServiceIcon(option.value)}
                                                    {option.label}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Description"
                                        name="description"
                                        value={newService.description}
                                        onChange={handleInputChange}
                                        margin="normal"
                                        variant="outlined"
                                        required
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
                                            onClick={handleSaveService}
                                            disabled={saving || !newService.title || !newService.description}
                                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                                        >
                                            {saving ? 'Saving...' : (editIndex >= 0 ? 'Update Service' : 'Add Service')}
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
                    onClick={handleAddClick}
                >
                    <AddIcon color="primary" />
                    <Typography color="primary" sx={{ ml: 1, fontWeight: 600 }}>
                        Add Service Card
                    </Typography>
                </Box>
            )}

            <DeleteConfirmationDialog
                open={deleteDialog.open}
                title={deleteDialog.item ? `the service card "${deleteDialog.item.title}"` : 'this service card'}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteConfirm}
                isLoading={saving}
            />
        </motion.div>
    );
};

export default ServicesSection;
