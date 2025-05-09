import { authApi, publicApi } from '../axiosSetup';

// Admin routes (authenticated)
export const getAllSkillGroups = (skip = 0, limit = 100) => {
  return new Promise((resolve, reject) => {
    authApi.get(`/skills/groups?skip=${skip}&limit=${limit}`)
      .then(response => {
        resolve(response.data?.skill_groups ?? []);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const createSkillGroup = async (skillGroupData) => {
  return authApi.post('/skills/groups', skillGroupData);
};

export const getSkillGroupById = async (skillGroupId) => {
  return authApi.get(`/skills/groups/${skillGroupId}`);
};

export const updateSkillGroup = async (skillGroupId, skillGroupData) => {
  return authApi.put(`/skills/groups/${skillGroupId}`, skillGroupData);
};

export const updateSkillGroupVisibility = async (skillGroupId, isVisible) => {
  return authApi.patch(`/skills/groups/${skillGroupId}/visibility`, { is_visible: isVisible });
};

export const deleteSkillGroup = async (skillGroupId) => {
  return authApi.delete(`/skills/groups/${skillGroupId}`);
};

// Public routes
export const getPublicSkillGroups = async (skip = 0, limit = 100) => {
  return publicApi.get(`/skills/groups/public?skip=${skip}&limit=${limit}`);
};
