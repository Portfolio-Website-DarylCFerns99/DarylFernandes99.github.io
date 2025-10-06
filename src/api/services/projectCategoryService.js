import { authApi } from '../axiosSetup';

// Admin routes (authenticated)
export const getAllProjectCategories = (skip = 0, limit = 100) => {
  return new Promise((resolve, reject) => {
    authApi.get(`/project-categories?skip=${skip}&limit=${limit}`)
      .then(response => {
        // API returns { categories: [...], total }
        resolve(response.data?.categories ?? []);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const createProjectCategory = async (categoryData) => {
  return authApi.post('/project-categories', categoryData);
};

export const getProjectCategoryById = async (categoryId) => {
  return authApi.get(`/project-categories/${categoryId}`);
};

export const updateProjectCategory = async (categoryId, categoryData) => {
  return authApi.put(`/project-categories/${categoryId}`, categoryData);
};


