import axios from 'axios';
import axiosInstance from "@/api/axiosClient";
import {ICompleteProfilePayload} from "@/types/user.types";

//TODO: Add types

export const userApi = {
  updateUserProfile: async (credentials: ICompleteProfilePayload) => {
    return axiosInstance.patch(`/users/`, credentials);
  },

  getProfileSignature: async () => {
    return axiosInstance.get('/users/get-signature?mode=profile');
  },

  uploadImageToCloudinary: async (formData: any) => {
    return axios.post(`https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
      }
    });
  },

}
