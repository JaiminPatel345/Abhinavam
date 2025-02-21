import axios from 'axios';
import TokenService from "@/utils/tokens/TokenService";

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

axiosInstance.interceptors.request.use(async (request) => {
  const accessToken = await TokenService.getAccessToken();
  if (accessToken) {
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return request;
}, error => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    console.log("ERRR" , error.response || error)
    const originalRequest = error.config;

    // Check if response exists to avoid errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await TokenService.getRefreshToken();

        if (!refreshToken) {
          // Handle case when refresh token doesn't exist
          await TokenService.removeTokens();
          // You might want to redirect to login here
          return Promise.reject(error);
        }

        const response = await axios.post(`${BASE_URL}/auth/tokens`, { refreshToken });
        await TokenService.storeTokens(response.data.accessToken, response.data.refreshToken);
        originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;

        return axios(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure
        await TokenService.removeTokens();
        // You might want to redirect to login here
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;