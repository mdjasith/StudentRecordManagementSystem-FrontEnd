/**
 * AddCourse Component
 * Form for adding or editing a course
 */

import React, { useState, useEffect } from 'react';
import {
    Grid,
    TextField,
    Button,
    Box,
    Alert,
} from '@mui/material';
import { courseAPI } from '../../services/api';

const AddCourse = ({ course, onSuccess, onCancel, isEdit = false }) => {
    // Form state
    const [formData, setFormData] = useState({
        courseCode: '',
        courseName: '',
        credits: '',
        professorName: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Populate form for edit
    useEffect(() => {
        if (course && isEdit) {
            setFormData({
                courseCode: course.courseCode || '',
                courseName: course.courseName || '',
                credits: course.credits || '',
                professorName: course.professorName || '',
            });
        }
    }, [course, isEdit]);

    // Handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // Validate form
    const validate = () => {
        const newErrors = {};
        if (!formData.courseCode.trim()) newErrors.courseCode = 'Course code is required';
        if (!formData.courseName.trim()) newErrors.courseName = 'Course name is required';
        if (!formData.credits) {
            newErrors.credits = 'Credits are required';
        } else if (isNaN(formData.credits) || parseInt(formData.credits) < 0) {
            newErrors.credits = 'Credits must be a positive number';
        }
        if (!formData.professorName.trim()) newErrors.professorName = 'Professor name is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit form
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);
            setError('');
            
            const data = {
                ...formData,
                credits: parseInt(formData.credits),
            };

            if (isEdit && course) {
                await courseAPI.update(course.id, data);
            } else {
                await courseAPI.create(data);
            }
            onSuccess();
        } catch (error) {
            console.error('Error saving course:', error);
            setError(error.response?.data?.message || 'Failed to save course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        name="courseCode"
                        label="Course Code"
                        value={formData.courseCode}
                        onChange={handleChange}
                        error={!!errors.courseCode}
                        helperText={errors.courseCode}
                        required
                        disabled={isEdit}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        name="courseName"
                        label="Course Name"
                        value={formData.courseName}
                        onChange={handleChange}
                        error={!!errors.courseName}
                        helperText={errors.courseName}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        name="credits"
                        label="Credits"
                        type="number"
                        value={formData.credits}
                        onChange={handleChange}
                        error={!!errors.credits}
                        helperText={errors.credits}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        name="professorName"
                        label="Professor Name"
                        value={formData.professorName}
                        onChange={handleChange}
                        error={!!errors.professorName}
                        helperText={errors.professorName}
                        required
                    />
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : (isEdit ? 'Update Course' : 'Save Course')}
                </Button>
            </Box>
        </Box>
    );
};

export default AddCourse;