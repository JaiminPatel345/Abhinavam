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
      console.log("ERRR", error.response || error)
      const originalRequest = error.config;
      console.log("original request", originalRequest)

      // Check if response exists to avoid errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = await TokenService.getRefreshToken();
          console.log("refresh token", refreshToken)
          if (!refreshToken) {
            // Handle case when refresh token doesn't exist
            //TODO: remove comment
            // await TokenService.removeTokens();
            // TODO: redirect to login here
            return Promise.reject(error);
          }

          const response = await axios.get(`${BASE_URL}/tokens`,  {
            headers: {
              Authorization: `Bearer ${refreshToken}`
            }
          });
          console.log("response : " , response.data || response)
          await TokenService.storeTokens(response.data.data.tokens.accessToken, response.data.data.tokens.refreshToken);
          originalRequest.headers['Authorization'] = `Bearer ${response.data.data.tokens.accessToken}`;

          return axios(originalRequest);
        } catch (refreshError) {
          // Handle refresh token failure
          // await TokenService.removeTokens();
          // You might want to redirect to login here
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
);

export default axiosInstance;