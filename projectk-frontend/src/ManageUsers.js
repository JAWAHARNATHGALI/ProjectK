// src/ManageUsers.js (FINALIZED: No 'Role' column, Admin user hidden, with delete and confirmation)
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa'; // Import the trash icon

// Material-UI Components for Dialog and Loading Indicator
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // State for delete confirmation dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null); // Stores the user object to be deleted

    // Define the admin's email for frontend logic (to hide admin from list)
    const ADMIN_EMAIL = "admin@gmail.com";

    // Function to fetch users, wrapped in useCallback for useEffect dependency
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(''); // Clear previous errors
        try {
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) {
                // If no admin token, redirect to admin login
                navigate('/admin-login');
                return; // Stop execution
            }

            // Make the API call to fetch users
            const response = await axios.get('http://localhost:8080/api/admin/users', {
                headers: {
                    Authorization: `Bearer ${adminToken}` // Attach the admin token
                }
            });
            // Filter out the admin user *after* fetching from the backend but *before* setting state
            const filteredUsers = response.data.filter(user => user.email !== ADMIN_EMAIL);
            setUsers(filteredUsers); // Set the fetched and filtered users to state
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to load user data. Please ensure you are logged in as admin and have valid permissions.');
            // Handle token expiration or invalid token: redirect to login
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem('adminToken'); // Clear invalid token
                localStorage.removeItem('isAdmin'); // Clear admin status
                navigate('/admin-login'); // Redirect to login
            }
        } finally {
            setLoading(false); // End loading regardless of success or failure
        }
    }, [navigate]); // navigate is a stable dependency for useCallback

    // useEffect to fetch users when the component mounts
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]); // fetchUsers is a dependency because it's wrapped in useCallback

    // Handles click on the delete icon
    const handleDeleteClick = (user) => {
        setUserToDelete(user); // Store the user to be deleted
        setOpenDeleteDialog(true); // Open the confirmation dialog
    };

    // Handles confirmation of delete from the dialog
    const handleConfirmDelete = async () => {
        setOpenDeleteDialog(false); // Close the dialog
        if (!userToDelete) return; // Should not happen if dialog was open

        try {
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) {
                navigate('/admin-login');
                return;
            }

            // Make the API call to delete the user
            const response = await axios.delete(`http://localhost:8080/api/admin/users/${userToDelete.id}`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            });
            console.log(response.data); // Log success message
            fetchUsers(); // Re-fetch the user list to update the UI (this will also re-apply the filter)
            setUserToDelete(null); // Clear the user to delete
        } catch (err) {
            console.error('Failed to delete user:', err);
            // Display specific error message for forbidden actions (like deleting admin, though admin won't be in this list)
            if (err.response && err.response.status === 403) {
                setError(`Error: ${err.response.data || "You don't have permission to perform this action."}`);
            } else if (err.response && err.response.data) {
                setError(`Failed to delete user: ${err.response.data}`);
            } else {
                setError(`Failed to delete user: ${err.message}`);
            }

            // If token is invalid or unauthorized, redirect to login
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('isAdmin');
                navigate('/admin-login');
            }
        }
    };

    // Handles cancellation of delete from the dialog
    const handleCancelDelete = () => {
        setOpenDeleteDialog(false); // Close the dialog
        setUserToDelete(null); // Clear the user to delete
    };

    return (
        <div>
            <h2>Manage Users</h2>
            <p>This page will allow you to view, edit, and manage user accounts.</p>
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>} {/* Display error messages */}

            {loading ? (
                // Show loading spinner while fetching data
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <CircularProgress sx={{ color: '#A0522D' }} />
                </div>
            ) : users.length === 0 ? (
                // Message if no other users are found (meaning only admin exists or no users were added)
                <p>No other users found.</p>
            ) : (
                // Display the table if filtered users exist
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Gender</th>
                            <th style={thStyle}>Favorite Character</th>
                            <th style={thStyle}>Actions</th> {/* Actions column for delete button */}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={trStyle}>
                                <td style={tdStyle}>{user.id}</td>
                                <td style={tdStyle}>{user.name || 'N/A'}</td> {/* Display N/A if name is null */}
                                <td style={tdStyle}>{user.email}</td>
                                <td style={tdStyle}>{user.gender || 'N/A'}</td> {/* Display N/A if gender is null */}
                                <td style={tdStyle}>{user.favoriteCharacter || 'N/A'}</td> {/* Display N/A if favoriteCharacter is null */}
                                <td style={tdStyle}>
                                    {/* Delete Button - now, since admin is filtered out, all visible users are deletable */}
                                    <button
                                        onClick={() => handleDeleteClick(user)}
                                        style={deleteButtonStyle}
                                        title="Delete User"
                                    >
                                        <FaTrashAlt /> {/* Trash icon */}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Delete Confirmation Dialog (Material-UI Dialog) */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCancelDelete}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title" sx={{ backgroundColor: '#A0522D', color: 'white' }}>
                    Confirm User Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete user "{userToDelete?.name || userToDelete?.email}"?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} sx={{ color: '#A0522D' }}>
                        CANCEL
                    </Button>
                    <Button onClick={handleConfirmDelete} sx={{ color: 'red' }} autoFocus>
                        DELETE
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

// Basic inline styles for the table (can be moved to a CSS file for better practice)
const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)', // Subtle shadow
    borderRadius: '8px', // Rounded corners
    overflow: 'hidden', // Ensures rounded corners are applied to content
};

const thStyle = {
    border: '1px solid #ddd',
    padding: '12px 8px',
    textAlign: 'left',
    backgroundColor: '#A0522D', // Theme color for header
    color: 'white',
    fontWeight: 'bold',
};

const tdStyle = {
    border: '1px solid #eee', // Lighter border for cells
    padding: '8px',
    textAlign: 'left',
    backgroundColor: 'white',
};

// Note: For :nth-child(even) and :hover effects, it's best to use a separate CSS file.
const trStyle = {
    // Example for CSS:
    // '&:nth-child(even)': {
    //     backgroundColor: '#f2f2f2',
    // },
    // '&:hover': {
    //     backgroundColor: '#f5f5f5',
    // },
};

const deleteButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#dc3545', // Red color for delete
    cursor: 'pointer',
    fontSize: '1.4em', // Larger icon
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease', // Smooth transition on hover
};

export default ManageUsers;