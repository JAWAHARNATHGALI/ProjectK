// src/components/AdminLogin.js (UPDATED with Login.js styling)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css'; // Import the shared CSS file

const AdminLogin = () => {
    const [formData, setFormData] = useState({ username: '', password: '' }); // Using 'username' for consistency with backend
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages
        try {
            const response = await axios.post('http://localhost:8080/api/adminLogin', {
                username: formData.username, // Use formData.username
                password: formData.password
            });

            const { token, isAdmin, message: responseMessage } = response.data; // Renamed message to responseMessage to avoid conflict

            if (token && isAdmin) {
                localStorage.setItem('adminToken', token);
                localStorage.setItem('isAdmin', 'true');
                setMessage('Admin login successful!');
                navigate('/admin/dashboard');
                window.location.reload(); // Force a reload to pick up auth changes
            } else {
                setMessage(responseMessage || 'Login failed. Please check credentials.');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setMessage(error.response.data.message || 'An error occurred during login.');
            } else {
                setMessage('Network error or unexpected issue. Please try again.');
                console.error('Admin Login Error:', error);
            }
        }
    };

    return (
        <div className="signup-container"> {/* Applying the same container class */}
            <form onSubmit={handleLogin}>
                <h2>Admin Login</h2>
                {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
                <div>
                    <label>Username:</label> {/* Changed label from Email to Username for clarity */}
                    <input type="email" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Login as Admin</button>
            </form>
        </div>
    );
};

export default AdminLogin;