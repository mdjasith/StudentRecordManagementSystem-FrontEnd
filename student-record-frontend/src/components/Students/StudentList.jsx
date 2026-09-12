/**
 * StudentList Component
 * Displays all students in a table with search, add, edit, delete functionality
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
    Chip,
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
import { studentAPI } from '../../services/api';
import AddStudent from './AddStudent';
import EditStudent from './EditStudent';

const StudentList = () => {
    // State variables
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Fetch students on component mount
    useEffect(() => {
        fetchStudents();
    }, []);

    // Fetch all students from API
    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await studentAPI.getAll();
            setStudents(response.data);
            setFilteredStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            showSnackbar('Failed to fetch students', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Search/filter students
    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = students.filter(
            (student) =>
                student.firstName.toLowerCase().includes(term) ||
                student.lastName.toLowerCase().includes(term) ||
                student.email.toLowerCase().includes(term) ||
                student.phone.includes(term)
        );
        setFilteredStudents(filtered);
    };

    // Delete student
    const handleDelete = async () => {
        try {
            await studentAPI.delete(studentToDelete.id);
            showSnackbar('Student deleted successfully!', 'success');
            fetchStudents();
            setDeleteDialogOpen(false);
        } catch (error) {
            showSnackbar('Failed to delete student', 'error');
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
                    Students
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenAddDialog(true)}
                    >
                        Add Student
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchStudents}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* Search Bar */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search students by name, email, or phone..."
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

            {/* Students Table */}
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.light' }}>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Phone</strong></TableCell>
                                <TableCell><strong>Parent</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell align="center"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredStudents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No students found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredStudents.map((student) => (
                                    <TableRow key={student.id} hover>
                                        <TableCell>{student.id}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="500">
                                                {`${student.firstName} ${student.lastName}`}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{student.email}</TableCell>
                                        <TableCell>{student.phone}</TableCell>
                                        <TableCell>{student.parentName}</TableCell>
                                        <TableCell>
                                            <Chip label="Active" color="success" size="small" />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setOpenEditDialog(true);
                                                }}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setStudentToDelete(student);
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

            {/* Add Student Dialog */}
            <Dialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Add New Student</DialogTitle>
                <DialogContent>
                    <AddStudent
                        onSuccess={() => {
                            setOpenAddDialog(false);
                            fetchStudents();
                            showSnackbar('Student added successfully!', 'success');
                        }}
                        onCancel={() => setOpenAddDialog(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Student Dialog */}
            <Dialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Edit Student</DialogTitle>
                <DialogContent>
                    <EditStudent
                        student={selectedStudent}
                        onSuccess={() => {
                            setOpenEditDialog(false);
                            fetchStudents();
                            showSnackbar('Student updated successfully!', 'success');
                        }}
                        onCancel={() => setOpenEditDialog(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete student{' '}
                        <strong>
                            {studentToDelete?.firstName} {studentToDelete?.lastName}
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

export default StudentList;