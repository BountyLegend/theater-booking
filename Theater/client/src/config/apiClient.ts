import axios from 'axios';
import { API_URL } from './api';
import { useAuthStore } from '../store/useAuthStore';

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken || useAuthStore.getState().token;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    const refreshToken = useAuthStore.getState().refreshToken;

    if (!refreshToken) {
      await useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
      const accessToken = response.data.accessToken || response.data.token;

      if (!accessToken) {
        throw new Error('Refresh response missing access token');
      }

      await useAuthStore.getState().setAccessToken(accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      await useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    }
  }
);
