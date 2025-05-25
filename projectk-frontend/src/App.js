// src/App.js (UPDATED with Admin Dashboard routes)
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// Your existing components
import Signup from './Signup';
import Login from './Login';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute'; // For regular user protection

// Admin specific components
import AdminLogin from './AdminLogin'; // Admin login page
import AdminProtectedRoute from './AdminProtectedRoute'; // NEW: Admin specific protection
import AdminDashboard from './AdminDashboard'; // NEW: Admin dashboard layout
import AdminHome from './AdminHome'; // NEW: Admin home page
import ManageUsers from './ManageUsers'; // NEW: Admin manage users page
import Analytics from './Analytics'; // NEW: Admin analytics page
import UsersFeedback from './UsersFeedback'; // NEW: Admin users feedback page

function AppContent() {
    const location = useLocation();

    useEffect(() => {
        // Initial redirection to backend's /hello page
        if (location.pathname === '/') {
            window.location.href = 'http://localhost:8080/hello';
        }
    }, [location]);

    // This standalone logout button was part of the previous App.js,
    // but with the admin dashboard now having its own logout, and regular users
    // having logout on their dashboard, this can typically be removed unless
    // you want a general logout visible on all non-dashboard pages.
    // Given the current structure, I've kept it minimal in the App.js to avoid clutter.
    // The logout button is now primarily within AdminDashboard and user Dashboard.

    return (
        <div style={{ padding: '0px' }}> {/* Removed padding here, as Dashboard/AdminDashboard will control their own padding */}

            <Routes>
                {/* Public routes (no direct element for '/', as it redirects) */}
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin-login" element={<AdminLogin />} />

                {/* Protected routes for regular users */}
                <Route
                    path="/dashboard/*" // Use /* for nested routes within Dashboard
                    element={
                        <ProtectedRoute>
                            <Dashboard /> {/* Your existing user Dashboard component */}
                        </ProtectedRoute>
                    }
                />
                <Route // Example of another protected user route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            {/* Placeholder for Profile component */}
                            <h2>User Profile (Protected)</h2>
                        </ProtectedRoute>
                    }
                />

                {/* NEW: Protected routes for Admin */}
                <Route
                    path="/admin/dashboard/*" // Use /* for nested routes within AdminDashboard
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboard /> {/* The main admin layout */}
                        </AdminProtectedRoute>
                    }
                >
                    {/* Nested Admin Routes */}
                    <Route index element={<AdminHome />} /> {/* Renders AdminHome at /admin/dashboard */}
                    <Route path="home" element={<AdminHome />} />
                    <Route path="users" element={<ManageUsers />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="feedback" element={<UsersFeedback />} />
                    {/* The logout action is handled by the button within AdminDashboard */}
                </Route>

                {/* Add a catch-all route for 404 if needed */}
                <Route path="*" element={<h2>404 - Page Not Found (Frontend)</h2>} />
            </Routes>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}