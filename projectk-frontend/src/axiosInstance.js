import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/', // Backend API base URL
});

instance.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    let token = null;
    if (user) {
      try {
        token = JSON.parse(user).token; // Parse the 'user' object to get the token
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Added Authorization header:', config.headers['Authorization']); // Debug log
    } else {
      console.warn('No token found in localStorage'); // Debug log
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;