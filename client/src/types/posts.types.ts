// Enum for post reactions
//TODO: add more
export enum IPostReactionType {
  WOW = 'wow',         // 🔥
  VIBE = 'vibe',      // ✨
  RESPECT = 'respect', // 🙌
  INSPIRE = 'inspire', // 💫
}

export interface IReaction {
  type: IPostReactionType;
  user: IOwner;
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
  type: IPostReactionType;
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
  media?: IMediaItem[];
}

export interface IOwner {
  username: string;
  avatar: {
    url: string;
  };
}

export interface IPost {
  _id: string;
  description?: string;
  owner: IOwner;
  media: {
    url: string;
    public_id: string;
    _id?: string;
  }[];
  comments: string[] ;
  reactions: IReaction[] | [];
  shares: number;
  location?: ILocation;
  isArchived: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  _id: string;
  content: string;
  author: IOwner;
  post: string; //post id
  parentComment?: string //comment id
  replies: string[]; //comment ids
  likes: string[]; //user ids
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostSliceInitState {
  isLoading: boolean;
  posts: Record<string, IPost> | null;
  likedPosts: Record<string, IPostReactionType>;
  page: number;
  limit: number;
}

