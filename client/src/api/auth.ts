import axios from "axios";
import { ILoginCredentials } from "@/types/user.types";

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const authAPI = {
  login: async (credentials: ILoginCredentials) => {
    return axios.post(`${BASE_URL}/auth/login`, {
      identifier: credentials.email,
      password: credentials.password
    });
  }
};