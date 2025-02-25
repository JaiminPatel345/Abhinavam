// Enum for post reactions
//TODO: add more
export enum PostReactionType {
  WOW = 'wow',         // 🔥
  VIBE = 'vibe',      // ✨
  RESPECT = 'respect', // 🙌
  INSPIRE = 'inspire', // 💫
}

export interface UpdatePostBody {
  description?: string;
  tags?: string[];
  location?: {
    city?: string;
    country?: string;
  };
  isArchived?: boolean;
}

export interface ReactionBody {
  type: PostReactionType;
}

export interface CreateCommentBody {
  content: string;
  parentCommentId?: string;
}

export interface UpdateCommentBody {
  content: string;
}

export interface ILocation {
  city: string;
  country: string;
}

export interface IMediaItem {
  url: string;
  public_id: string;
}

export interface ICreatePostForm {
  description: string;
  location?: ILocation;
  tags: string[];
}

export interface ICreatePostSubmit extends ICreatePostForm {
  media: IMediaItem[];
}