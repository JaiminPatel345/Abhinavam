import {Document, Types} from "mongoose";

// Enum for post reactions
//TODO: add more
export enum PostReactionType {
  WOW = 'wow',         // 🔥
  VIBE = 'vibe',      // ✨
  RESPECT = 'respect', // 🙌
  INSPIRE = 'inspire', // 💫
}

// Interface for location
export interface ILocation {
  city?: string;
  country?: string;
}

// Interface for reaction
export interface IReaction {
  type: PostReactionType;
  user: Types.ObjectId;
  createdAt: Date;
}

// Main post interface
export interface IPost extends Document {
  description?: string;
  owner: Types.ObjectId;
  medias: Types.ObjectId[];
  comments: Types.ObjectId[];
  reactions: IReaction[];
  shares: number;
  location?: ILocation;
  isArchived: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}


export interface CreatePostBody {
  description?: string;
  tags?: string[];
  location?: {
    city?: string;
    country?: string;
  };
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

export interface IComment extends Document {
  content: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
  parentComment?: Types.ObjectId | null;
  replies: Types.ObjectId[];
  likes: Types.ObjectId[];
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}