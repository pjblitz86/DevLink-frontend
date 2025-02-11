import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const publicRoutes = [
      '/api/register',
      '/api/login',
      '/api/profiles',
      '/api/jobs'
    ];

    const isPublicRoute = publicRoutes.some((route) =>
      config.url.startsWith(route)
    );
    const token = localStorage.getItem('token');
    if (!isPublicRoute && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn('Token expired or invalid');
      } else if (status === 403) {
        console.warn('Access denied. You lack the required permissions.');
      }
    } else if (error.request) {
      console.error('No response from server. Please check your network.');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
