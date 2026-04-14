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
    MenuItem,
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
    updateSkillGroupVisibility,
    getAllSkills,
    createSkill,
    updateSkill,
    updateSkillVisibility,
    deleteSkill
} from '../../../api/services/skillService';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const SkillsSection = () => {
    const theme = useTheme();
    // Core data
    const [skillGroups, setSkillGroups] = useState([]);
    const [skillsData, setSkillsData] = useState([]);

    // Featured skills state
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [featuredSkillIds, setFeaturedSkillIds] = useState([]);

    // General state
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tab, setTab] = useState('groups'); // 'groups' or 'skills'

    // Group form state
    const [showGroupForm, setShowGroupForm] = useState(false);
    const [editingGroupId, setEditingGroupId] = useState(null);
    const [groupForm, setGroupForm] = useState({ name: '', is_visible: true });

    // Skill form state
    const [showSkillForm, setShowSkillForm] = useState(false);
    const [editingSkillId, setEditingSkillId] = useState(null);
    const [skillForm, setSkillForm] = useState({
        name: '',
        skill_group_id: '',
        proficiency: 1,
        is_visible: true
    });

    // Delete dialog
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        item: null,
        type: 'group' // 'group' or 'skill'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileData, groupsRes, skillsRes] = await Promise.all([
                getProfile(),
                getAllSkillGroups(),
                getAllSkills()
            ]);

            setSkillGroups(groupsRes);
            setSkillsData(skillsRes);

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

    // Map of groupId to list of skills belonging to that group
    const groupToSkillsMap = useMemo(() => {
        const map = {};
        skillGroups.forEach(g => {
            map[g.id] = [];
        });
        skillsData.forEach(s => {
            const cid = s.skill_group_id;
            if (!cid || !map[cid]) return;
            map[cid].push(s);
        });
        return map;
    }, [skillGroups, skillsData]);

    const allSkills = useMemo(() => {
        const groupDict = {};
        skillGroups.forEach(g => groupDict[g.id] = g.name);

        return skillsData.map(skill => ({
            ...skill,
            groupName: groupDict[skill.skill_group_id] || 'Unknown Group'
        }));
    }, [skillGroups, skillsData]);

    useEffect(() => {
        if (featuredSkillIds.length > 0 && allSkills.length > 0) {
            const matchedSkills = allSkills.filter(skill => featuredSkillIds.includes(skill.id));
            setSelectedSkills(matchedSkills);
        }
    }, [featuredSkillIds, allSkills]);

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

    const handleSubmitSelectedSkills = async () => {
        try {
            setSaving(true);
            const selectedSkillIds = selectedSkills.map(skill => skill.id);
            await updateProfile({ featured_skill_ids: selectedSkillIds });
            setFeaturedSkillIds(selectedSkillIds);
            toast.success('Featured skills updated successfully!');
        } catch (error) {
            console.error('Error updating featured skills:', error);
            toast.error('Failed to update featured skills');
        } finally {
            setSaving(false);
        }
    };

    const handleTabChange = (newTab) => {
        const leavingWithUnsavedGroups = showGroupForm && newTab !== 'groups';
        const leavingWithUnsavedSkills = showSkillForm && newTab !== 'skills';

        if (leavingWithUnsavedGroups || leavingWithUnsavedSkills) {
            if (window.confirm('Changing tabs will discard unsaved changes. Continue?')) {
                setTab(newTab);
                if (showGroupForm) { setShowGroupForm(false); setEditingGroupId(null); }
                if (showSkillForm) { setShowSkillForm(false); setEditingSkillId(null); }
            }
        } else {
            setTab(newTab);
        }
    };

    // --- Groups Logic ---

    const handleAddGroup = () => {
        setGroupForm({ name: '', is_visible: true });
        setEditingGroupId(null);
        setShowGroupForm(true);
    };

    const handleEditGroup = (group) => {
        setGroupForm({ name: group.name || '', is_visible: !!group.is_visible });
        setEditingGroupId(group.id);
        setShowGroupForm(true);
    };

    const handleGroupInputChange = (e) => {
        const { name, value, checked, type } = e.target;
        setGroupForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveGroup = async () => {
        if (!groupForm.name?.trim()) {
            toast.error('Please enter a group name');
            return;
        }
        setSaving(true);
        try {
            if (editingGroupId) {
                const response = await updateSkillGroup(editingGroupId, groupForm);
                const saved = response.data;
                setSkillGroups(prev => prev.map(g => g.id === saved.id ? saved : g));
                toast.success('Skill group updated');
            } else {
                const response = await createSkillGroup(groupForm);
                const saved = response.data;
                setSkillGroups(prev => [...prev, saved]);
                toast.success('Skill group created');
            }
            setShowGroupForm(false);
            setEditingGroupId(null);
        } catch (error) {
            console.error('Error saving skill group:', error);
            toast.error('Failed to save skill group');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleGroupVisibility = async (group) => {
        const newVisibility = !group.is_visible;
        setSkillGroups(prev => prev.map(g => g.id === group.id ? { ...g, is_visible: newVisibility } : g));
        try {
            await updateSkillGroupVisibility(group.id, newVisibility);
        } catch (error) {
            console.error('Error updating group visibility:', error);
            toast.error('Failed to update group visibility');
            setSkillGroups(prev => prev.map(g => g.id === group.id ? { ...g, is_visible: group.is_visible } : g));
        }
    };

    // --- Skills Logic ---

    const handleAddSkill = () => {
        if (skillGroups.length === 0) {
            toast.warning('Please create a skill group first');
            return;
        }
        setSkillForm({ name: '', skill_group_id: skillGroups[0].id, proficiency: 1, is_visible: true });
        setEditingSkillId(null);
        setShowSkillForm(true);
    };

    const handleEditSkill = (skill) => {
        setSkillForm({
            name: skill.name || '',
            skill_group_id: skill.skill_group_id || '',
            proficiency: skill.proficiency || 1,
            is_visible: !!skill.is_visible
        });
        setEditingSkillId(skill.id);
        setShowSkillForm(true);
    };

    const handleSkillInputChange = (e) => {
        const { name, value, checked, type } = e.target;
        setSkillForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveSkill = async () => {
        if (!skillForm.name?.trim()) {
            toast.error('Please enter a skill name');
            return;
        }
        if (!skillForm.skill_group_id) {
            toast.error('Please select a skill group');
            return;
        }
        setSaving(true);
        try {
            if (editingSkillId) {
                const response = await updateSkill(editingSkillId, skillForm);
                const saved = response.data;
                setSkillsData(prev => prev.map(s => s.id === saved.id ? saved : s));
                toast.success('Skill updated');
            } else {
                const response = await createSkill(skillForm);
                const saved = response.data;
                setSkillsData(prev => [...prev, saved]);
                toast.success('Skill created');
            }
            setShowSkillForm(false);
            setEditingSkillId(null);
        } catch (error) {
            console.error('Error saving skill:', error);
            toast.error('Failed to save skill');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleSkillVisibility = async (skill) => {
        const newVisibility = !skill.is_visible;
        setSkillsData(prev => prev.map(s => s.id === skill.id ? { ...s, is_visible: newVisibility } : s));
        try {
            await updateSkillVisibility(skill.id, newVisibility);
        } catch (error) {
            console.error('Error updating skill visibility:', error);
            toast.error('Failed to update skill visibility');
            setSkillsData(prev => prev.map(s => s.id === skill.id ? { ...s, is_visible: skill.is_visible } : s));
        }
    };

    // --- Delete Logic ---

    const handleDeleteClick = (item, type) => {
        setDeleteDialog({
            open: true,
            item,
            type
        });
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialog({ open: false, item: null, type: 'group' });
    };

    const handleDeleteConfirm = async () => {
        const { item, type } = deleteDialog;
        if (!item) return;

        setSaving(true);
        try {
            if (type === 'group') {
                await deleteSkillGroup(item.id);
                setSkillGroups(prev => prev.filter(g => g.id !== item.id));
                toast.success('Skill group deleted');
            } else {
                await deleteSkill(item.id);
                setSkillsData(prev => prev.filter(s => s.id !== item.id));
                toast.success('Skill deleted');
            }
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
            toast.error(`Failed to delete ${type}`);
        } finally {
            setSaving(false);
            handleCloseDeleteDialog();
        }
    };

    if (loading && skillGroups.length === 0 && skillsData.length === 0) {
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
            {/* Featured Skills Card moved to the top */}
            <Card sx={{ p: 2, mb: 4, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom>
                    Featured Skills (Max 4)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Select up to 4 featured skills to highlight on your portfolio.
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            id="skill-selection"
                            options={allSkills}
                            value={selectedSkills}
                            onChange={(event, newValue) => {
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
                            {saving ? 'Saving...' : 'Submit Featured Skills'}
                        </Button>
                    </Grid>
                </Grid>
            </Card>

            {/* Tabs Header */}
            <Box sx={{ bgcolor: 'action.hover', borderRadius: 1, mb: 2, p: 0.5, display: 'inline-flex', position: 'relative' }}>
                {['groups', 'skills'].map((t) => (
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
                                layoutId="activeSkillTab"
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
                        {t === 'groups' ? 'Skill Groups' : 'Skills'}
                    </Box>
                ))}
            </Box>

            <AnimatePresence mode="wait">
                {/* --- Groups Tab --- */}
                {tab === 'groups' && (
                    <motion.div
                        key="groups"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {showGroupForm ? (
                            <Card sx={{ mt: 2, p: 2, bgcolor: 'background.default' }}>
                                <Typography variant="h6" gutterBottom>
                                    {editingGroupId ? 'Edit Skill Group' : 'Add Skill Group'}
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Group Name"
                                            name="name"
                                            value={groupForm.name}
                                            onChange={handleGroupInputChange}
                                            margin="normal"
                                            variant="outlined"
                                        />
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                                            <Switch
                                                checked={groupForm.is_visible}
                                                onChange={handleGroupInputChange}
                                                name="is_visible"
                                                color="success"
                                            />
                                            <Typography sx={{ ml: 1 }}>Visible</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="outlined"
                                                color="inherit"
                                                onClick={() => setShowGroupForm(false)}
                                                disabled={saving}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleSaveGroup}
                                                disabled={saving || !groupForm.name?.trim()}
                                            >
                                                {saving ? 'Saving...' : (editingGroupId ? 'Update' : 'Create')}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Card>
                        ) : (
                            <>
                                <TableContainer sx={{ maxHeight: 520, overflowY: 'auto' }}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                                <TableCell width="120px">Actions</TableCell>
                                                <TableCell>Group Name</TableCell>
                                                <TableCell width="120px">Skills</TableCell>
                                                <TableCell width="100px">Visible</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {skillGroups.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} align="center">No skill groups found</TableCell>
                                                </TableRow>
                                            ) : (
                                                skillGroups.map((group) => (
                                                    <TableRow key={group.id}>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', gap: '2px' }}>
                                                                <IconButton size="small" color="error" onClick={() => handleDeleteClick(group, 'group')}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                                <IconButton size="small" color="primary" onClick={() => handleEditGroup(group)}>
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>{group.name}</TableCell>
                                                        <TableCell>{groupToSkillsMap[group.id]?.length || 0}</TableCell>
                                                        <TableCell>
                                                            <Switch
                                                                checked={!!group.is_visible}
                                                                onChange={() => handleToggleGroupVisibility(group)}
                                                                color="success"
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Box
                                    component={motion.div}
                                    whileHover={{ scale: 1.01, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}
                                    whileTap={{ scale: 0.99 }}
                                    sx={{
                                        mt: 2, p: 2, border: '1px dashed', borderColor: 'primary.main',
                                        borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        cursor: 'pointer', transition: 'all 0.2s ease'
                                    }}
                                    onClick={handleAddGroup}
                                >
                                    <AddIcon color="primary" />
                                    <Typography color="primary" sx={{ ml: 1, fontWeight: 600 }}>Add Skill Group</Typography>
                                </Box>
                            </>
                        )}
                    </motion.div>
                )}

                {/* --- Skills Tab --- */}
                {tab === 'skills' && (
                    <motion.div
                        key="skills"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {showSkillForm ? (
                            <Card sx={{ mt: 2, p: 2, bgcolor: 'background.default' }}>
                                <Typography variant="h6" gutterBottom>
                                    {editingSkillId ? 'Edit Skill' : 'Add Skill'}
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            required
                                            label="Skill Name"
                                            name="name"
                                            value={skillForm.name}
                                            onChange={handleSkillInputChange}
                                            margin="normal"
                                            variant="outlined"
                                        />
                                        <TextField
                                            select
                                            fullWidth
                                            required
                                            label="Skill Group"
                                            name="skill_group_id"
                                            value={skillForm.skill_group_id}
                                            onChange={handleSkillInputChange}
                                            margin="normal"
                                            variant="outlined"
                                        >
                                            {skillGroups.map((group) => (
                                                <MenuItem key={group.id} value={group.id}>
                                                    {group.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        
                                        <Box sx={{ mt: 2, mb: 1 }}>
                                            <Typography variant="body2" gutterBottom>Proficiency Level</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {[1, 2, 3, 4, 5].map(level => (
                                                    <Chip
                                                        key={level}
                                                        label={level}
                                                        size="small"
                                                        color={level === skillForm.proficiency ? getProficiencyColor(level) : 'default'}
                                                        onClick={() => setSkillForm(prev => ({ ...prev, proficiency: level }))}
                                                        sx={{
                                                            cursor: 'pointer',
                                                            fontWeight: level === skillForm.proficiency ? 'bold' : 'normal',
                                                            opacity: level === skillForm.proficiency ? 1 : 0.7
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                                            <Switch
                                                checked={skillForm.is_visible}
                                                onChange={handleSkillInputChange}
                                                name="is_visible"
                                                color="success"
                                            />
                                            <Typography sx={{ ml: 1 }}>Visible</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="outlined"
                                                color="inherit"
                                                onClick={() => setShowSkillForm(false)}
                                                disabled={saving}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleSaveSkill}
                                                disabled={saving || !skillForm.name?.trim() || !skillForm.skill_group_id}
                                            >
                                                {saving ? 'Saving...' : (editingSkillId ? 'Update' : 'Create')}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Card>
                        ) : (
                            <>
                                <TableContainer sx={{ maxHeight: 520, overflowY: 'auto' }}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                                <TableCell width="120px">Actions</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Group</TableCell>
                                                <TableCell>Proficiency</TableCell>
                                                <TableCell width="100px">Visible</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {skillsData.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center">No skills found</TableCell>
                                                </TableRow>
                                            ) : (
                                                skillsData.map((skill) => {
                                                    const groupName = skillGroups.find(g => g.id === skill.skill_group_id)?.name || 'Unknown';
                                                    return (
                                                        <TableRow key={skill.id}>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', gap: '2px' }}>
                                                                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(skill, 'skill')}>
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                    <IconButton size="small" color="primary" onClick={() => handleEditSkill(skill)}>
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>{skill.name}</TableCell>
                                                            <TableCell>{groupName}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={`${skill.proficiency}/5`}
                                                                    size="small"
                                                                    color={getProficiencyColor(skill.proficiency)}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Switch
                                                                    checked={!!skill.is_visible}
                                                                    onChange={() => handleToggleSkillVisibility(skill)}
                                                                    color="success"
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Box
                                    component={motion.div}
                                    whileHover={{ scale: 1.01, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}
                                    whileTap={{ scale: 0.99 }}
                                    sx={{
                                        mt: 2, p: 2, border: '1px dashed', borderColor: 'primary.main',
                                        borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        cursor: 'pointer', transition: 'all 0.2s ease'
                                    }}
                                    onClick={handleAddSkill}
                                >
                                    <AddIcon color="primary" />
                                    <Typography color="primary" sx={{ ml: 1, fontWeight: 600 }}>Add Skill</Typography>
                                </Box>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <DeleteConfirmationDialog
                open={deleteDialog.open}
                title={deleteDialog.item ? `this ${deleteDialog.type}` : 'this item'}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteConfirm}
                isLoading={saving}
            />
        </motion.div>
    );
};

export default SkillsSection;
