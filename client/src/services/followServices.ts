import {userApi} from "@/api/userApi";

export const fetchFollowers = async (username: string) => {
  const response = await userApi.getFollowers(username);
  return response.data.data;
}

export const fetchFollowing = async (username: string) => {
  const response = await userApi.getFollowing(username);
  return response.data.data;
}

export const toggleFollow = async (userId: string) => {
  const response = await userApi.toggleFollow(userId)
  return response.data.data;
}
