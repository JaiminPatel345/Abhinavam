// CLIENT SIDE (React Native Expo)
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// Token Storage Service
class TokenService {
  static async storeTokens(accessToken:string, refreshToken:string) {
    try {
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
    } catch (error) {
      console.error('Error storing tokens:', error);
      throw error;
    }
  }

  static async getAccessToken() {
    try {
      return await SecureStore.getItemAsync('accessToken');
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  static async getRefreshToken() {
    try {
      return await SecureStore.getItemAsync('refreshToken');
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  static async removeTokens() {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
    } catch (error) {
      console.error('Error removing tokens:', error);
    }
  }
}

// API Service with Interceptors
const api = axios.create({
  baseURL: 'https://your-api.com',
});

api.interceptors.request.use(
  async (config) => {
    const token = await TokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await TokenService.getRefreshToken();
        const response = await axios.post('https://your-api.com/refresh-token', {
          refreshToken,
        });

        const { accessToken, newRefreshToken } = response.data;
        await TokenService.storeTokens(accessToken, newRefreshToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        await TokenService.removeTokens();
        //TODO: Redirect to login or handle authentication failure
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);
