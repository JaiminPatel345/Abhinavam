//-------------Chat-----------------

import {Request} from 'express';

export interface CreateConversationRequest {
  participants: string[];
  isGroup: boolean;
  groupName?: string;
}

export interface SendMessageRequest {
  content: string;
  attachment?: string;
  conversationId: string;
  receiver: string;
}

export interface GetConversationsRequest {
  limit?: number;
  page?: number;
}

export interface GetMessagesRequest {
  conversationId: string;
  limit?: number;
  page?: number;
}

export interface MarkAsReadRequest {
  messageId: string;
}

export interface DeleteMessageRequest {
  messageId: string;
}

export interface TypedRequestWithParams<T, P> extends Request<P, any, T, any> {
  userId?: string;
}
export interface ConversationParams {
  conversationId: string;
}

export interface MessageParams {
  messageId: string;
}