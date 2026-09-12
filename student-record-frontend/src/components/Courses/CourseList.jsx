/**
 * CourseList Component
 * Displays all courses in a table with add, edit, delete functionality
 */

import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    Add,
    Search,
    Edit,
    Delete,
    Refresh,
} from '@mui/icons-material';
import { courseAPI } from '../../services/api';
import AddCourse from './AddCourse';

const CourseList = () => {
    // State variables
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Fetch courses on component mount
    useEffect(() => {
        fetchCourses();
    }, []);

    // Fetch all courses from API
    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await courseAPI.getAll();
            setCourses(response.data);
            setFilteredCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            showSnackbar('Failed to fetch courses', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Search/filter courses
    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = courses.filter(
            (course) =>
                course.courseName.toLowerCase().includes(term) ||
                course.courseCode.toLowerCase().includes(term) ||
                course.professorName.toLowerCase().includes(term)
        );
        setFilteredCourses(filtered);
    };

    // Delete course
    const handleDelete = async () => {
        try {
            await courseAPI.delete(courseToDelete.id);
            showSnackbar('Course deleted successfully!', 'success');
            fetchCourses();
            setDeleteDialogOpen(false);
        } catch (error) {
            showSnackbar('Failed to delete course', 'error');
        }
    };

    // Show snackbar notification
    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Loading state
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
                <Typography variant="h4" fontWeight="bold">
                    Courses
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenAddDialog(true)}
                    >
                        Add Course
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchCourses}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* Search Bar */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search courses by name, code, or professor..."
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {/* Courses Table */}
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.light' }}>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Course Code</strong></TableCell>
                                <TableCell><strong>Course Name</strong></TableCell>
                                <TableCell><strong>Credits</strong></TableCell>
                                <TableCell><strong>Professor</strong></TableCell>
                                <TableCell align="center"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCourses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No courses found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCourses.map((course) => (
                                    <TableRow key={course.id} hover>
                                        <TableCell>{course.id}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="500">
                                                {course.courseCode}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{course.courseName}</TableCell>
                                        <TableCell>{course.credits}</TableCell>
                                        <TableCell>{course.professorName}</TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => {
                                                    setSelectedCourse(course);
                                                    setOpenEditDialog(true);
                                                }}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setCourseToDelete(course);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Add Course Dialog */}
            <Dialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Add New Course</DialogTitle>
                <DialogContent>
                    <AddCourse
                        onSuccess={() => {
                            setOpenAddDialog(false);
                            fetchCourses();
                            showSnackbar('Course added successfully!', 'success');
                        }}
                        onCancel={() => setOpenAddDialog(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Course Dialog */}
            <Dialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Edit Course</DialogTitle>
                <DialogContent>
                    <AddCourse
                        course={selectedCourse}
                        onSuccess={() => {
                            setOpenEditDialog(false);
                            fetchCourses();
                            showSnackbar('Course updated successfully!', 'success');
                        }}
                        onCancel={() => setOpenEditDialog(false)}
                        isEdit={true}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete course{' '}
                        <strong>
                            {courseToDelete?.courseName}
                        </strong>
                        ? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CourseList;