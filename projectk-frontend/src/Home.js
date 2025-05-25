import React, { useEffect, useState } from 'react';
import axios from './axiosInstance'; // Ensure this path is correct

const Home = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/profile');
        console.log('✅ User profile fetched:', response.data);
        setUser(response.data);
      } catch (error) {
        console.error('❌ Failed to fetch user profile:', error.response?.data || error.message);
        setError('Failed to load user data. Please try logging in again.');
      }
    };

    fetchUser();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#A0522D', marginBottom: '15px' }}>Welcome Home!</h2> {/* Applied consistent style */}
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : user ? (
        // Wrapped content in a div with the desired layout styles
        <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <p style={{ lineHeight: '1.6', marginBottom: '10px' }}> {/* Consistent line height */}
            Hello, <span style={{ fontWeight: 'bold' }}>{user.name}</span>!
          </p>
          <p style={{ lineHeight: '1.6', marginBottom: '10px' }}> {/* Consistent line height */}
            If you're into <span style={{ fontWeight: 'bold' }}>Project K</span>, then I know you're interested in{' '}
            <span style={{ fontWeight: 'bold' }}>Indian mythology</span>.
          </p>
          <p style={{ lineHeight: '1.6' }}> {/* Consistent line height */}
            I can see your favorite character is{' '}
            <span style={{ fontWeight: 'bold' }}>{user.favoriteCharacter}</span>.
          </p>
        </div>
      ) : (
        <p>Loading your data...</p>
      )}
    </div>
  );
};

export default Home;