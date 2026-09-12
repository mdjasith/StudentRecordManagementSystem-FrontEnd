/**
 * AttendanceManager Component
 * Manages attendance marking and viewing attendance records
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
    Card,
    CardContent,
    Grid,
} from '@mui/material';
import {
    CheckCircle,
    Cancel,
    Refresh,
} from '@mui/icons-material';
import { attendanceAPI, studentAPI, enrollmentAPI } from '../../services/api';

const AttendanceManager = () => {
    // State variables
    const [students, setStudents] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedEnrollment, setSelectedEnrollment] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [attendancePercentage, setAttendancePercentage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [openMarkDialog, setOpenMarkDialog] = useState(false);
    const [selectedEnrollmentForMark, setSelectedEnrollmentForMark] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Fetch data on component mount
    useEffect(() => {
        fetchInitialData();
    }, []);

    // Fetch initial data
    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const studentsRes = await studentAPI.getAll();
            setStudents(studentsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            showSnackbar('Failed to fetch data', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Fetch attendance when student is selected
    useEffect(() => {
        if (selectedStudent) {
            fetchAttendance(selectedStudent);
        }
    }, [selectedStudent]);

    // Fetch attendance for a student
    const fetchAttendance = async (studentId) => {
        try {
            setLoading(true);
            
            // Get enrollments for the student
            const enrollmentsRes = await enrollmentAPI.getByStudent(studentId);
            setEnrollments(enrollmentsRes.data);
            
            // Get attendance records
            const attendanceRes = await attendanceAPI.getByStudent(studentId);
            setAttendanceRecords(attendanceRes.data);
            
            // Get attendance percentage
            const percentageRes = await attendanceAPI.getPercentage(studentId);
            setAttendancePercentage(percentageRes.data);
            
        } catch (error) {
            console.error('Error fetching attendance:', error);
            showSnackbar('Failed to fetch attendance data', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Mark attendance
    const handleMarkAttendance = async (status) => {
        try {
            await attendanceAPI.mark(selectedEnrollmentForMark, status);
            showSnackbar(`Attendance marked as ${status}!`, 'success');
            setOpenMarkDialog(false);
            fetchAttendance(selectedStudent);
        } catch (error) {
            console.error('Error marking attendance:', error);
            showSnackbar(error.response?.data?.message || 'Failed to mark attendance', 'error');
        }
    };

    // Show snackbar notification
    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
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
                    Attendance Management
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={() => selectedStudent && fetchAttendance(selectedStudent)}
                >
                    Refresh
                </Button>
            </Box>

            {/* Student Selector */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            select
                            label="Select Student"
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                        >
                            <MenuItem value="">Select a student</MenuItem>
                            {students.map((student) => (
                                <MenuItem key={student.id} value={student.id}>
                                    {student.firstName} {student.lastName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    {selectedStudent && (
                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Total Classes
                                            </Typography>
                                            <Typography variant="h5">
                                                {attendanceRecords.length}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Attendance Percentage
                                            </Typography>
                                            <Typography variant="h5" color={attendancePercentage >= 75 ? 'success.main' : 'error.main'}>
                                                {attendancePercentage.toFixed(1)}%
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            {selectedStudent && (
                <>
                    {/* Quick Mark Attendance */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Mark Attendance
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Select Course"
                                    value={selectedEnrollmentForMark || ''}
                                    onChange={(e) => setSelectedEnrollmentForMark(e.target.value)}
                                >
                                    <MenuItem value="">Select a course</MenuItem>
                                    {enrollments.map((enrollment) => (
                                        <MenuItem key={enrollment.id} value={enrollment.id}>
                                            {enrollment.course.courseName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircle />}
                                        onClick={() => handleMarkAttendance('PRESENT')}
                                        disabled={!selectedEnrollmentForMark}
                                    >
                                        Mark Present
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="error"
                                        startIcon={<Cancel />}
                                        onClick={() => handleMarkAttendance('ABSENT')}
                                        disabled={!selectedEnrollmentForMark}
                                    >
                                        Mark Absent
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Attendance Records Table */}
                    <Paper>
                        <Typography variant="h6" sx={{ p: 2 }}>
                            Attendance Records
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'primary.light' }}>
                                        <TableCell><strong>Date</strong></TableCell>
                                        <TableCell><strong>Course</strong></TableCell>
                                        <TableCell><strong>Status</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendanceRecords.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                                                <Typography variant="body1" color="text.secondary">
                                                    No attendance records found
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        attendanceRecords.map((record) => (
                                            <TableRow key={record.id} hover>
                                                <TableCell>{formatDate(record.date)}</TableCell>
                                                <TableCell>
                                                    {record.enrollment.course.courseName}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={record.status}
                                                        color={record.status === 'PRESENT' ? 'success' : 'error'}
                                                        size="small"
                                                        icon={record.status === 'PRESENT' ? <CheckCircle /> : <Cancel />}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </>
            )}

            {!selectedStudent && (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        Please select a student to view attendance
                    </Typography>
                </Paper>
            )}

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

export default AttendanceManager;