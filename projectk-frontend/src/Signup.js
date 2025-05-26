import React, { useState, useEffect } from 'react'; // Add useEffect for redirect
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    favoriteCharacter: '',
    password: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const characters = ['Kalki', 'Karna', 'Ashwatthama', 'Parasuram'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log("Submitting form with dataaaaaaaa:", formData);
    try {
      const response = await axios.post('http://localhost:8080/api/signup', formData);
      console.log("Full backend response:", response.data);
      setSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      setError("Failed to submit. Check console for details.");
    }
  };

  // Redirect to login page after signup
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        window.location.href = '/login'; // Redirect to login page
      }, 2000); // 2-second delay
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [submitted]);

  return (
    <div className="signup-container">
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <h2>Sign Up to Kalki World</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div>
            <label>Gender:</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Favorite Character:</label>
            <select name="favoriteCharacter" value={formData.favoriteCharacter} onChange={handleChange} required>
              <option value="">Select</option>
              {characters.map((char) => (
                <option key={char} value={char}>{char}</option>
              ))}
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <div>
          <h2>Signup Successful!</h2>
          <p>Redirecting to login page...</p>
        </div>
      )}
    </div>
  );
};

export default Signup;