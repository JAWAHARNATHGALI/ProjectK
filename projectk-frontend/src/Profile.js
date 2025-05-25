// src/Profile.js (UPDATED: Adds Feedback Button and Dialog)
import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance'; // Assuming this is your configured axios instance
import { useNavigate } from 'react-router-dom';

// Material-UI Imports for the Dialog and Rating
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating'; // For star rating
import Typography from '@mui/material/Typography'; // For rating label
import Box from '@mui/material/Box'; // For layout within dialog
import Snackbar from '@mui/material/Snackbar'; // For success/error messages
import MuiAlert from '@mui/material/Alert'; // For Snackbar content

// Helper for Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Profile = ({ user, setUser }) => { // Added setUser prop to potentially update user state
    const navigate = useNavigate();
    const [profileUser, setProfileUser] = useState(user); // Use state to manage user data internally
    const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
    const [rating, setRating] = useState(3); // Default rating
    const [feedbackContent, setFeedbackContent] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Effect to update internal profileUser state if 'user' prop changes (e.g., after login/refresh)
    useEffect(() => {
        if (user) {
            setProfileUser(user);
        }
    }, [user]);

    // Function to fetch profile data (similar to how Dashboard fetches it)
    const fetchProfileData = async () => {
        try {
            const response = await axiosInstance.get('/api/profile');
            setProfileUser(response.data);
            if (setUser) { // If setUser prop is provided, update the parent state
                setUser(response.data);
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            // Handle token expiration/invalid token (e.g., if token in localStorage is old)
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem('user'); // Clear invalid token
                navigate('/login'); // Redirect to login page
            }
            setSnackbarMessage('Failed to load profile data.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        // If user prop is not immediately available (e.g., on direct page load), fetch it
        if (!user && localStorage.getItem('user')) {
            fetchProfileData();
        }
    }, [user]); // Depend on 'user' prop

    const handleOpenFeedbackDialog = () => {
        setOpenFeedbackDialog(true);
    };

    const handleCloseFeedbackDialog = () => {
        setOpenFeedbackDialog(false);
        setRating(3); // Reset rating
        setFeedbackContent(''); // Reset feedback content
    };

    const handleSubmitFeedback = async () => {
        try {
            const response = await axiosInstance.post('/api/user/feedback', {
                rating: rating,
                feedback: feedbackContent,
            });
            console.log('Feedback submitted:', response.data);
            setSnackbarMessage('Feedback submitted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleCloseFeedbackDialog(); // Close dialog on success
        } catch (error) {
            console.error('Error submitting feedback:', error.response ? error.response.data : error.message);
            const errorMessage = error.response && error.response.data ? error.response.data : 'Failed to submit feedback.';
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <div style={{ padding: '20px', position: 'relative' }}> {/* Added relative positioning */}
            <h2 style={{ color: '#A0522D', marginBottom: '15px' }}>User Profile</h2>
            {profileUser ? (
                <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <p style={{ lineHeight: '1.6', marginBottom: '10px' }}>
                        <strong>Name:</strong> {profileUser.name || 'N/A'}
                    </p>
                    <p style={{ lineHeight: '1.6', marginBottom: '10px' }}>
                        <strong>Email:</strong> {profileUser.email || 'N/A'}
                    </p>
                    <p style={{ lineHeight: '1.6', marginBottom: '10px' }}>
                        <strong>Favorite Character:</strong> {profileUser.favoriteCharacter || 'N/A'}
                    </p>
                    {/* Add more profile information as needed */}
                </div>
            ) : (
                <p style={{ color: 'red' }}>No profile information available. Please log in.</p>
            )}

            {/* Feedback Button - Positioned in the rightmost corner */}
            <Button
                variant="contained"
                sx={{
                    backgroundColor: '#A0522D',
                    '&:hover': {
                        backgroundColor: '#8B4513',
                    },
                    position: 'absolute', // Absolute positioning
                    top: '20px', // Adjust as needed
                    right: '20px', // Rightmost corner
                }}
                onClick={handleOpenFeedbackDialog}
            >
                Give Feedback
            </Button>

            {/* Feedback Dialog */}
            <Dialog open={openFeedbackDialog} onClose={handleCloseFeedbackDialog}>
                <DialogTitle sx={{ backgroundColor: '#A0522D', color: 'white' }}>Give Us Your Feedback</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ marginTop: '10px' }}>
                        We appreciate your thoughts! Please rate our application and share your feedback.
                    </DialogContentText>
                    <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
                        <Typography component="legend">Rate our application:</Typography>
                        <Rating
                            name="feedback-rating"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                            precision={1} // Allow integer ratings (1, 2, 3, 4, 5)
                            size="large"
                        />
                    </Box>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="feedback"
                        label="Your Feedback"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={feedbackContent}
                        onChange={(e) => setFeedbackContent(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFeedbackDialog} sx={{ color: '#A0522D' }}>Cancel</Button>
                    <Button onClick={handleSubmitFeedback} variant="contained" sx={{ backgroundColor: '#A0522D', '&:hover': { backgroundColor: '#8B4513' } }}>Submit</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for messages */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Profile;