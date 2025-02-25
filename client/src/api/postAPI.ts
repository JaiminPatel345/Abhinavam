import axiosInstance from "@/api/axiosClient";
import {ICreatePostSubmit} from "@/types/posts.types";
import axios from "axios";

export const postAPI = {

  create: async (credentials: ICreatePostSubmit) => {
    return axiosInstance.post('/posts/?mode=posts', credentials);
  },

  //multiple images
  uploadImagesToCloudinary: async (formData: any) => {
    const uploadPromises = formData.map((form: any) => axios.post(`https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, form, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
      }
    }));

    return await Promise.all(uploadPromises);
  },

}