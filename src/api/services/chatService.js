import { authApi } from '../axiosSetup';

export const getAllSessions = async (limit = 50, offset = 0) => {
    try {
        const response = await authApi.get(`/chatbot/sessions`, {
            params: { limit, offset }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSessionMessages = async (sessionId) => {
    try {
        const response = await authApi.get(`/chatbot/sessions/${sessionId}/messages`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
