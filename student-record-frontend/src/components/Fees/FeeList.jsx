/**
 * FeeList Component
 * Displays all fee records and allows fee management
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
    Card,
    CardContent,
    Grid,
} from '@mui/material';
import {
    Add,
    Delete,
    Refresh,
    Payment,
} from '@mui/icons-material';
import { feeAPI, studentAPI } from '../../services/api';

const FeeList = () => {
    // State variables
    const [fees, setFees] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openPayDialog, setOpenPayDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [feeToDelete, setFeeToDelete] = useState(null);
    const [formData, setFormData] = useState({
        studentId: '',
        totalFee: '',
        dueDate: '',
    });
    const [paymentAmount, setPaymentAmount] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch all fees and students
    const fetchData = async () => {
        try {
            setLoading(true);
            const [feesRes, studentsRes] = await Promise.all([
                feeAPI.getAll(),
                studentAPI.getAll(),
            ]);
            setFees(feesRes.data);
            setStudents(studentsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            showSnackbar('Failed to fetch data', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle form input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: '' });
        }
    };

    // Validate form
    const validate = () => {
        const errors = {};
        if (!formData.studentId) errors.studentId = 'Please select a student';
        if (!formData.totalFee || parseFloat(formData.totalFee) <= 0) {
            errors.totalFee = 'Please enter a valid fee amount';
        }
        if (!formData.dueDate) errors.dueDate = 'Please select a due date';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Create fee record
    const handleCreateFee = async () => {
        if (!validate()) return;

        try {
            await feeAPI.create({
                studentId: parseInt(formData.studentId),
                totalFee: parseFloat(formData.totalFee),
                dueDate: formData.dueDate,
            });
            showSnackbar('Fee record created successfully!', 'success');
            setOpenAddDialog(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Error creating fee record:', error);
            showSnackbar(error.response?.data?.message || 'Failed to create fee record', 'error');
        }
    };

    // Pay fee
    const handlePayFee = async () => {
        if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
            showSnackbar('Please enter a valid payment amount', 'error');
            return;
        }

        try {
            await feeAPI.pay(selectedFee.id, parseFloat(paymentAmount));
            showSnackbar('Payment recorded successfully!', 'success');
            setOpenPayDialog(false);
            setPaymentAmount('');
            fetchData();
        } catch (error) {
            console.error('Error paying fee:', error);
            showSnackbar('Failed to process payment', 'error');
        }
    };

    // Delete fee record
    const handleDeleteFee = async () => {
        try {
            await feeAPI.delete(feeToDelete.id);
            showSnackbar('Fee record deleted successfully!', 'success');
            fetchData();
            setOpenDeleteDialog(false);
        } catch (error) {
            showSnackbar('Failed to delete fee record', 'error');
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            studentId: '',
            totalFee: '',
            dueDate: '',
        });
        setFormErrors({});
    };

    // Show snackbar notification
    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'PAID': return 'success';
            case 'PARTIAL': return 'warning';
            case 'UNPAID': return 'error';
            default: return 'default';
        }
    };

    // Get student name by ID
    const getStudentName = (studentId) => {
        const student = students.find(s => s.id === studentId);
        return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
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
                    Fee Management
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenAddDialog(true)}
                    >
                        Add Fee Record
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchData}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Total Fees
                            </Typography>
                            <Typography variant="h5">
                                {fees.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Unpaid Students
                            </Typography>
                            <Typography variant="h5" color="error.main">
                                {fees.filter(f => f.status === 'UNPAID').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Total Collected
                            </Typography>
                            <Typography variant="h5" color="success.main">
                                ₹{fees.reduce((sum, f) => sum + (f.amountPaid || 0), 0).toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Fees Table */}
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.light' }}>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Student</strong></TableCell>
                                <TableCell><strong>Total Fee</strong></TableCell>
                                <TableCell><strong>Amount Paid</strong></TableCell>
                                <TableCell><strong>Outstanding</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Due Date</strong></TableCell>
                                <TableCell align="center"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No fee records found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                fees.map((fee) => (
                                    <TableRow key={fee.id} hover>
                                        <TableCell>{fee.id}</TableCell>
                                        <TableCell>{getStudentName(fee.student.id)}</TableCell>
                                        <TableCell>₹{fee.totalFee.toFixed(2)}</TableCell>
                                        <TableCell>₹{fee.amountPaid.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Typography
                                                color={fee.totalFee - fee.amountPaid > 0 ? 'error.main' : 'success.main'}
                                            >
                                                ₹{(fee.totalFee - fee.amountPaid).toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={fee.status}
                                                color={getStatusColor(fee.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{fee.dueDate}</TableCell>
                                        <TableCell align="center">
                                            {fee.status !== 'PAID' && (
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => {
                                                        setSelectedFee(fee);
                                                        setOpenPayDialog(true);
                                                    }}
                                                >
                                                    <Payment />
                                                </IconButton>
                                            )}
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => {
                                                    setFeeToDelete(fee);
                                                    setOpenDeleteDialog(true);
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

            {/* Add Fee Dialog */}
            <Dialog
                open={openAddDialog}
                onClose={() => {
                    setOpenAddDialog(false);
                    resetForm();
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Add Fee Record</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
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
                        >
                            {students.map((student) => (
                                <MenuItem key={student.id} value={student.id}>
                                    {student.firstName} {student.lastName} - {student.email}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            fullWidth
                            name="totalFee"
                            label="Total Fee (₹)"
                            type="number"
                            value={formData.totalFee}
                            onChange={handleChange}
                            error={!!formErrors.totalFee}
                            helperText={formErrors.totalFee}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            name="dueDate"
                            label="Due Date"
                            type="date"
                            value={formData.dueDate}
                            onChange={handleChange}
                            error={!!formErrors.dueDate}
                            helperText={formErrors.dueDate}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenAddDialog(false);
                        resetForm();
                    }}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreateFee} variant="contained">
                        Create Record
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Pay Fee Dialog */}
            <Dialog
                open={openPayDialog}
                onClose={() => {
                    setOpenPayDialog(false);
                    setPaymentAmount('');
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Pay Fee</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                            Student: <strong>{selectedFee ? getStudentName(selectedFee.student.id) : ''}</strong>
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Total Fee: ₹{selectedFee?.totalFee.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Already Paid: ₹{selectedFee?.amountPaid.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" gutterBottom color="error.main">
                            Outstanding: ₹{(selectedFee?.totalFee - selectedFee?.amountPaid).toFixed(2)}
                        </Typography>
                        <TextField
                            fullWidth
                            label="Payment Amount (₹)"
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            sx={{ mt: 2 }}
                            inputProps={{ min: 0, max: selectedFee?.totalFee - selectedFee?.amountPaid }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenPayDialog(false);
                        setPaymentAmount('');
                    }}>
                        Cancel
                    </Button>
                    <Button onClick={handlePayFee} variant="contained" color="success">
                        Record Payment
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this fee record for{' '}
                        <strong>{feeToDelete ? getStudentName(feeToDelete.student.id) : ''}</strong>
                        ? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleDeleteFee} color="error" variant="contained">
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

export default FeeList;