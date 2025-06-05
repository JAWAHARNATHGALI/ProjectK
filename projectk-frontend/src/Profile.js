import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from './axiosInstance';
import { useNavigate } from 'react-router-dom';

// Material-UI Imports
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Profile = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [profileUser, setProfileUser] = useState(user);
    const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
    const [rating, setRating] = useState(3);
    const [feedbackContent, setFeedbackContent] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [updateEmail, setUpdateEmail] = useState('');
    const [updateFavoriteCharacter, setUpdateFavoriteCharacter] = useState('');

    useEffect(() => {
        if (user) {
            setProfileUser(user);
        }
    }, [user]);

    const fetchProfileData = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/api/profile');
            setProfileUser(response.data);
            if (setUser) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem('user');
                navigate('/login');
            }
            setSnackbarMessage('Failed to load profile data.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    }, [navigate, setUser]);

    useEffect(() => {
        if (!user && localStorage.getItem('user')) {
            fetchProfileData();
        }
    }, [user, fetchProfileData]);

    const handleOpenFeedbackDialog = () => {
        setOpenFeedbackDialog(true);
    };

    const handleCloseFeedbackDialog = () => {
        setOpenFeedbackDialog(false);
        setRating(3);
        setFeedbackContent('');
    };

    const handleSubmitFeedback = async () => {
        try {
            await axiosInstance.post('/api/user/feedback', {
                rating,
                feedback: feedbackContent,
            });
            setSnackbarMessage('Feedback submitted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleCloseFeedbackDialog();
        } catch (error) {
            const errorMessage = error.response?.data || 'Failed to submit feedback.';
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    const handleOpenUpdateDialog = () => {
        if (profileUser) {
            setUpdateEmail(profileUser.email || '');
            setUpdateFavoriteCharacter(profileUser.favoriteCharacter || '');
        }
        setOpenUpdateDialog(true);
    };

    const handleSubmitUpdate = async () => {
        try {
            await axiosInstance.put('/api/profile', {
                email: updateEmail,
                favoriteCharacter: updateFavoriteCharacter
            });
            setSnackbarMessage('Profile updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setOpenUpdateDialog(false);
            fetchProfileData();
        } catch (error) {
            setSnackbarMessage('Failed to update profile.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    return (
        <div style={{ padding: '20px', position: 'relative' }}>
            <h2 style={{ color: '#A0522D', marginBottom: '15px' }}>User Profile</h2>
            {profileUser ? (
                <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <p><strong>Name:</strong> {profileUser.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {profileUser.email || 'N/A'}</p>
                    <p><strong>Favorite Character:</strong> {profileUser.favoriteCharacter || 'N/A'}</p>
                </div>
            ) : (
                <p style={{ color: 'red' }}>No profile information available. Please log in.</p>
            )}

            <Button
                variant="contained"
                sx={{
                    backgroundColor: '#A0522D',
                    '&:hover': { backgroundColor: '#8B4513' },
                    position: 'absolute',
                    top: '20px',
                    right: '20px'
                }}
                onClick={handleOpenFeedbackDialog}
            >
                Give Feedback
            </Button>

            <Button
                variant="contained"
                sx={{
                    backgroundColor: '#A0522D',
                    '&:hover': { backgroundColor: '#8B4513' },
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px'
                }}
                onClick={handleOpenUpdateDialog}
            >
                Update Profile
            </Button>

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
                            onChange={(event, newValue) => setRating(newValue)}
                            precision={1}
                            size="large"
                        />
                    </Box>
                    <TextField
                        autoFocus
                        margin="dense"
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

            <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
                <DialogTitle sx={{ backgroundColor: '#A0522D', color: 'white' }}>Update Profile</DialogTitle>
                <DialogContent sx={{ px: 4, pt: 3, pb: 2 }}> {/* More spacing above */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            value={updateEmail}
                            onChange={(e) => setUpdateEmail(e.target.value)}
                        />
                        <TextField
                            select
                            label="Favorite Character"
                            fullWidth
                            value={updateFavoriteCharacter}
                            onChange={(e) => setUpdateFavoriteCharacter(e.target.value)}
                        >
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="Kalki">Kalki</MenuItem>
                            <MenuItem value="Karna">Karna</MenuItem>
                            <MenuItem value="Ashwatthama">Ashwatthama</MenuItem>
                            <MenuItem value="Parasuram">Parasuram</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUpdateDialog(false)} sx={{ color: '#A0522D' }}>Cancel</Button>
                    <Button onClick={handleSubmitUpdate} variant="contained" sx={{ backgroundColor: '#A0522D', '&:hover': { backgroundColor: '#8B4513' } }}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Profile;
