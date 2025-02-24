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

