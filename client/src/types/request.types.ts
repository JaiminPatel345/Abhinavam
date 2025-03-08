import {IPostReactionType} from "@/types/posts.types";

export interface IAllPostsFetch {
  page: number;
  limit: number;
  userId?: string;
}

export interface IAddReaction {
  postId: string;
  type: IPostReactionType;
}

export interface IAddCommentRequest {
  postId: string;
  content: string;
  parentComment?: string;
}

export interface IFetchCommentsRequest {
  postId: string;
  page?: number;
  limit?: number;
  parentComment?: string;
}

export interface IFetchReplyRequest {
  commentId: string;
  page: number;
  limit: number;
}

export interface IFetchPostsRequest {
  username?: string;
  page: number;
  limit: number;
}