import axios from 'axios';
import { getCookie, removeCookie, TOKEN_COOKIE_NAME } from '../utils/cookieUtils';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create a base axios instance
const baseAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create an instance for public routes
export const publicApi = baseAxios;

// Create an instance for authenticated routes
export const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Add request interceptor to add authorization header
authApi.interceptors.request.use(
  config => {
    const token = getCookie(TOKEN_COOKIE_NAME);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
authApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Handle 401 Unauthorized responses
      if (error.response.status === 401) {
        // Handle token expiration or unauthorized access
        removeCookie(TOKEN_COOKIE_NAME);
        window.location.href = '/admin'; // Updated path
      }
      
      // Handle 403 Forbidden responses
      if (error.response.status === 403) {
        // Forbidden - user doesn't have permissions
        removeCookie(TOKEN_COOKIE_NAME);
        // We'll let the component handle the redirect to preserve React Router behavior
        // The error will still be thrown to the catch block where we can handle it
      }
    }
    return Promise.reject(error);
  }
);
