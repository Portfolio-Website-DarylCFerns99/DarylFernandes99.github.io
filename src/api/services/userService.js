import { authApi, publicApi } from '../axiosSetup';
import { setCookie, TOKEN_COOKIE_NAME } from '../../utils/cookieUtils';

/**
 * Login and get JWT token
 * 
 * @param {Object} credentials - The login credentials
 * @param {string} credentials.username - The username or email
 * @param {string} credentials.password - The password
 * @returns {Promise<Object>} The login response
 */
export const login = async (credentials) => {
  try {
    // With FastAPI, we need to use URLSearchParams for form data
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await authApi.post('/users/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Store token in cookie (120-minute expiry)
    if (response.data.access_token) {
      setCookie(TOKEN_COOKIE_NAME, response.data.access_token, 120);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user profile (requires authentication)
 * 
 * @returns {Promise<Object>} The user profile data
 */
export const getProfile = () => {
  return new Promise((resolve, reject) => {
    authApi.get('/users/profile')
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/**
 * Update user profile (requires authentication)
 * 
 * @param {Object} profileData - The profile data to update
 * @returns {Promise<Object>} The updated user profile data
 */
export const updateProfile = (profileData) => {
  return new Promise((resolve, reject) => {
    authApi.put('/users/profile', profileData)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/**
 * Get public user data
 * 
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} The public user data
 */
export const getPublicUserData = (userId) => {
  return new Promise((resolve, reject) => {
    publicApi.get(`/users/public-data/${userId}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};
