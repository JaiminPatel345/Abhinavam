//-------------Chat-----------------


import mongoose from "mongoose";

export interface ConversationResponse {
  _id: string;
  participants: {
    _id: string;
    username: string;
    avatar: {
      url: string;
      public_id: string;
    };
  }[];
  isGroup: boolean;
  groupName?: string;
  groupAdmin?: string;
  lastMessage?: {
    _id: string;
    content: string;
    sender: string;
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  unreadCount: number;
}

export interface MessageResponse {
  _id: string;
  sender: {
    _id: string;
    username: string;
    avatar: {
      url: string;
      public_id: string;
    };
  };
  content: string;
  attachment?: string;
  readBy: [{
    user: mongoose.Types.ObjectId;
    readAt: Date;
  }];
  conversationId: string;
  createdAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}