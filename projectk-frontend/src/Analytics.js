// src/Analytics.js (UPDATED: Character Throne Leaderboard with Tie Handling)
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'; // For the table container

// Helper for Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Map character names to their image paths (relative to public folder)
// IMPORTANT: These paths assume images are in your public/images/ directory
// and that the filenames match EXACTLY (including casing)
const CHARACTER_IMAGES = {
    "Kalki": "/images/KalkiImg.jpeg",
    "Karna": "/images/KarnaImg.jpeg",
    "Ashwatthama": "/images/AshwatthamaImg.jpeg",
    "Parasuram": "/images/parushuramImg.jpeg",
    // Add more characters here if needed, with their respective image paths
};

const Analytics = () => {
    const [rankedCharacters, setRankedCharacters] = useState([]); // Now stores characters with their calculated rank
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');

    const fetchCharacterAnalytics = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) {
                navigate('/admin-login');
                return;
            }

            const response = await axios.get('http://localhost:8080/api/admin/analytics/favorite-characters', {
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            });

            // 1. Filter out characters without images
            const validCharacters = response.data.filter(c => c.characterName && CHARACTER_IMAGES[c.characterName]);

            // 2. Sort by count descending
            validCharacters.sort((a, b) => b.count - a.count);

            // 3. Assign ranks, handling ties
            let currentRank = 1;
            let previousCount = -1; // Initialize with a value lower than any possible count

            const charactersWithRank = validCharacters.map((char, index) => {
                if (char.count !== previousCount) {
                    currentRank = index + 1; // Assign new rank if count changes
                }
                previousCount = char.count; // Update previous count for next iteration
                return { ...char, rank: currentRank };
            });

            setRankedCharacters(charactersWithRank); // Store all ranked characters
        } catch (err) {
            console.error('Failed to fetch character analytics:', err);
            const errorMessage = err.response && err.response.data ? err.response.data : 'Failed to load character analytics.';
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
        fetchCharacterAnalytics();
    }, [fetchCharacterAnalytics]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    // Pedestal heights (adjust as desired) - based on true rank
    const pedestalHeights = {
        1: 250, // 1st place (tallest)
        2: 200, // 2nd place
        3: 150, // 3rd place
        4: 100, // 4th place
    };

    const pedestalColors = {
        1: '#FFD700', // Gold
        2: '#C0C0C0', // Silver
        3: '#CD7F32', // Bronze
        4: '#A9A9A9', // DarkGray for 4th
    };

    // Define the visual order for the pedestals
    // This maps the character's *rank* to a flexbox 'order' property for visual layout
    const getPodiumVisualOrder = (characterRank, numCharactersOnPodium) => {
        if (numCharactersOnPodium === 1) return 0; // Center if only one
        if (numCharactersOnPodium === 2) {
            // If only two, assume rank 1 and rank 2
            if (characterRank === 1) return 1; // 1st visually to the right
            if (characterRank === 2) return 0; // 2nd visually to the left
        }
        if (numCharactersOnPodium === 3) {
            if (characterRank === 1) return 1; // 1st visually to the center
            if (characterRank === 2) return 0; // 2nd visually to the left
            if (characterRank === 3) return 2; // 3rd visually to the right
        }
        if (numCharactersOnPodium >= 4) {
            if (characterRank === 1) return 1; // 1st visually to the center
            if (characterRank === 2) return 0; // 2nd visually to the left
            if (characterRank === 3) return 2; // 3rd visually to the right
            if (characterRank === 4) return 3; // 4th visually to the far right
        }
        return characterRank; // Fallback: use rank directly for order (might not be ideal visually)
    };


    // Characters to display on pedestals (top 4 actual ranks, even if ties push past 4 unique characters)
    const charactersForPodium = rankedCharacters.filter(char => char.rank <= 4);

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#A0522D', marginBottom: '30px' }}>
                Character Throne Leaderboard
            </Typography>

            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress sx={{ color: '#A0522D' }} />
                </Box>
            ) : rankedCharacters.length === 0 ? (
                <Typography variant="h6" color="textSecondary">
                    No character data available yet. Users need to select their favorite characters.
                </Typography>
            ) : (
                <>
                    <Box sx={pedestalContainerStyle}>
                        {/* Render pedestals dynamically based on fetched data */}
                        {charactersForPodium.map((characterData) => {
                            const currentRank = characterData.rank;
                            // Use a fixed array to determine the number of distinct ranks on podium (1, 2, 3, 4)
                            // This ensures consistent visual ordering for the podium, even if ranks are tied.
                            const numDistinctRanksOnPodium = [...new Set(charactersForPodium.map(c => c.rank))].length;
                            const flexOrder = getPodiumVisualOrder(currentRank, numDistinctRanksOnPodium);

                            const height = pedestalHeights[currentRank] || pedestalHeights[4]; // Default to 4th if rank > 4
                            const bgColor = pedestalColors[currentRank] || pedestalColors[4];
                            const isTopCharacter = currentRank === 1;

                            return (
                                <Box
                                    key={characterData.characterName}
                                    sx={{
                                        ...pedestalStyle,
                                        height: `${height}px`,
                                        backgroundColor: bgColor,
                                        order: flexOrder, // Use order to control flexbox positioning
                                        position: 'relative',
                                        transform: isTopCharacter ? 'translateY(-10px)' : 'none',
                                        transition: 'transform 0.3s ease-out',
                                        ...(isTopCharacter && {
                                            boxShadow: `0 0 15px 5px ${pedestalColors[1]}`,
                                            animation: 'pulse 1.5s infinite alternate',
                                        }),
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <Box sx={characterImageContainerStyle}>
                                        <img
                                            src={CHARACTER_IMAGES[characterData.characterName]}
                                            alt={characterData.characterName}
                                            style={characterImageStyle}
                                        />
                                        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', mt: 1 }}>
                                            {characterData.characterName}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            ({characterData.count} choices)
                                        </Typography>
                                        {currentRank === 1 && (
                                            <Typography variant="body1" component="div" sx={{ mt: 1, color: 'gold', fontWeight: 'bold' }}>
                                                #1 Most Chosen!
                                            </Typography>
                                        )}
                                        {currentRank > 1 && (
                                            <Typography variant="body1" component="div" sx={{ mt: 1, color: 'gray', fontWeight: 'bold' }}>
                                                Rank #{currentRank}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Display all characters in a table below the podium */}
                    <Box sx={{ mt: 5, p: 2, borderTop: '1px solid #eee' }}>
                        <Typography variant="h5" sx={{ color: '#A0522D', marginBottom: '20px' }}>
                            All Character Popularity
                        </Typography>
                        <TableContainer component={Paper} sx={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                            <Table sx={{ minWidth: 650 }} aria-label="character popularity table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#A0522D' }}>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rank</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Character</TableCell>
                                        <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Choices</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rankedCharacters.map((char) => (
                                        <TableRow
                                            key={char.characterName}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {char.rank}
                                            </TableCell>
                                            <TableCell>{char.characterName}</TableCell>
                                            <TableCell align="right">{char.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </>
            )}

            {/* Keyframes for the pulse animation */}
            <style jsx>{`
                @keyframes pulse {
                    0% { transform: scale(1) translateY(-10px); box-shadow: 0 0 15px 5px #FFD700; }
                    100% { transform: scale(1.03) translateY(-12px); box-shadow: 0 0 25px 8px #FFD700; }
                }
            `}</style>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

// Styling for the pedestal view
const pedestalContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '400px',
    gap: '20px',
    marginTop: '50px',
    position: 'relative',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
};

const pedestalStyle = {
    width: '120px',
    backgroundColor: '#ccc',
    borderRadius: '8px 8px 0 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    border: '1px solid #aaa',
};

const characterImageContainerStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '10px',
};

const characterImageStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    marginBottom: '5px',
    zIndex: 1,
};

export default Analytics;