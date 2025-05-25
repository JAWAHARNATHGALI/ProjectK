// src/UsersFeedback.js (NEW FILE: Admin's Feedback View)
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios'; // Use plain axios for admin API calls
import { useNavigate } from 'react-router-dom';

// Material-UI Components for Loading Indicator and Snackbar
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// Helper for Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UsersFeedback = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // Default to error for feedback page

    // Function to fetch feedback, wrapped in useCallback for useEffect dependency
    const fetchFeedback = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) {
                navigate('/admin-login');
                return;
            }

            const response = await axios.get('http://localhost:8080/api/admin/feedback', {
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            });
            setFeedbackList(response.data);
        } catch (err) {
            console.error('Failed to fetch feedback:', err);
            const errorMessage = err.response && err.response.data ? err.response.data : 'Failed to load feedback data.';
            setError(errorMessage);
            setSnackbarMessage(errorMessage + " Please ensure you are logged in as admin and have valid permissions.");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);

            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('isAdmin');
                navigate('/admin-login');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchFeedback();
    }, [fetchFeedback]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <div>
            <h2>Users Feedback</h2>
            <p>This page displays feedback submitted by users.</p>
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <CircularProgress sx={{ color: '#A0522D' }} />
                </div>
            ) : feedbackList.length === 0 ? (
                <p>No user feedback found yet.</p>
            ) : (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>User Name</th>
                            <th style={thStyle}>User Email</th>
                            <th style={thStyle}>Rating (1-5)</th>
                            <th style={thStyle}>Feedback</th>
                            <th style={thStyle}>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbackList.map((feedback) => (
                            <tr key={feedback.id} style={trStyle}>
                                <td style={tdStyle}>{feedback.id}</td>
                                <td style={tdStyle}>{feedback.userName || 'N/A'}</td>
                                <td style={tdStyle}>{feedback.userEmail}</td>
                                <td style={tdStyle}>{feedback.rating}</td>
                                <td style={tdStyle}>{feedback.feedbackContent}</td>
                                <td style={tdStyle}>
                                    {feedback.timestamp ? new Date(feedback.timestamp).toLocaleString() : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

// Reusing some styles from ManageUsers.js for consistency
const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
};

const thStyle = {
    border: '1px solid #ddd',
    padding: '12px 8px',
    textAlign: 'left',
    backgroundColor: '#A0522D',
    color: 'white',
    fontWeight: 'bold',
};

const tdStyle = {
    border: '1px solid #eee',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: 'white',
    verticalAlign: 'top', // Align content to top for longer feedback
};

const trStyle = {
    // You can add :nth-child(even) or :hover styles in a CSS file
};

export default UsersFeedback;