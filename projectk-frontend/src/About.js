import React, { useEffect, useState } from 'react';
import instance from './axiosInstance'; // Import axiosInstance

// The About component now accepts a 'favoriteCharacter' prop
const About = ({ favoriteCharacter }) => {
    const [characterDetails, setCharacterDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCharacterDetails = async () => {
            if (!favoriteCharacter) {
                // If favoriteCharacter is not available (e.g., not logged in, or profile not loaded yet)
                setLoading(false);
                setError("No favorite character selected or profile not loaded.");
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // Construct the API URL using the favoriteCharacter prop
                const response = await instance.get(`/api/characters/${favoriteCharacter}`);
                setCharacterDetails(response.data);
                console.log("About page fetched character details:", response.data); // For debugging
            } catch (err) {
                console.error('Failed to fetch character details:', err);
                setError('Failed to load character details. Please try again later.');
                // Optionally handle 404 (character not found) differently
                if (err.response && err.response.status === 404) {
                    setError(`Details for '${favoriteCharacter}' not found.`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCharacterDetails();
    }, [favoriteCharacter]); // Re-run effect if favoriteCharacter prop changes

    if (loading) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>About Your Favorite Character</h2>
                <p>Loading character details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                <h2>About Your Favorite Character</h2>
                <p>Error: {error}</p>
                <p>Please ensure your favorite character is set and try refreshing the page.</p>
            </div>
        );
    }

    if (!characterDetails) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>About Your Favorite Character</h2>
                <p>No character details to display.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#A0522D', marginBottom: '15px' }}>About {characterDetails.name}</h2>
            <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#555', marginBottom: '10px' }}>History:</h3>
                <p style={{ lineHeight: '1.6' }}>{characterDetails.history}</p>

                <h3 style={{ color: '#555', marginTop: '20px', marginBottom: '10px' }}>Powers:</h3>
                <p style={{ lineHeight: '1.6' }}>{characterDetails.powers}</p>

                <h3 style={{ color: '#555', marginTop: '20px', marginBottom: '10px' }}>Role:</h3>
                <p style={{ lineHeight: '1.6' }}>{characterDetails.role}</p>
            </div>
        </div>
    );
};

export default About;