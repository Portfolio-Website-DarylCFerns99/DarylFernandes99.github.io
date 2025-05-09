import { authApi, publicApi } from '../axiosSetup';

// Admin routes (authenticated)
export const getAllReviews = (skip = 0, limit = 100) => {
  return new Promise((resolve, reject) => {
    authApi.get(`/reviews?skip=${skip}&limit=${limit}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const createReview = async (reviewData) => {
  return authApi.post('/reviews', reviewData);
};

export const getReviewById = async (reviewId) => {
  return authApi.get(`/reviews/${reviewId}`);
};

export const updateReviewVisibility = async (reviewId, isVisible) => {
  return authApi.patch(`/reviews/${reviewId}/visibility`, { is_visible: isVisible });
};

export const deleteReview = async (reviewId) => {
  return authApi.delete(`/reviews/${reviewId}`);
};

// Public routes
export const getPublicReviews = async (skip = 0, limit = 100) => {
  return publicApi.get(`/reviews/public?skip=${skip}&limit=${limit}`);
};

export const getPublicReviewById = async (reviewId) => {
  return publicApi.get(`/reviews/public/${reviewId}`);
};
