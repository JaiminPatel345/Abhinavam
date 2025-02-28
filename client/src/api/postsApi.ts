import axiosInstance from "@/api/axiosClient";
import {ICreatePostSubmit} from "@/types/posts.types";
import axios from "axios";
import {IAddReaction, IAllPostsFetch} from "@/types/request.types";

export const postsApi = {

  //fetch all posts
  fetchAllPosts: async (credentials: IAllPostsFetch) => {
    return axiosInstance.get(`/posts/?page=${credentials.page}&limit=${credentials.limit}`);

  },

  //create new Post
  create: async (credentials: ICreatePostSubmit) => {
    return axiosInstance.post('/posts/?mode=posts', credentials);
  },

  addReaction: async (credentials:IAddReaction) => {
    return axiosInstance.post(`/posts/${credentials.postId}/reactions` , {type : credentials.type});
  },

  removeReaction: async (postId:string) => {
    return axiosInstance.delete(`/posts/${postId}/reactions`);
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