/**
 * Dashboard Component
 * Main landing page with statistics and overview
 * Displays: Student count, Course count, Fee status, Attendance summary
 */

import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
} from '@mui/material';
import {
    People,
    Book,
    AttachMoney,
    EventNote,
    TrendingUp,
    TrendingDown,
} from '@mui/icons-material';
import { studentAPI, courseAPI, feeAPI, attendanceAPI } from '../../services/api';

/**
 * Stat Card Component
 * Reusable card for displaying statistics
 */
const StatCard = ({ title, value, icon, color, change }) => (
    <Card sx={{ height: '100%', bgcolor: color, color: 'white' }}>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                        {value}
                    </Typography>
                    {change && (
                        <Typography
                            variant="caption"
                            sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
                        >
                            {change > 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                            {Math.abs(change)}% from last month
                        </Typography>
                    )}
                </Box>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%', p: 1 }}>
                    {icon}
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        students: 0,
        courses: 0,
        fees: 0,
        attendance: 0,
    });
    const [recentStudents, setRecentStudents] = useState([]);
    const [unpaidFees, setUnpaidFees] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch dashboard data on component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Fetch all dashboard data from API
    const fetchDashboardData = async () => {
        try {
            // Parallel API calls for better performance
            const [studentsRes, coursesRes, feesRes, unpaidRes] = await Promise.all([
                studentAPI.getAll(),
                courseAPI.getAll(),
                feeAPI.getAll(),
                feeAPI.getUnpaid(),
            ]);

            // Calculate average attendance
            let totalAttendance = 0;
            let attendanceCount = 0;
            for (const student of studentsRes.data) {
                try {
                    const attRes = await attendanceAPI.getPercentage(student.id);
                    if (attRes.data > 0) {
                        totalAttendance += attRes.data;
                        attendanceCount++;
                    }
                } catch (error) {
                    // Student has no attendance records - skip
                }
            }

            setStats({
                students: studentsRes.data.length,
                courses: coursesRes.data.length,
                fees: feesRes.data.length,
                attendance: attendanceCount > 0 ? Math.round(totalAttendance / attendanceCount) : 0,
            });

            setRecentStudents(studentsRes.data.slice(0, 5));
            setUnpaidFees(unpaidRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {/* Page Header */}
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Welcome back! Here's what's happening with your institution.
            </Typography>

            {/* Statistics Cards */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Students"
                        value={stats.students}
                        icon={<People sx={{ fontSize: 30 }} />}
                        color="#1976D2"
                        change={12}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Courses"
                        value={stats.courses}
                        icon={<Book sx={{ fontSize: 30 }} />}
                        color="#2E7D32"
                        change={5}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Fees Records"
                        value={stats.fees}
                        icon={<AttachMoney sx={{ fontSize: 30 }} />}
                        color="#ED6C02"
                        change={8}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Avg Attendance"
                        value={`${stats.attendance}%`}
                        icon={<EventNote sx={{ fontSize: 30 }} />}
                        color="#9C27B0"
                        change={stats.attendance > 75 ? 3 : -5}
                    />
                </Grid>
            </Grid>

            {/* Recent Students & Unpaid Fees Tables */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Students
                        </Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Name</strong></TableCell>
                                        <TableCell><strong>Email</strong></TableCell>
                                        <TableCell><strong>Phone</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentStudents.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell>
                                                {`${student.firstName} ${student.lastName}`}
                                            </TableCell>
                                            <TableCell>{student.email}</TableCell>
                                            <TableCell>{student.phone}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Unpaid Students
                        </Typography>
                        {unpaidFees.length === 0 ? (
                            <Typography color="success.main" sx={{ py: 2 }}>
                                🎉 All students have paid their fees!
                            </Typography>
                        ) : (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Student</strong></TableCell>
                                            <TableCell><strong>Due Amount</strong></TableCell>
                                            <TableCell><strong>Status</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {unpaidFees.map((fee) => (
                                            <TableRow key={fee.id}>
                                                <TableCell>
                                                    {`${fee.student.firstName} ${fee.student.lastName}`}
                                                </TableCell>
                                                <TableCell>
                                                    ₹{(fee.totalFee - fee.amountPaid).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={fee.status}
                                                        color={fee.status === 'UNPAID' ? 'error' : 'warning'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;