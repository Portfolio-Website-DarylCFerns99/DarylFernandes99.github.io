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
    Button,
    Switch,
    useTheme,
    alpha,
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getAllExperiences, createExperience, updateExperience, updateExperienceVisibility, deleteExperience } from '../../../api/services/experienceService';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const TimelineSection = () => {
    const theme = useTheme();
    const [experiences, setExperiences] = useState([]);
    const [tab, setTab] = useState('experience');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        item: null,
        type: ''
    });
    const [searchText, setSearchText] = useState('');
    const [filteredExperiences, setFilteredExperiences] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'start_date', direction: 'desc' });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            setLoading(true);
            const data = await getAllExperiences();
            setExperiences(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching experiences:', error);
            toast.error('Failed to load timeline data');
            setLoading(false);
        }
    };

    // Initialize filteredExperiences with all experiences when component mounts
    useEffect(() => {
        setFilteredExperiences(experiences);
    }, [experiences]);

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filter and sort experiences
    useEffect(() => {
        let result = experiences.filter(exp => exp?.type === tab);

        // Apply search filter
        if (searchText) {
            const lowercasedFilter = searchText.toLowerCase();
            result = result.filter(experience => {
                return (
                    experience.title?.toLowerCase().includes(lowercasedFilter) ||
                    experience.organization?.toLowerCase().includes(lowercasedFilter) ||
                    experience.description?.toLowerCase().includes(lowercasedFilter)
                );
            });
        }

        // Apply sorting
        result.sort((a, b) => {
            if (sortConfig.key === 'start_date' || sortConfig.key === 'end_date') {
                const dateA = new Date(a[sortConfig.key] || '9999-12-31'); // Use far future date for null end dates
                const dateB = new Date(b[sortConfig.key] || '9999-12-31');
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            }

            const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
            const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';

            if (sortConfig.direction === 'asc') {
                return aValue.localeCompare(bValue);
            }
            return bValue.localeCompare(aValue);
        });

        setFilteredExperiences(result);
    }, [experiences, searchText, sortConfig, tab]);

    // New entry template
    const emptyEntry = {
        type: tab, // 'experience' or 'education'
        title: '',
        organization: '',
        start_date: '',
        end_date: '',
        description: '',
        is_visible: true
    };

    const [newEntry, setNewEntry] = useState(emptyEntry);

    // Update the newEntry.type when tab changes
    useEffect(() => {
        setNewEntry(prev => ({
            ...prev,
            type: tab
        }));
    }, [tab]);

    const handleTabChange = (newTab) => {
        if (showForm) {
            // If form is open, show confirmation
            if (window.confirm('Changing tabs will discard unsaved changes. Continue?')) {
                setTab(newTab);
                setShowForm(false);
                setEditingItem(null);
            }
        } else {
            setTab(newTab);
        }
    };

    const handleAddEntry = () => {
        setEditingItem(null);
        setNewEntry({
            ...emptyEntry,
            type: tab
        });
        setShowForm(true);
    };

    const handleEditEntry = (entry) => {
        setEditingItem(entry.id);
        setNewEntry({
            ...entry,
            // Format dates to YYYY-MM-DD for input fields
            start_date: entry.start_date ? formatDateForInput(entry.start_date) : '',
            end_date: entry.end_date ? formatDateForInput(entry.end_date) : ''
        });
        setShowForm(true);
    };

    // Format date string to YYYY-MM-DD for input fields
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    // Format date for display
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    const handleDeleteClick = (entry) => {
        setDeleteDialog({
            open: true,
            item: entry,
            type: entry?.type === 'experience' ? 'experience' : 'education'
        });
    };

    const handleDeleteConfirm = async () => {
        const { item } = deleteDialog;
        if (!item) return;

        setSaving(true);
        try {
            await deleteExperience(item.id);

            // Update local state
            setExperiences(prev => prev.filter(exp => exp.id !== item.id));
            toast.success(`${item?.type === 'experience' ? 'Experience' : 'Education'} entry deleted successfully`);
        } catch (error) {
            console.error('Error deleting entry:', error);
            toast.error('Failed to delete entry');
        } finally {
            setSaving(false);
            setDeleteDialog({ open: false, item: null, type: '' });
        }
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialog({ open: false, item: null, type: '' });
    };

    const handleToggleVisibility = async (entry) => {
        const updatedEntry = {
            ...entry,
            is_visible: !entry.is_visible
        };

        // Update local state immediately for better UX
        setExperiences(prev =>
            prev.map(exp => exp.id === entry.id ? updatedEntry : exp)
        );

        try {
            // Call the specific visibility API endpoint
            await updateExperienceVisibility(entry.id, !entry.is_visible);
            toast.success(`${entry?.type === 'experience' ? 'Experience' : 'Education'} visibility updated`);
        } catch (error) {
            console.error('Error updating visibility:', error);
            toast.error('Failed to update visibility');

            // Revert local state on error
            setExperiences(prev =>
                prev.map(exp => exp.id === entry.id ? entry : exp)
            );
        }
    };

    const handleEntryChange = (e) => {
        const { name, value, checked, type } = e.target;

        setNewEntry(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveEntry = async () => {
        if (!newEntry.title || !newEntry.organization || !newEntry.start_date) {
            toast.error('Please fill out all required fields');
            return;
        }

        newEntry.end_date = newEntry.end_date === "" ? null : newEntry.end_date

        setSaving(true);
        try {
            let savedEntry;

            // Make the API call to save the entry
            if (editingItem) {
                const response = await updateExperience(editingItem, newEntry);
                savedEntry = response;
            } else {
                const response = await createExperience(newEntry);
                savedEntry = response;
            }

            // Update the experiences array with the response from the server
            if (editingItem) {
                setExperiences(prev =>
                    prev.map(exp => exp.id === editingItem ? savedEntry : exp)
                );
            } else {
                setExperiences(prev => [...prev, savedEntry]);
            }

            toast.success(`${newEntry?.type === 'experience' ? 'Experience' : 'Education'} ${editingItem ? 'updated' : 'added'} successfully`);
            setShowForm(false);
            setEditingItem(null);
        } catch (error) {
            console.error('Error saving entry:', error);
            toast.error('Failed to save entry');
        } finally {
            setSaving(false);
        }
    };

    const renderEntryTable = (entries, type) => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Box sx={{ width: '100%', mb: 2 }}>
                <TextField
                    label={`Search ${type === 'experience' ? 'experiences' : 'education'}`}
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder={`Search by ${type === 'experience' ? 'job title, company' : 'degree, institution'}, or description`}
                    InputProps={{
                        endAdornment: searchText && (
                            <IconButton
                                size="small"
                                onClick={() => setSearchText('')}
                                edge="end"
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        ),
                    }}
                />
            </Box>

            <TableContainer sx={{ width: '100%', overflowX: 'auto', maxHeight: 520, overflowY: 'auto' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell width="80px">Actions</TableCell>
                            <TableCell onClick={() => handleSort('title')} sx={{ cursor: 'pointer' }}>
                                {type === 'experience' ? 'Job Title' : 'Degree/Program'}
                                {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                            </TableCell>
                            <TableCell onClick={() => handleSort('organization')} sx={{ cursor: 'pointer' }}>
                                {type === 'experience' ? 'Company' : 'Institution'}
                                {sortConfig.key === 'organization' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                            </TableCell>
                            <TableCell onClick={() => handleSort('start_date')} sx={{ cursor: 'pointer' }}>
                                Start Date
                                {sortConfig.key === 'start_date' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                            </TableCell>
                            <TableCell onClick={() => handleSort('end_date')} sx={{ cursor: 'pointer' }}>
                                End Date
                                {sortConfig.key === 'end_date' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                            </TableCell>
                            <TableCell width="70px">Visible</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredExperiences.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No {type === 'experience' ? 'experience' : 'education'} entries found
                                </TableCell>
                            </TableRow>
                        ) : filteredExperiences.map((entry) => (
                            <TableRow
                                key={entry.id}
                                component={motion.tr}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: '4px' }}>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteClick(entry)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleEditEntry(entry)}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                                <TableCell>{entry.title}</TableCell>
                                <TableCell>{entry.organization}</TableCell>
                                <TableCell>{formatDateForDisplay(entry.start_date)}</TableCell>
                                <TableCell>{entry.end_date ? formatDateForDisplay(entry.end_date) : 'Present'}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={entry.is_visible}
                                        onChange={() => handleToggleVisibility(entry)}
                                        color="success"
                                        size="small"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </motion.div>
    );

    if (loading && experiences.length === 0) {
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
            <Box sx={{ bgcolor: 'action.hover', borderRadius: 1, mb: 2, p: 0.5, display: 'inline-flex', position: 'relative' }}>
                {['experience', 'education'].map((t) => (
                    <Box
                        key={t}
                        onClick={() => handleTabChange(t)}
                        sx={{
                            position: 'relative',
                            zIndex: 1,
                            px: 2,
                            py: 0.75,
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            fontWeight: tab === t ? 600 : 400,
                            color: tab === t ? 'primary.contrastText' : 'text.primary',
                            transition: 'color 0.2s',
                            userSelect: 'none',
                            borderRadius: 1
                        }}
                    >
                        {tab === t && (
                            <Box
                                component={motion.div}
                                layoutId="activeTimelineTab"
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    bgcolor: 'primary.main',
                                    borderRadius: 1,
                                    zIndex: -1,
                                    boxShadow: 2
                                }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {t}
                    </Box>
                ))}
            </Box>

            <AnimatePresence mode="wait">
                {tab === 'experience' && !showForm && (
                    <motion.div
                        key="experience-table"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderEntryTable(experiences.filter(exp => exp?.type === 'experience'), 'experience')}
                    </motion.div>
                )}
                {tab === 'education' && !showForm && (
                    <motion.div
                        key="education-table"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderEntryTable(experiences.filter(exp => exp?.type === 'education'), 'education')}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showForm ? (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card sx={{ mt: 2, p: 2, bgcolor: 'background.default' }}>
                            <Typography variant="h6" gutterBottom>
                                {editingItem ? `Edit ${tab === 'experience' ? 'Experience' : 'Education'}` : `Add ${tab === 'experience' ? 'Experience' : 'Education'}`}
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label={tab === 'experience' ? 'Job Title' : 'Degree/Program'}
                                        name="title"
                                        value={newEntry.title}
                                        onChange={handleEntryChange}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label={tab === 'experience' ? 'Company' : 'Institution'}
                                        name="organization"
                                        value={newEntry.organization}
                                        onChange={handleEntryChange}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Start Date"
                                        name="start_date"
                                        type="date"
                                        value={newEntry.start_date}
                                        onChange={handleEntryChange}
                                        margin="normal"
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="End Date (Leave empty for current position)"
                                        name="end_date"
                                        type="date"
                                        value={newEntry.end_date}
                                        onChange={handleEntryChange}
                                        margin="normal"
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        value={newEntry.description}
                                        onChange={handleEntryChange}
                                        margin="normal"
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <Switch
                                            checked={newEntry.is_visible}
                                            onChange={handleEntryChange}
                                            name="is_visible"
                                            color="success"
                                        />
                                        <Typography sx={{ ml: 1 }}>Visible on portfolio</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end', gap: 1, mt: 2 }}>
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
                                            onClick={handleSaveEntry}
                                            disabled={saving || !newEntry.title || !newEntry.organization || !newEntry.start_date}
                                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                                        >
                                            {saving ? 'Saving...' : editingItem ? 'Update' : 'Add'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                    </motion.div>
                ) : (
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
                        onClick={handleAddEntry}
                    >
                        <AddIcon color="primary" />
                        <Typography color="primary" sx={{ ml: 1, fontWeight: 600 }}>
                            Add {tab === 'experience' ? 'Experience' : 'Education'} Entry
                        </Typography>
                    </Box>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                open={deleteDialog.open}
                title={`this ${deleteDialog.type} entry`}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteConfirm}
                isLoading={saving}
            />
        </motion.div>

    );
};

export default TimelineSection;
