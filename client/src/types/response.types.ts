import {IPost} from "@/types/posts.types";
import {UserRelation} from "@/types/user.types";

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ISignatureResponse {
  signature: string;
  timestamp: number;
  folder: string;
}

export interface IFetchAllPostsResponse {
  posts: IPost[];
}

export interface IFetchFollowers{
  followers: UserRelation[];
  followersCount: number;
}

export interface IFetchFollowing{
  following: UserRelation[];
  followingCount: number;
}