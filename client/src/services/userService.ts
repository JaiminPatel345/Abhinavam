import axiosInstance from "@/api/axiosClient";
import {IUser} from "@/types/user.types";
import {IPost} from "@/types/posts.types";

export const fetchUserById = async (username: string): Promise<IUser> => {
  const response = await axiosInstance.get(`/users/${username}`);
  return response.data.data;
}

export const fetchUserPosts = async (username: string, page: number): Promise<{
  posts: IPost[],
  hasMore: boolean
}> => {
  const response = await axiosInstance.get(`/users/${username}/posts`, {
    params: {
      page,
      limit: 10,
    }
  });
  return response.data.data;
}

export const fetchUserFollowers = async (username: string): Promise<IUser[]> => {
  const response = await axiosInstance.get(`/users/${username}/followers`);
  return response.data.data;
}

export const fetchUserFollowing = async (username: string): Promise<IUser[]> => {
  const response = await axiosInstance.get(`/users/${username}/following`);
  return response.data.data;
}
