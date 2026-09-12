/**
 * EnrollmentList Component
 * Complete fixed version with proper error handling and validation
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Snackbar,
    TextField,
    MenuItem,
    Chip,
} from '@mui/material';
import {
    Add,
    Delete,
    Refresh,
    School,
} from '@mui/icons-material';
import { enrollmentAPI, studentAPI, courseAPI } from '../../services/api';

const EnrollmentList = () => {
    // State variables
    const [enrollments, setEnrollments] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [enrollmentToDelete, setEnrollmentToDelete] = useState(null);
    const [formData, setFormData] = useState({
        studentId: '',
        courseId: '',
        semester: 'Fall 2026',
    });
    const [formErrors, setFormErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [validationError, setValidationError] = useState('');

    // Fetch data on component mount
    useEffect(() => {
        fetchAllData();
    }, []);

    // ✅ Fetch all data with proper error handling
    const fetchAllData = async () => {
        try {
            setLoading(true);
            setValidationError('');
            
            const [studentsRes, coursesRes, enrollmentsRes] = await Promise.all([
                studentAPI.getAll(),
                courseAPI.getAll(),
                enrollmentAPI.getAll().catch(() => ({ data: [] }))
            ]);

            setStudents(studentsRes.data || []);
            setCourses(coursesRes.data || []);
            
            // ✅ Check if we have valid data
            if (studentsRes.data.length === 0) {
                setValidationError('No students found. Please add students first.');
            }
            if (coursesRes.data.length === 0) {
                setValidationError(prev => prev ? prev + ' No courses found.' : 'No courses found. Please add courses first.');
            }
            
            const formattedEnrollments = (enrollmentsRes.data || []).map((enrollment) => {
                const student = studentsRes.data.find(s => s.id === enrollment.student?.id);
                const course = coursesRes.data.find(c => c.id === enrollment.course?.id);
                return {
                    ...enrollment,
                    studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
                    courseName: course ? course.courseName : 'Unknown Course',
                    courseCode: course ? course.courseCode : 'N/A',
                };
            });
            
            setEnrollments(formattedEnrollments);
            
        } catch (error) {
            console.error('Error fetching data:', error);
            showSnackbar('Failed to load data. Please refresh.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle form input changes with validation
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear errors for this field
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: '' });
        }
    };

    // ✅ Validate form with existing data check
    const validate = () => {
        const errors = {};
        
        // Check if fields are empty
        if (!formData.studentId) {
            errors.studentId = 'Please select a student';
        } else {
            // ✅ Check if student exists in database
            const studentExists = students.some(s => s.id === parseInt(formData.studentId));
            if (!studentExists) {
                errors.studentId = 'Selected student does not exist. Please refresh the page.';
            }
        }
        
        if (!formData.courseId) {
            errors.courseId = 'Please select a course';
        } else {
            // ✅ Check if course exists in database
            const courseExists = courses.some(c => c.id === parseInt(formData.courseId));
            if (!courseExists) {
                errors.courseId = 'Selected course does not exist. Please refresh the page.';
            }
        }
        
        if (!formData.semester.trim()) {
            errors.semester = 'Semester is required';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // ✅ Enroll student - FIXED
    const handleEnroll = async () => {
        // Validate form
        if (!validate()) {
            showSnackbar('Please fix the validation errors', 'error');
            return;
        }

        try {
            setSubmitting(true);
            
            const studentId = parseInt(formData.studentId);
            const courseId = parseInt(formData.courseId);
            
            // ✅ Double check IDs exist
            const studentExists = students.some(s => s.id === studentId);
            const courseExists = courses.some(c => c.id === courseId);
            
            if (!studentExists) {
                showSnackbar('Student not found. Please refresh the page.', 'error');
                setSubmitting(false);
                return;
            }
            
            if (!courseExists) {
                showSnackbar('Course not found. Please refresh the page.', 'error');
                setSubmitting(false);
                return;
            }
            
            const enrollmentData = {
                studentId: studentId,
                courseId: courseId,
                semester: formData.semester
            };

            console.log('Sending enrollment data:', enrollmentData);

            const response = await enrollmentAPI.enroll(enrollmentData);
            
            console.log('Enrollment response:', response.data);

            const student = students.find(s => s.id === studentId);
            const course = courses.find(c => c.id === courseId);
            
            showSnackbar(
                `✅ ${student?.firstName} ${student?.lastName} enrolled in ${course?.courseName} successfully!`,
                'success'
            );
            
            setOpenAddDialog(false);
            resetForm();
            await fetchAllData();
            
        } catch (error) {
            console.error('Error enrolling student:', error);
            
            let errorMessage = 'Failed to enroll student. Please try again.';
            
            if (error.response) {
                console.log('Error response:', error.response);
                console.log('Error data:', error.response.data);
                console.log('Error status:', error.response.status);
                
                // ✅ Extract validation error details
                if (error.response.data) {
                    if (typeof error.response.data === 'string') {
                        errorMessage = error.response.data;
                    } else if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                        
                        // ✅ Check if it's a validation error with details
                        if (error.response.data.errors) {
                            const validationDetails = error.response.data.errors
                                .map(e => `${e.field}: ${e.defaultMessage}`)
                                .join(', ');
                            errorMessage = `${errorMessage} (${validationDetails})`;
                        }
                    } else if (error.response.data.error) {
                        errorMessage = error.response.data.error;
                    } else {
                        errorMessage = JSON.stringify(error.response.data);
                    }
                }
            } else if (error.request) {
                errorMessage = 'No response from server. Please check your backend.';
            } else {
                errorMessage = error.message || 'Failed to enroll student';
            }
            
            showSnackbar(errorMessage, 'error');
            
        } finally {
            setSubmitting(false);
        }
    };

    // ✅ Delete enrollment
    const handleDelete = async () => {
        try {
            await enrollmentAPI.delete(enrollmentToDelete.id);
            showSnackbar('Enrollment deleted successfully!', 'success');
            await fetchAllData();
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error('Error deleting enrollment:', error);
            let errorMessage = 'Failed to delete enrollment';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            showSnackbar(errorMessage, 'error');
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            studentId: '',
            courseId: '',
            semester: 'Fall 2026',
        });
        setFormErrors({});
    };

    // Show snackbar notification
    const showSnackbar = (message, severity) => {
        const safeMessage = typeof message === 'string' ? message : 'An error occurred';
        setSnackbar({ open: true, message: safeMessage, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (e) {
            return dateString;
        }
    };

    // Loading state
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ ml: 2 }}>
                    Loading enrollments...
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <School sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Typography variant="h4" fontWeight="bold">
                        Enrollments
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenAddDialog(true)}
                        disabled={students.length === 0 || courses.length === 0}
                    >
                        Enroll Student
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchAllData}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* Validation Warning */}
            {validationError && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    {validationError}
                </Alert>
            )}

            {/* Statistics */}
            <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Total Enrollments
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                        {enrollments.length}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Total Students
                    </Typography>
                    <Typography variant="h6" color="success.main">
                        {students.length}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Total Courses
                    </Typography>
                    <Typography variant="h6" color="info.main">
                        {courses.length}
                    </Typography>
                </Box>
            </Paper>

            {/* Enrollments Table */}
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.light' }}>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Student</strong></TableCell>
                                <TableCell><strong>Course</strong></TableCell>
                                <TableCell><strong>Semester</strong></TableCell>
                                <TableCell><strong>Enrollment Date</strong></TableCell>
                                <TableCell align="center"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {enrollments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <Typography variant="h6" color="text.secondary">
                                            No enrollments found
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            {students.length > 0 && courses.length > 0 
                                                ? 'Click "Enroll Student" to add an enrollment.'
                                                : students.length === 0 
                                                    ? 'Please add students first.'
                                                    : 'Please add courses first.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                enrollments.map((enrollment) => (
                                    <TableRow key={enrollment.id} hover>
                                        <TableCell>{enrollment.id}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="500">
                                                {enrollment.studentName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={enrollment.courseName}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={enrollment.semester}
                                                size="small"
                                                color="info"
                                            />
                                        </TableCell>
                                        <TableCell>{formatDate(enrollment.enrollmentDate)}</TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setEnrollmentToDelete(enrollment);
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

            {/* ✅ Add Enrollment Dialog - FIXED */}
            <Dialog
                open={openAddDialog}
                onClose={() => {
                    if (!submitting) {
                        setOpenAddDialog(false);
                        resetForm();
                    }
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Add color="primary" />
                        Enroll Student in Course
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        {/* ✅ Show available students count */}
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            Available Students: {students.length}
                        </Typography>
                        
                        <TextField
                            fullWidth
                            select
                            name="studentId"
                            label="Select Student"
                            value={formData.studentId}
                            onChange={handleChange}
                            error={!!formErrors.studentId}
                            helperText={formErrors.studentId}
                            sx={{ mb: 2 }}
                            disabled={submitting || students.length === 0}
                        >
                            <MenuItem value="">Select a student</MenuItem>
                            {students.map((student) => (
                                <MenuItem key={student.id} value={student.id}>
                                    {student.firstName} {student.lastName} - {student.email}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* ✅ Show available courses count */}
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            Available Courses: {courses.length}
                        </Typography>

                        <TextField
                            fullWidth
                            select
                            name="courseId"
                            label="Select Course"
                            value={formData.courseId}
                            onChange={handleChange}
                            error={!!formErrors.courseId}
                            helperText={formErrors.courseId}
                            sx={{ mb: 2 }}
                            disabled={submitting || courses.length === 0}
                        >
                            <MenuItem value="">Select a course</MenuItem>
                            {courses.map((course) => (
                                <MenuItem key={course.id} value={course.id}>
                                    {course.courseCode} - {course.courseName}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            fullWidth
                            select
                            name="semester"
                            label="Semester"
                            value={formData.semester}
                            onChange={handleChange}
                            error={!!formErrors.semester}
                            helperText={formErrors.semester}
                            disabled={submitting}
                        >
                            <MenuItem value="Spring 2026">Spring 2026</MenuItem>
                            <MenuItem value="Summer 2026">Summer 2026</MenuItem>
                            <MenuItem value="Fall 2026">Fall 2026</MenuItem>
                            <MenuItem value="Spring 2027">Spring 2027</MenuItem>
                            <MenuItem value="Summer 2027">Summer 2027</MenuItem>
                            <MenuItem value="Fall 2027">Fall 2027</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => {
                            setOpenAddDialog(false);
                            resetForm();
                        }}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleEnroll} 
                        variant="contained"
                        disabled={submitting || !formData.studentId || !formData.courseId || students.length === 0 || courses.length === 0}
                        startIcon={submitting ? <CircularProgress size={20} /> : null}
                    >
                        {submitting ? 'Enrolling...' : 'Enroll'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this enrollment for{' '}
                        <strong>{enrollmentToDelete?.studentName}</strong> in{' '}
                        <strong>{enrollmentToDelete?.courseName}</strong>?
                    </Typography>
                    <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                        This action cannot be undone.
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
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    sx={{ width: '100%' }}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EnrollmentList;