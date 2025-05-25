// src/AdminProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
    const adminToken = localStorage.getItem('adminToken');
    const isAdmin = localStorage.getItem('isAdmin') === 'true'; // Check if the flag is true

    if (!adminToken || !isAdmin) {
        // If no admin token or not marked as admin, redirect to admin login page
        return <Navigate to="/admin-login" replace />;
    }

    return children; // Render the protected component
};

export default AdminProtectedRoute;