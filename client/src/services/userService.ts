import axiosInstance from "@/api/axiosClient";
import {IUser} from "@/types/user.types";
import {IPost} from "@/types/posts.types";

export const fetchUserById = async (id: string): Promise<IUser> => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data.data;
}

export const fetchUserPosts = async (id: string, page: number): Promise<{
  posts: IPost[],
  hasMore: boolean
}> => {
  const response = await axiosInstance.get(`/users/${id}/posts`, {
    params: {
      page,
      limit: 10,
    }
  });
  return {
    posts: response.data.data,
    hasMore: response.data.hasMore
  };
}