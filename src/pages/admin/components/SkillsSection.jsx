import React, { useState, useEffect, useMemo } from 'react';
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
    Chip,
    Switch,
    Autocomplete,
    useTheme,
    alpha,
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getProfile, updateProfile } from '../../../api/services/userService';
import {
    getAllSkillGroups,
    createSkillGroup,
    updateSkillGroup,
    deleteSkillGroup,
    updateSkillGroupVisibility
} from '../../../api/services/skillService';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const SkillsSection = () => {
    const theme = useTheme();
    const [skillGroups, setSkillGroups] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [featuredSkillIds, setFeaturedSkillIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileData, groupsData] = await Promise.all([
                getProfile(),
                getAllSkillGroups()
            ]);

            setSkillGroups(groupsData);
            if (profileData.featured_skill_ids && Array.isArray(profileData.featured_skill_ids)) {
                setFeaturedSkillIds(profileData.featured_skill_ids);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching skills data:', error);
            toast.error('Failed to load skills data');
            setLoading(false);
        }
    };

    // Get all skills from all skill groups
    const allSkills = useMemo(() => {
        const skills = [];
        skillGroups.forEach(group => {
            if (group.skills && Array.isArray(group.skills)) {
                group.skills.forEach(skill => {
                    skills.push({
                        ...skill,
                        groupName: group.name
                    });
                });
            }
        });
        return skills;
    }, [skillGroups]);

    // Update selected skills when featuredSkillIds or skillGroups change
    useEffect(() => {
        if (featuredSkillIds.length > 0 && allSkills.length > 0) {
            const matchedSkills = allSkills.filter(skill => featuredSkillIds.includes(skill.id));
            setSelectedSkills(matchedSkills);
        }
    }, [featuredSkillIds, allSkills]);

    // Handle submit function for the skills selection
    const handleSubmitSelectedSkills = async () => {
        try {
            setSaving(true);
            // Get just the IDs from the selected skills
            const selectedSkillIds = selectedSkills.map(skill => skill.id);

            // Create the payload with only the featured_skill_ids
            const payload = {
                featured_skill_ids: selectedSkillIds
            };

            // Make the PUT request to update the user profile
            await updateProfile(payload);
            setFeaturedSkillIds(selectedSkillIds);

            // Show success message
            toast.success('Featured skills updated successfully!');
            setSaving(false);
        } catch (error) {
            console.error('Error updating featured skills:', error);
            toast.error('Failed to update featured skills');
            setSaving(false);
        }
    };

    // State for the form to add/edit a skill group
    const [newSkillGroup, setNewSkillGroup] = useState({
        name: "",
        skills: [],
        is_visible: false // Default to false as requested
    });
    const [editIndex, setEditIndex] = useState(-1);
    const [showForm, setShowForm] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        item: null,
        index: -1
    });

    // State for the skill being added
    const [currentSkill, setCurrentSkill] = useState({
        name: "",
        proficiency: 1
    });

    // Helper function to get color based on proficiency level
    const getProficiencyColor = (proficiency) => {
        switch (parseInt(proficiency, 10)) {
            case 1: return 'default';
            case 2: return 'primary';
            case 3: return 'success';
            case 4: return 'warning';
            case 5: return 'error';
            default: return 'default';
        }
    };

    const handleAddSkillGroup = () => {
        setNewSkillGroup({
            name: "",
            skills: [],
            is_visible: false
        });
        setEditIndex(-1);
        setShowForm(true);
    };

    const handleEditSkillGroup = (index) => {
        setNewSkillGroup({ ...skillGroups[index] });
        setEditIndex(index);
        setShowForm(true);
    };

    const handleDeleteSkillGroup = async (index) => {
        const groupToDelete = skillGroups[index];
        setDeleteDialog({
            open: true,
            item: groupToDelete,
            index: index
        });
    };

    const handleDeleteConfirm = async () => {
        const { item, index } = deleteDialog;
        if (!item) return;

        try {
            setSaving(true);

            if (item.id) {
                // Item is saved in the database - use the DELETE endpoint
                await deleteSkillGroup(item.id);

                // Update local state
                const updatedGroups = [...skillGroups];
                updatedGroups.splice(index, 1);
                setSkillGroups(updatedGroups);

                toast.success('Skill group deleted successfully');
            } else {
                // Item is not yet saved in the database
                // Just remove it from local state
                const updatedGroups = [...skillGroups];
                updatedGroups.splice(index, 1);
                setSkillGroups(updatedGroups);

                toast.success('Skill group removed');
            }
        } catch (error) {
            console.error('Error deleting skill group:', error);
            toast.error('Failed to delete skill group');
        } finally {
            setSaving(false);
            setDeleteDialog({ open: false, item: null, index: -1 });
        }
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialog({ open: false, item: null, index: -1 });
    };

    const handleToggleVisibility = async (index, isVisible) => {
        const groupToUpdate = skillGroups[index];

        // Update local state first for immediate UI feedback
        const updatedGroups = [...skillGroups];
        updatedGroups[index] = {
            ...updatedGroups[index],
            is_visible: isVisible
        };
        setSkillGroups(updatedGroups);

        if (!groupToUpdate.id) return; // Not saved to backend yet

        try {
            await updateSkillGroupVisibility(groupToUpdate.id, isVisible);
        } catch (error) {
            console.error('Error updating skill group visibility:', error);
            toast.error('Failed to update visibility');

            // Revert local state on error
            updatedGroups[index] = {
                ...updatedGroups[index],
                is_visible: !isVisible
            };
            setSkillGroups(updatedGroups);
        }
    };

    const handleSkillGroupChange = (e) => {
        const { name, value, checked } = e.target;
        setNewSkillGroup(prev => ({
            ...prev,
            [name]: name === 'is_visible' ? checked : value
        }));
    };

    const handleSkillChange = (e) => {
        const { name, value } = e.target;
        setCurrentSkill(prev => ({
            ...prev,
            [name]: name === 'proficiency' ? parseInt(value, 10) : value
        }));
    };

    // Adding skills to the group
    const handleAddSkill = () => {
        if (currentSkill.name.trim() === '') return;

        // Add the skill if it's not already in the array
        const skillExists = newSkillGroup.skills.some(skill =>
            skill.name.toLowerCase() === currentSkill.name.trim().toLowerCase()
        );

        if (!skillExists) {
            setNewSkillGroup(prev => ({
                ...prev,
                skills: [...prev.skills, { ...currentSkill }]
            }));
        } else {
            toast.warning('This skill already exists in this group');
        }

        // Reset current skill form
        setCurrentSkill({
            name: "",
            proficiency: 1
        });
    };

    const handleRemoveSkill = (index) => {
        setNewSkillGroup(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    const handleSaveSkillGroup = async () => {
        if (newSkillGroup.name.trim() === '') return;

        try {
            setSaving(true);
            let savedGroup;

            if (editIndex >= 0 && skillGroups[editIndex].id) {
                // Update existing group
                const response = await updateSkillGroup(skillGroups[editIndex].id, newSkillGroup);
                savedGroup = response.data;
            } else {
                // Create new group
                const response = await createSkillGroup(newSkillGroup);
                savedGroup = response.data;
            }

            const updatedGroups = [...skillGroups];
            if (editIndex >= 0) {
                updatedGroups[editIndex] = savedGroup;
            } else {
                updatedGroups.push(savedGroup);
            }

            setSkillGroups(updatedGroups);
            setShowForm(false);
            toast.success(`Skill group ${editIndex >= 0 ? 'updated' : 'created'} successfully`);
            setSaving(false);
        } catch (error) {
            console.error('Error saving skill group:', error);
            toast.error(`Failed to ${editIndex >= 0 ? 'update' : 'create'} skill group`);
            setSaving(false);
        }
    };

    if (loading && skillGroups.length === 0) {
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
                            <TableCell width="240px">Group Name</TableCell>
                            <TableCell>Skills</TableCell>
                            <TableCell width="60px">Visible</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {skillGroups.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No skill groups found
                                </TableCell>
                            </TableRow>
                        ) : skillGroups.map((group, index) => (
                            <TableRow
                                key={group.id || `group_${index}`}
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
                                            onClick={() => handleDeleteSkillGroup(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleEditSkillGroup(index)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                                <TableCell>{group.name}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {group.skills && group.skills.length > 0 ? group.skills.map((skill, idx) => (
                                            <Chip
                                                key={idx}
                                                label={`${skill.name} (${skill.proficiency}/5)`}
                                                size="small"
                                                color={getProficiencyColor(skill.proficiency)}
                                                sx={{ my: 0.25 }}
                                            />
                                        )) : (
                                            <Typography color="text.secondary">No skills</Typography>
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        checked={group.is_visible}
                                        color="success"
                                        onChange={(e) => handleToggleVisibility(index, e.target.checked)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
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
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        fullWidth
                                        label="Group Name"
                                        name="name"
                                        value={newSkillGroup.name}
                                        onChange={handleSkillGroupChange}
                                        margin="normal"
                                        variant="outlined"
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center' }}>
                                        <Typography sx={{ mr: 1 }}>Visible</Typography>
                                        <Switch
                                            name="is_visible"
                                            checked={newSkillGroup.is_visible}
                                            onChange={handleSkillGroupChange}
                                            color="success"
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Skills
                                    </Typography>
                                    {newSkillGroup.skills.length > 0 ? (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                                            {newSkillGroup.skills.map((skill, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={`${skill.name} (${skill.proficiency}/5)`}
                                                    size="small"
                                                    color={getProficiencyColor(skill.proficiency)}
                                                    onDelete={() => handleRemoveSkill(idx)}
                                                    sx={{ my: 0.5 }}
                                                />
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                                            No skills added yet
                                        </Typography>
                                    )}

                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 1, mb: 2 }}>
                                        <TextField
                                            label="Skill Name"
                                            name="name"
                                            value={currentSkill.name}
                                            onChange={handleSkillChange}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                                            sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}
                                        />
                                        <Box sx={{ display: 'flex', width: { xs: '100%', sm: 'auto' }, alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" sx={{ mr: 1 }}>Proficiency:</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {[1, 2, 3, 4, 5].map(level => (
                                                    <Chip
                                                        key={level}
                                                        label={level}
                                                        size="small"
                                                        color={level === currentSkill.proficiency ? getProficiencyColor(level) : 'default'}
                                                        onClick={() => setCurrentSkill(prev => ({ ...prev, proficiency: level }))}
                                                        sx={{
                                                            cursor: 'pointer',
                                                            fontWeight: level === currentSkill.proficiency ? 'bold' : 'normal',
                                                            opacity: level === currentSkill.proficiency ? 1 : 0.7
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleAddSkill}
                                            disabled={!currentSkill.name.trim()}
                                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                                        >
                                            Add Skill
                                        </Button>
                                    </Box>
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
                                            onClick={handleSaveSkillGroup}
                                            disabled={saving || !newSkillGroup.name.trim() || newSkillGroup.skills.length === 0}
                                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                                        >
                                            {saving ? 'Saving...' : (editIndex >= 0 ? 'Update' : 'Add') + ' Skill Group'}
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
                    onClick={handleAddSkillGroup}
                >
                    <AddIcon color="primary" />
                    <Typography color="primary" sx={{ ml: 1, fontWeight: 600 }}>
                        Add Skill Group
                    </Typography>
                </Box>
            )}


            {/* Skills Selection Card */}
            <Card sx={{ p: 2, my: 3, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom>
                    Select Featured Skills (Max 4)
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            id="skill-selection"
                            options={allSkills}
                            value={selectedSkills}
                            onChange={(event, newValue) => {
                                // Limit to maximum 4 skills
                                if (newValue.length <= 4) {
                                    setSelectedSkills(newValue);
                                } else {
                                    toast.warning('Maximum 4 skills can be selected');
                                }
                            }}
                            getOptionLabel={(option) => option.name}
                            groupBy={(option) => option.groupName}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Skills"
                                    placeholder={selectedSkills.length >= 4 ? '' : 'Select a skill'}
                                    helperText={`${selectedSkills.length}/4 skills selected`}
                                />
                            )}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        variant="outlined"
                                        label={`${option.name} (${option.proficiency}/5)`}
                                        size="small"
                                        color={getProficiencyColor(option.proficiency)}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitSelectedSkills}
                            disabled={selectedSkills.length === 0 || saving}
                        >
                            {saving ? 'Saving...' : 'Submit Selected Skills'}
                        </Button>
                    </Grid>
                </Grid>
            </Card>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                open={deleteDialog.open}
                title={deleteDialog.item ? `the skill group "${deleteDialog.item.name}"` : 'this skill group'}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteConfirm}
                isLoading={saving}
            />
        </motion.div>
    );
};

export default SkillsSection;
