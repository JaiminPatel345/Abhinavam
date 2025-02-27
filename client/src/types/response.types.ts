import {IPost} from "@/types/posts.types";

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