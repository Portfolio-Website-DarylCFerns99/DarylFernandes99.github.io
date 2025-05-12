import { publicApi } from '../axiosSetup';

/**
 * Send a contact message to a specific user
 * 
 * @param {string} userId - The ID of the user to contact
 * @param {Object} contactData - The contact form data
 * @param {string} contactData.name - The sender's name
 * @param {string} contactData.email - The sender's email
 * @param {string} contactData.subject - The message subject
 * @param {string} contactData.message - The message content
 * @returns {Promise<Object>} The response from the contact API
 */
export const sendContactMessage = (userId, contactData) => {
  return new Promise((resolve, reject) => {
    publicApi.post(`/contact/${userId}`, contactData)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}; 