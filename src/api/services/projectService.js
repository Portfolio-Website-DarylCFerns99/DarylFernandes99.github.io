import { authApi, publicApi } from '../axiosSetup';

// Admin routes (authenticated)
export const getAllProjects = (skip = 0, limit = 100) => {
  return new Promise((resolve, reject) => {
    authApi.get(`/projects?skip=${skip}&limit=${limit}`)
      .then(response => {
        resolve(response.data?.projects ?? []);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const createProject = async (projectData) => {
  return authApi.post('/projects', projectData);
};

export const getProjectById = async (projectId) => {
  return authApi.get(`/projects/${projectId}`);
};

export const updateProject = async (projectId, projectData) => {
  return authApi.put(`/projects/${projectId}`, projectData);
};

export const updateProjectVisibility = async (projectId, isVisible) => {
  return authApi.patch(`/projects/${projectId}/visibility`, { is_visible: isVisible });
};

export const deleteProject = async (projectId) => {
  return authApi.delete(`/projects/${projectId}`);
};

export const refreshProjectData = async (projectId) => {
  return authApi.post(`/projects/${projectId}/refresh`);
};

// Public routes
export const getPublicProjects = async (skip = 0, limit = 100) => {
  return publicApi.get(`/projects/public?skip=${skip}&limit=${limit}`);
};

export const getPublicProjectById = async (projectId) => {
  return publicApi.get(`/projects/public/${projectId}`);
};
