import React, { useState } from 'react';
import axios from 'axios'; // Note: Consider using axiosInstance here for consistency
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/login', formData);
      const token = response.data.token;

      if (token) {
        // 🔐 Store the token inside a "user" object
        localStorage.setItem('user', JSON.stringify({ token }));
        console.log('Token stored in localStorage:', token); // Debug log
        navigate('/dashboard/home');
      } else {
        setError('Login failed: Token not received.');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit}>
        <h2>Log In to Kalki World</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;