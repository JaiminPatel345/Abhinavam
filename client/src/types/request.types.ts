import {IPostReactionType} from "@/types/posts.types";

export interface IAllPostsFetch {
  page: number;
  limit: number;
}

export interface IAddReaction{
  postId: string;
  type: IPostReactionType;
}