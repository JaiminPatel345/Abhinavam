import axios from "axios";
import {ILoginCredentials, IRegisterUserRequest, IVerifyOtp} from "@/types/user.types";

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const authAPI = {
  login: async (credentials: ILoginCredentials) => {
    return axios.post(`${BASE_URL}/auth/login`, {
      identifier: credentials.email,
      password: credentials.password
    });
  },

  register: async (credentials: IRegisterUserRequest) => {
    return axios.post(`${BASE_URL}/auth/register/init`, credentials);
  },

  verifyOtp: async (credentials: IVerifyOtp) => {
    return axios.post(`${BASE_URL}/auth/register/verify-otp`, credentials);
  },

  registerOtherInfo: async (credentials: IRegisterUserRequest) => {
    return axios.post(`${BASE_URL}/auth/register/complete-profile`, credentials);
  },
};