// src/AdminDashboard.js (UPDATED: Theme colors)
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const handleLogoutClick = (e) => {
        e.preventDefault();
        setOpenLogoutDialog(true);
    };

    const handleConfirmLogout = () => {
        setOpenLogoutDialog(false);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdmin');
        navigate('/admin-login');
        window.location.reload();
    };

    const handleCancelLogout = () => {
        setOpenLogoutDialog(false);
    };

    // Define style for active NavLink
    const activeLinkStyle = {
        backgroundColor: '#A0522D', // Sienna - Main theme color for active state
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '4px', // Slightly smaller border-radius to match user dashboard links
    };

    return (
        <div style={dashboardContainerStyle}>
            {/* Sidebar Navigation */}
            <div style={sidebarStyle}>
                <h3 style={{ color: 'white', padding: '20px', textAlign: 'center', borderBottom: '1px solid #7a3f24' }}>Admin Panel</h3> {/* Darker shade of theme color */}
                <nav>
                    <ul style={navListStyle}>
                        <li style={navItemStyle}>
                            <NavLink
                                to="/admin/dashboard/home"
                                style={({ isActive }) => ({
                                    ...navLinkStyle,
                                    ...(isActive ? activeLinkStyle : {})
                                })}
                            >
                                Home
                            </NavLink>
                        </li>
                        <li style={navItemStyle}>
                            <NavLink
                                to="/admin/dashboard/users"
                                style={({ isActive }) => ({
                                    ...navLinkStyle,
                                    ...(isActive ? activeLinkStyle : {})
                                })}
                            >
                                Manage Users
                            </NavLink>
                        </li>
                        <li style={navItemStyle}>
                            <NavLink
                                to="/admin/dashboard/analytics"
                                style={({ isActive }) => ({
                                    ...navLinkStyle,
                                    ...(isActive ? activeLinkStyle : {})
                                })}
                            >
                                Analytics
                            </NavLink>
                        </li>
                        <li style={navItemStyle}>
                            <NavLink
                                to="/admin/dashboard/feedback"
                                style={({ isActive }) => ({
                                    ...navLinkStyle,
                                    ...(isActive ? activeLinkStyle : {})
                                })}
                            >
                                Users Feedback
                            </NavLink>
                        </li>
                        <li style={navItemStyle}>
                            <button onClick={handleLogoutClick} style={logoutButtonStyle}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content Area */}
            <div style={contentStyle}>
                <Outlet />
            </div>

            {/* Logout Confirmation Dialog */}
            <Dialog
                open={openLogoutDialog}
                onClose={handleCancelLogout}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
            >
                <DialogTitle id="logout-dialog-title" sx={{ backgroundColor: '#A0522D', color: 'white' }}>
                    Logout of your account?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="logout-dialog-description">
                        Are you sure you want to logout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelLogout} sx={{ color: '#A0522D' }}>
                        CANCEL
                    </Button>
                    <Button onClick={handleConfirmLogout} sx={{ color: '#A0522D' }} autoFocus>
                        LOGOUT
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

// Basic inline styles for the dashboard layout (consider moving to CSS file later for more complex styling)
const dashboardContainerStyle = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f4f4f4', // Keeping main background light
};

const sidebarStyle = {
    width: '250px',
    backgroundColor: '#3b3b3b', // A dark grey, or consider a darker brown if desired, e.g., #5C4033
    padding: '20px 0',
    boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
    flexShrink: 0,
};

const navListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
};

const navItemStyle = {
    marginBottom: '5px',
};

const navLinkStyle = {
    display: 'block',
    color: '#ccc', // Lighter grey for inactive text
    textDecoration: 'none',
    padding: '10px 20px',
    transition: 'background-color 0.3s ease, color 0.3s ease, font-weight 0.3s ease',
    borderRadius: '4px', // Consistent border radius
    margin: '0 10px',
};

const logoutButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#ccc', // Lighter grey to match inactive nav links
    padding: '10px 20px',
    fontSize: '1em',
    cursor: 'pointer',
    width: 'calc(100% - 20px)',
    textAlign: 'left',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    margin: '10px 10px',
    borderRadius: '4px',
};

const contentStyle = {
    flexGrow: 1,
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    margin: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
};

export default AdminDashboard;