import axiosInstance from "@/api/axiosClient";
import {CreatePostBody} from "@/types/posts.types";

export const postAPI = {
  create: async (credentials: CreatePostBody) => {
    return axiosInstance.post('/posts/', credentials);
  }
}