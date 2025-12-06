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
    Collapse,
    TextField,
    Switch,
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getAllReviews, deleteReview, updateReviewVisibility } from '../../../api/services/reviewService';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const ReviewsSection = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        item: null
    });
    const [searchText, setSearchText] = useState('');
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
    const [expandedRow, setExpandedRow] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await getAllReviews();
            setReviews(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to load reviews');
            setLoading(false);
        }
    };

    // Initialize filteredReviews with all reviews when component mounts
    useEffect(() => {
        setFilteredReviews(reviews);
    }, [reviews]);

    // Format date for display
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filter and sort reviews
    useEffect(() => {
        let result = [...reviews];

        // Apply search filter
        if (searchText) {
            const lowercasedFilter = searchText.toLowerCase();
            result = result.filter(review => {
                return (
                    review.name?.toLowerCase().includes(lowercasedFilter) ||
                    review.content?.toLowerCase().includes(lowercasedFilter) ||
                    review.where_known_from?.toLowerCase().includes(lowercasedFilter)
                );
            });
        }

        // Apply sorting
        result.sort((a, b) => {
            if (sortConfig.key === 'created_at') {
                const dateA = new Date(a[sortConfig.key]);
                const dateB = new Date(b[sortConfig.key]);
                return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
            }

            const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
            const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';

            if (sortConfig.direction === 'asc') {
                return aValue.localeCompare(bValue);
            }
            return bValue.localeCompare(aValue);
        });

        setFilteredReviews(result);
    }, [reviews, searchText, sortConfig]);

    const handleDeleteClick = (reviewId) => {
        const reviewToDelete = reviews.find(r => r.id === reviewId);
        setDeleteDialog({
            open: true,
            item: reviewToDelete
        });
    };

    const handleDeleteConfirm = async () => {
        const { item } = deleteDialog;
        if (!item) return;

        // We don't want to set global loading here as it would hide the table
        // Instead we could have a deleting state, but for now just wait for the promise
        try {
            await deleteReview(item.id);
            setReviews(prev => prev.filter(review => review.id !== item.id));
            toast.success('Review deleted successfully');
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Failed to delete review');
        } finally {
            setDeleteDialog({ open: false, item: null });
        }
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialog({ open: false, item: null });
    };

    const handleToggleVisibility = async (id, currentVisibility) => {
        const reviewIndex = reviews.findIndex(r => r.id === id);
        if (reviewIndex === -1) return;

        const newVisibility = !currentVisibility;

        // Optimistic update
        setReviews(prevReviews =>
            prevReviews.map(r =>
                r.id === id ? { ...r, is_visible: newVisibility } : r
            )
        );

        try {
            await updateReviewVisibility(id, newVisibility);
            toast.success(`Review visibility ${newVisibility ? 'enabled' : 'disabled'}`);
        } catch (error) {
            console.error('Error updating review visibility:', error);
            toast.error('Failed to update review visibility');

            // Revert on error
            setReviews(prevReviews =>
                prevReviews.map(r =>
                    r.id === id ? { ...r, is_visible: !newVisibility } : r
                )
            );
        }
    };

    const handleRowExpand = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    if (loading && reviews.length === 0) {
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
            <Box sx={{ width: '100%', mb: 2 }}>
                <TextField
                    label="Search reviews"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search by name, content, rating, etc."
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

            <TableContainer sx={{ maxHeight: 520, overflowY: 'auto' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell width="120px">Actions</TableCell>
                            <TableCell onClick={() => handleSort('name')} sx={{ cursor: 'pointer' }}>
                                Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </TableCell>
                            <TableCell onClick={() => handleSort('rating')} sx={{ cursor: 'pointer' }}>
                                Rating {sortConfig.key === 'rating' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </TableCell>
                            <TableCell onClick={() => handleSort('where_known_from')} sx={{ cursor: 'pointer' }}>
                                Where From {sortConfig.key === 'where_known_from' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </TableCell>
                            <TableCell onClick={() => handleSort('created_at')} sx={{ cursor: 'pointer' }}>
                                Date {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </TableCell>
                            <TableCell width="100px">Visible</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredReviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No reviews found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredReviews.map((review) => (
                                <React.Fragment key={review.id}>
                                    <TableRow
                                        component={motion.tr}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        sx={{ borderBottom: 0 }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteClick(review.id)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleRowExpand(review.id)}
                                                    sx={{
                                                        transform: expandedRow === review.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                                        transition: 'transform 0.2s'
                                                    }}
                                                >
                                                    <ExpandMoreIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{review.name}</TableCell>
                                        <TableCell>{review.rating}</TableCell>
                                        <TableCell>{review.where_known_from}</TableCell>
                                        <TableCell>{formatDateForDisplay(review.created_at)}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={review.is_visible}
                                                onChange={() => handleToggleVisibility(review.id, review.is_visible)}
                                                color="success"
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={6} sx={{ p: 0, borderBottom: '1px solid', borderColor: 'divider' }}>
                                            <Collapse in={expandedRow === review.id}>
                                                <Box sx={{
                                                    p: 2,
                                                    borderTop: '1px solid',
                                                    borderColor: 'divider',
                                                }}>
                                                    <Typography variant="subtitle2" gutterBottom color="text.secondary">
                                                        Review Content
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                                        {review.content}
                                                    </Typography>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <DeleteConfirmationDialog
                open={deleteDialog.open}
                title={deleteDialog.item ? `the review from "${deleteDialog.item.name}"` : 'this review'}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteConfirm}
                isLoading={false}
            />
        </motion.div>
    );
};

export default ReviewsSection;
