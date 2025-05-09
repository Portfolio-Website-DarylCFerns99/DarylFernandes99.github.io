/**
 * Cookie utility functions for handling authentication token
 */

// Token name in cookie
export const TOKEN_COOKIE_NAME = 'auth_token';

/**
 * Set a cookie with the given name, value, and expiry time
 * 
 * @param {string} name - The name of the cookie
 * @param {string} value - The value to store in the cookie
 * @param {number} expiryMinutes - The expiry time in minutes (defaults to 120 minutes/2 hours)
 */
export const setCookie = (name, value, expiryMinutes = 120) => {
  const date = new Date();
  date.setTime(date.getTime() + (expiryMinutes * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
};

/**
 * Get a cookie value by name
 * 
 * @param {string} name - The name of the cookie to retrieve
 * @returns {string|null} The cookie value or null if not found
 */
export const getCookie = (name) => {
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
};

/**
 * Remove a cookie by setting its expiry to a past date
 * 
 * @param {string} name - The name of the cookie to remove
 */
export const removeCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};
