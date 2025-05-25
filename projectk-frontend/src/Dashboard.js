import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import instance from './axiosInstance';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Home from './Home';
import About from './About';
import Chronicles from './Chronicles';
import Profile from './Profile';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const [userProfile, setUserProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [profileError, setProfileError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoadingProfile(true);
            setProfileError('');
            try {
                const response = await instance.get('/api/profile');
                if (response.status === 200) {
                    setUserProfile(response.data);
                    console.log("Dashboard fetched user profile:", response.data);
                } else {
                    setProfileError("Failed to load profile data.");
                }
            } catch (err) {
                console.error('Failed to fetch user profile in Dashboard:', err);
                setProfileError('Failed to load user profile. Please check your network or login status.');
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const imageMap = {
        Kalki: "/images/KalkiImg.jpeg",
        Karna: "/images/KarnaImg.jpeg",
        Ashwatthama: "/images/AshwatthamaImg.jpeg",
        Parasuram: "/images/parushuramImg.jpeg"
    };

    const characterImage = userProfile && userProfile.favoriteCharacter
                           ? imageMap[userProfile.favoriteCharacter]
                           : null;

   const leftColumnImage = (location.pathname === '/dashboard/about' && characterImage)
                               ? characterImage
                               : (location.pathname === '/dashboard/chronicles'
                                  ? "/images/ChroniclesImg.webp" // Path to your Chronicles image
                                  : "/images/Logo3.jpeg"); // Default logo


    const handleLogoutClick = (e) => {
        e.preventDefault();
        setOpen(true);
    };

    const handleConfirmLogout = async () => {
        setOpen(false);
        try {
            await instance.post('/api/logout');
            localStorage.removeItem('user');
            navigate('/dashboard/logout');
        } catch (error) {
            console.error('Error during logout:', error);
            localStorage.removeItem('user');
            navigate('/dashboard/logout');
        }
    };

    const handleCancelLogout = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (location.pathname === '/dashboard/logout') {
            const timer = setTimeout(() => {
                window.location.href = 'http://localhost:8080/hello';
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [location]);

    return (
        // Outer container: ensures the whole layout takes at least full viewport height
        // and children (left and right columns) are laid out horizontally.
        <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}> {/* Added width: '100vw' for full page width */}

            {/* Left Column: Fixed width and height (to match viewport), and handles its own content overflow */}
            <div style={{
                width: '322px',
                height: '100vh', // *** KEY CHANGE: Fixes height to viewport height ***
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                // Removed justifyContent: 'stretch' - not needed if image is constrained
                overflow: 'hidden', // *** KEY CHANGE: Hides any content that overflows this column ***
                backgroundColor: '#f0f0f0',
                position: 'sticky', // Makes this column sticky at the top
                top: 0, // Sticks it to the top of the viewport
                alignSelf: 'flex-start', // Helps sticky work correctly within a flex container
            }}>
                {loadingProfile ? (
                    <div style={{ padding: '20px', textAlign: 'center', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p>Loading image...</p>
                    </div>
                ) : profileError ? (
                    <div style={{ padding: '20px', textAlign: 'center', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}>
                        <p>{profileError}</p>
                    </div>
                ) : (
                    <img
                        src={leftColumnImage}
                        alt={userProfile ? userProfile.favoriteCharacter : "Your Logo"}
                        style={{
                            width: '100%', // Fills the width of its parent (322px)
                            height: '100%', // Fills the height of its parent (100vh)
                            objectFit: 'cover', // *** IMPORTANT: Covers the area, maintaining aspect ratio and cropping if needed ***
                            // Removed flexGrow: 1 as the parent div now has a fixed height
                        }}
                    />
                )}
            </div>

            {/* Right Column: Takes remaining width, and is independently scrollable */}
            <div style={{
                flex: 1, // Allows it to take up the remaining horizontal space
                padding: '25px',
                height: '100vh', // *** KEY CHANGE: Ensures this column also takes full viewport height for scrolling ***
                display: 'flex',
                flexDirection: 'column', // Stacks navigation and routes vertically
                overflowY: 'auto', // *** KEY CHANGE: Enables vertical scrolling for this column if content overflows ***
            }}>
                {/* Navigation: Fixed at the top of the right column */}
                <nav style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    display: 'flex',
                    borderBottom: '1px solid #ddd',
                    position: 'sticky', // Makes the navigation bar sticky
                    top: 0, // Sticks it to the top of its scrolling container (the right column)
                    zIndex: 10, // Ensures it stays above other content when scrolling
                }}>
                    <ul style={{ listStyle: 'none', display: 'flex', margin: 0, padding: 0 }}>
                        <li style={{ margin: '0 25px' }}>
                            <Link to="/dashboard/home" style={{ textDecoration: 'none', color: location.pathname === '/dashboard/home' ? 'white' : '#333', padding: '8px 16px', borderRadius: '4px', backgroundColor: location.pathname === '/dashboard/home' ? '#A0522D' : 'transparent' }}>Home</Link>
                        </li>
                        <li style={{ margin: '0 25px' }}>
                            <Link to="/dashboard/about" style={{ textDecoration: 'none', color: location.pathname === '/dashboard/about' ? 'white' : '#333', padding: '8px 16px', borderRadius: '4px', backgroundColor: location.pathname === '/dashboard/about' ? '#A0522D' : 'transparent' }}>About</Link>
                        </li>
                        <li style={{ margin: '0 25px' }}>
                            <Link to="/dashboard/chronicles" style={{ textDecoration: 'none', color: location.pathname === '/dashboard/chronicles' ? 'white' : '#333', padding: '8px 16px', borderRadius: '4px', backgroundColor: location.pathname === '/dashboard/chronicles' ? '#A0522D' : 'transparent' }}>Chronicles</Link>
                        </li>
                        <li style={{ margin: '0 25px' }}>
                            <Link to="/dashboard/profile" style={{ textDecoration: 'none', color: location.pathname === '/dashboard/profile' ? 'white' : '#333', padding: '8px 16px', borderRadius: '4px', backgroundColor: location.pathname === '/dashboard/profile' ? '#A0522D' : 'transparent' }}>Profile</Link>
                        </li>
                        <li style={{ margin: '0 25px' }}>
                            <Link
                                to="/dashboard/logout"
                                onClick={handleLogoutClick}
                                style={{ textDecoration: 'none', color: location.pathname === '/dashboard/logout' ? 'white' : '#333', padding: '8px 16px', borderRadius: '4px', backgroundColor: location.pathname === '/dashboard/logout' ? '#A0522D' : 'transparent' }}
                            >
                                Logout
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Content Area for Routes */}
                <div style={{ flexGrow: 1, paddingTop: '15px' }}> {/* flexGrow: 1 ensures it takes available vertical space below nav */}
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/about" element={<About favoriteCharacter={userProfile?.favoriteCharacter} />} />
                        <Route path="/chronicles" element={<Chronicles />} />
                        <Route path="/profile" element={<Profile user={userProfile} />} />
                        <Route path="/logout" element={<div style={{ padding: '20px' }}>Logout Successful! Redirecting...</div>} />
                    </Routes>
                </div>

                {/* Custom Dialog */}
                <Dialog
                    open={open}
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
        </div>
    );
};

export default Dashboard;