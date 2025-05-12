import { createSlice } from '@reduxjs/toolkit';
import userData from '../../common/userData.json';

const initialState = {
  ...userData,
  isGithubDataLoading: false,
  isTestData: true // Default to true since we initially load from JSON
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserData: (state, action) => {
      return { 
        ...state, 
        ...action.payload,
        isTestData: false // Set to false when data is from API
      };
    },
    updateProjectData: (state, action) => {
      const { projectIndex, githubData } = action.payload;
      
      // Create a new projects array with the updated project
      const updatedProjects = [...state.projects];
      
      // Update the project with GitHub data
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        ...githubData
      };
      
      // Return updated state
      return {
        ...state,
        projects: updatedProjects
      };
    },
    setGithubDataLoading: (state, action) => {
      state.isGithubDataLoading = action.payload;
    },
    setTestDataFlag: (state, action) => {
      state.isTestData = action.payload;
    },
    resetUserData: () => initialState
  }
});

export const { 
  updateUserData, 
  updateProjectData, 
  setGithubDataLoading, 
  setTestDataFlag,
  resetUserData 
} = userSlice.actions;
export default userSlice.reducer; 