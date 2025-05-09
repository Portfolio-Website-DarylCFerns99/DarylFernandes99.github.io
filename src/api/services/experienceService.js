import { authApi, publicApi } from '../axiosSetup';

// Admin routes (authenticated)
export const getAllExperiences = (skip = 0, limit = 100, type = null) => {
  let url = `/experiences?skip=${skip}&limit=${limit}`;
  if (type) {
    url += `&type=${type}`;
  }
  
  return new Promise((resolve, reject) => {
    authApi.get(url)
      .then(response => {
        resolve(response.data?.experiences ?? []);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const createExperience = async (experienceData) => {
  return new Promise((resolve, reject) => {
    authApi.post('/experiences', experienceData)
      .then(response => {
        resolve(response.data ?? {});
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getExperienceById = async (experienceId) => {
  return authApi.get(`/experiences/${experienceId}`);
};

export const updateExperience = async (experienceId, experienceData) => {
  return new Promise((resolve, reject) => {
    authApi.put(`/experiences/${experienceId}`, experienceData)
      .then(response => {
        resolve(response.data ?? {});
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const updateExperienceVisibility = async (experienceId, isVisible) => {
  return authApi.patch(`/experiences/${experienceId}/visibility`, { is_visible: isVisible });
};

export const deleteExperience = async (experienceId) => {
  return authApi.delete(`/experiences/${experienceId}`);
};

// Public routes
export const getPublicExperiences = async (skip = 0, limit = 100, type = null) => {
  let url = `/experiences/public?skip=${skip}&limit=${limit}`;
  if (type) {
    url += `&type=${type}`;
  }
  return publicApi.get(url);
};

export const getPublicExperienceById = async (experienceId) => {
  return publicApi.get(`/experiences/public/${experienceId}`);
};
