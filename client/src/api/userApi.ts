import axios from 'axios';
import axiosInstance from "@/api/axiosClient";
import {ICompleteProfilePayload} from "@/types/user.types";

//TODO: Add types

export const userApi = {
  updateUserProfile: async (credentials: ICompleteProfilePayload) => {
    return axiosInstance.patch(`/users/`, credentials);
  },

  getProfileSignature: async (mode: string) => {
    return axiosInstance.get(`/users/get-signature?mode=${mode}`);
  },

  uploadImageToCloudinary: async (formData: any) => {
    return axios.post(`https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, formData, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
      }
    });
  },

  fetchMe: async () => {
    return axiosInstance.get('/users/');
  },

  uploadImageToDB: async (avatar: {url:string , public_id:string}) => {
    return axiosInstance.put('/users/upload-avatar', {avatar});
  }


}
