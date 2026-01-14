import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    // headers: { 'Content-Type': 'application/json' }, // Removed to allow automatic FormData detection
});

// Request interceptor - Add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Only redirect if not already on login/register to avoid loops
            if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
                window.location.href = '/login';
            }
        }

        // Handle Vercel/Deployment errors that might return HTML
        const contentType = error.response?.headers?.['content-type'];
        if (contentType && !contentType.includes('application/json')) {
            error.response.data = {
                success: false,
                message: `Server Error (${error.response.status}): The server returned an unexpected response format.`
            };
        }

        return Promise.reject(error);
    }
);

export default api;
