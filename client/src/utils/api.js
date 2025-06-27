import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sft_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear user data and redirect to login
      localStorage.removeItem('sft_token');
      localStorage.removeItem('sft_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
