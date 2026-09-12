/**
 * API Service Layer
 * Handles all HTTP requests to the Spring Boot backend
 * Base URL: http://localhost:8080/api
 */

import axios from 'axios';

// Base URL for all API calls
const API_BASE_URL = "https://studentrecordmanagementsystem.onrender.com/api/"   //'http://localhost:8080/api';

// Create axios instance with default configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============================================
// STUDENT API ENDPOINTS
// ============================================
export const studentAPI = {
    getAll: () => api.get('/students'),
    getById: (id) => api.get(`/students/${id}`),
    create: (data) => api.post('/students', data),
    update: (id, data) => api.put(`/students/${id}`, data),
    delete: (id) => api.delete(`/students/${id}`),
};

// ============================================
// COURSE API ENDPOINTS
// ============================================
export const courseAPI = {
    getAll: () => api.get('/courses'),
    getById: (id) => api.get(`/courses/${id}`),
    create: (data) => api.post('/courses', data),
    update: (id, data) => api.put(`/courses/${id}`, data),
    delete: (id) => api.delete(`/courses/${id}`),
};

// ============================================
// ENROLLMENT API ENDPOINTS
// ============================================
export const enrollmentAPI = {
    // ✅ GET ALL ENROLLMENTS
    getAll: () => api.get('/enrollments'),
    
    // ✅ ENROLL STUDENT
    enroll: (data) => api.post('/enrollments', data),
    
    // Get enrollments by student ID
    getByStudent: (studentId) => api.get(`/enrollments/student/${studentId}`),
    
    // Get enrollments by course ID
    getByCourse: (courseId) => api.get(`/enrollments/course/${courseId}`),
    
    // Get enrollment by ID
    getById: (id) => api.get(`/enrollments/${id}`),
    
    // Delete enrollment
    delete: (id) => api.delete(`/enrollments/${id}`),
};

// ============================================
// ATTENDANCE API ENDPOINTS
// ============================================
export const attendanceAPI = {
    mark: (enrollmentId, status) => 
        api.post(`/attendance/mark/${enrollmentId}?status=${status}`),
    getByStudent: (studentId) => api.get(`/attendance/student/${studentId}`),
    getPercentage: (studentId) => api.get(`/attendance/percentage/${studentId}`),
};

// ============================================
// FEE API ENDPOINTS
// ============================================
export const feeAPI = {
    create: (data) => api.post('/fees', data),
    pay: (feeId, amount) => api.put(`/fees/pay/${feeId}?amount=${amount}`),
    getByStudent: (studentId) => api.get(`/fees/student/${studentId}`),
    getUnpaid: () => api.get('/fees/unpaid'),
    getPartial: () => api.get('/fees/partial'),
    checkStatus: (studentId) => api.get(`/fees/check/${studentId}`),
    getAll: () => api.get('/fees'),
    delete: (id) => api.delete(`/fees/${id}`),
};

export default api;