/**
 * FeePayment Component
 * Standalone component for processing fee payments
 * Can be used as a dialog or a separate page
 */

import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    Divider,
    Alert,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import {
    Payment as PaymentIcon,
    CheckCircle as CheckCircleIcon,
    AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { feeAPI, studentAPI } from '../../services/api';

const FeePayment = ({ feeId, onSuccess, onCancel }) => {
    // State variables
    const [fee, setFee] = useState(null);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [feeRecords, setFeeRecords] = useState([]);

    const steps = ['Select Student', 'Enter Payment', 'Confirm Payment'];

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, [feeId]);

    // Fetch all necessary data
    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch all students for dropdown
            const studentsRes = await studentAPI.getAll();
            setStudents(studentsRes.data);

            // If feeId is provided, fetch specific fee record
            if (feeId) {
                const feeRes = await feeAPI.getById(feeId);
                setFee(feeRes.data);
                setSelectedStudent(feeRes.data.student.id);
                setPaymentAmount((feeRes.data.totalFee - feeRes.data.amountPaid).toString());
            }

            // Fetch all fee records for the dropdown
            const feesRes = await feeAPI.getAll();
            setFeeRecords(feesRes.data);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load data. Please try again.');
            setLoading(false);
        }
    };

    // Handle student selection
    const handleStudentChange = async (studentId) => {
        setSelectedStudent(studentId);
        try {
            const feeRes = await feeAPI.getByStudent(studentId);
            setFee(feeRes.data);
            setPaymentAmount((feeRes.data.totalFee - feeRes.data.amountPaid).toString());
            setError('');
        } catch (error) {
            setFee(null);
            setPaymentAmount('');
            setError('No fee record found for this student.');
        }
    };

    // Handle payment submission
    const handlePayment = async () => {
        if (!fee) {
            setError('Please select a valid fee record.');
            return;
        }

        const amount = parseFloat(paymentAmount);
        if (!amount || amount <= 0) {
            setError('Please enter a valid payment amount.');
            return;
        }

        if (amount > (fee.totalFee - fee.amountPaid)) {
            setError('Payment amount cannot exceed outstanding balance.');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            
            await feeAPI.pay(fee.id, amount);
            
            setSuccess(true);
            setActiveStep(2);
            
            // Refresh fee data
            const updatedFee = await feeAPI.getById(fee.id);
            setFee(updatedFee.data);
            
            if (onSuccess) {
                onSuccess(updatedFee.data);
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            setError(error.response?.data?.message || 'Failed to process payment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Handle next step
    const handleNext = () => {
        if (activeStep === 0 && !selectedStudent) {
            setError('Please select a student.');
            return;
        }
        if (activeStep === 0 && fee && fee.status === 'PAID') {
            setError('This student has already paid all fees.');
            return;
        }
        setActiveStep((prevStep) => prevStep + 1);
        setError('');
    };

    // Handle back step
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
        setError('');
    };

    // Reset the form
    const handleReset = () => {
        setActiveStep(0);
        setSelectedStudent('');
        setPaymentAmount('');
        setFee(null);
        setSuccess(false);
        setError('');
    };

    // Loading state
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Success state
    if (success) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main' }} />
                <Typography variant="h5" gutterBottom color="success.main">
                    Payment Successful!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Payment of ₹{paymentAmount} has been recorded for{' '}
                    <strong>{fee?.student?.firstName} {fee?.student?.lastName}</strong>.
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Outstanding Balance: ₹{(fee?.totalFee - fee?.amountPaid).toFixed(2)}
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <Button variant="contained" onClick={handleReset}>
                        Make Another Payment
                    </Button>
                    {onCancel && (
                        <Button variant="outlined" onClick={onCancel} sx={{ ml: 2 }}>
                            Close
                        </Button>
                    )}
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <PaymentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h5" fontWeight="bold">
                    Fee Payment
                </Typography>
            </Box>

            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Step 1: Select Student */}
            {activeStep === 0 && (
                <Box>
                    <Typography variant="subtitle1" gutterBottom>
                        Select Student
                    </Typography>
                    
                    {/* Student Dropdown */}
                    <TextField
                        fullWidth
                        select
                        label="Select Student"
                        value={selectedStudent}
                        onChange={(e) => handleStudentChange(e.target.value)}
                        SelectProps={{ native: true }}
                        sx={{ mb: 3 }}
                    >
                        <option value="">Select a student</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.firstName} {student.lastName} - {student.email}
                            </option>
                        ))}
                    </TextField>

                    {/* Fee Details Card */}
                    {fee && (
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Fee Details
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Student
                                        </Typography>
                                        <Typography variant="body1" fontWeight="500">
                                            {fee.student.firstName} {fee.student.lastName}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Fee
                                        </Typography>
                                        <Typography variant="body1" fontWeight="500">
                                            ₹{fee.totalFee.toFixed(2)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Amount Paid
                                        </Typography>
                                        <Typography variant="body1" fontWeight="500" color="success.main">
                                            ₹{fee.amountPaid.toFixed(2)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Outstanding Balance
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold" color="error.main">
                                            ₹{(fee.totalFee - fee.amountPaid).toFixed(2)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            Status
                                        </Typography>
                                        <Typography variant="body1">
                                            {fee.status}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={!fee || fee.status === 'PAID'}
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Step 2: Enter Payment */}
            {activeStep === 1 && fee && (
                <Box>
                    <Typography variant="subtitle1" gutterBottom>
                        Enter Payment Amount
                    </Typography>

                    <Card sx={{ mb: 3, bgcolor: 'primary.light' }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Student
                                    </Typography>
                                    <Typography variant="body1" fontWeight="500">
                                        {fee.student.firstName} {fee.student.lastName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                        Outstanding Balance
                                    </Typography>
                                    <Typography variant="h6" color="error.main">
                                        ₹{(fee.totalFee - fee.amountPaid).toFixed(2)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <TextField
                        fullWidth
                        label="Payment Amount (₹)"
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        InputProps={{
                            startAdornment: <AttachMoneyIcon sx={{ mr: 1 }} />,
                        }}
                        helperText={`Maximum: ₹${(fee.totalFee - fee.amountPaid).toFixed(2)}`}
                        sx={{ mb: 3 }}
                        inputProps={{
                            min: 0,
                            max: fee.totalFee - fee.amountPaid,
                            step: 0.01,
                        }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button onClick={handleBack}>
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handlePayment}
                            disabled={submitting || !paymentAmount || parseFloat(paymentAmount) <= 0}
                        >
                            {submitting ? <CircularProgress size={24} /> : 'Confirm Payment'}
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Cancel Button */}
            {onCancel && activeStep < 2 && (
                <Box sx={{ mt: 3 }}>
                    <Button onClick={onCancel} color="inherit">
                        Cancel
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default FeePayment;