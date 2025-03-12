import {Response} from 'express';
import mongoose from 'mongoose';

import {
  ConversationParams,
  CreateConversationRequest,
  GetConversationsRequest,
  TypedRequestWithParams
} from '../types/request.types.js';
import {
  ConversationResponse,
  PaginatedResponse
} from '../types/response.types.js';
import {
  AppError,
  formatResponse,
  TypedRequestBody
} from "../types/custom.types.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

export const createConversation = async (
    req: TypedRequestBody<CreateConversationRequest>,
    res: Response
) => {
  try {
    const {participants, isGroup, groupName} = req.body;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    if(!participants || isGroup === undefined ) {
      throw new AppError('Invalid body', 401);
    }

    // Ensure user is included in participants
    if (!participants.includes(userId)) {
      participants.push(userId);
    }

    // console.log("Body :" , participants, isGroup, groupName);
    if (!isGroup) {
      if (!participants || participants.length > 2) {
        throw new AppError('Must be group', 403);
      }
    } else {
      if (!groupName) {
        throw new AppError('Group Name can\'t be empty ', 400);
      }
    }


    // For regular conversations (non-group), check if conversation already exists
    if (!isGroup && participants.length === 2) {
      const existingConversation = await Conversation.findOne({
        isGroup: false,
        participants: {$all: participants, $size: 2}
      });

      if (existingConversation) {
        res.status(200).json(
            formatResponse(true, 'Conversation already exists',
                await populateConversation(existingConversation._id as string, userId)
            )
        );
        return
      }
    }

    const conversationData = {
      participants: participants.map(id => new mongoose.Types.ObjectId(id)),
      isGroup,
      ...(isGroup && groupName && {groupName}),
      ...(isGroup && {groupAdmin: new mongoose.Types.ObjectId(userId)})
    };

    const newConversation = await Conversation.create(conversationData);
    const populatedConversation = await populateConversation(newConversation._id as string, userId);

    res.status(201).json(
        formatResponse(true, 'Conversation created successfully', populatedConversation)
    );
  } catch (error: any) {
    console.log("Error to create conversation", error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json(
          formatResponse(false, error.message)
      );
      return
    }
    res.status(500).json(
        formatResponse(false, 'Error creating conversation: ' + error.message)
    );

  }
};

export const getConversations = async (
    req: TypedRequestBody<GetConversationsRequest>,
    res: Response
) => {
  try {
    const userId = req.userId;
    const {limit = 20, page = 1} = req.body;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const skip = (page - 1) * limit;

    // Get conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: new mongoose.Types.ObjectId(userId)
    })
        .sort({updatedAt: -1})
        .skip(skip)
        .limit(limit);

    const totalDocs = await Conversation.countDocuments({
      participants: new mongoose.Types.ObjectId(userId)
    });

    // Populate conversation data
    const populatedConversations = await Promise.all(
        conversations.map(conv => populateConversation(conv._id as mongoose.Types.ObjectId, userId))
    );

    const paginationData: PaginatedResponse<ConversationResponse> = {
      data: populatedConversations,
      pagination: {
        totalDocs,
        limit,
        page,
        totalPages: Math.ceil(totalDocs / limit),
        hasNextPage: page < Math.ceil(totalDocs / limit),
        hasPrevPage: page > 1
      }
    };

    res.status(200).json(
        formatResponse(true, 'Conversations retrieved successfully', paginationData)
    );
    return
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json(
          formatResponse(false, error.message)
      );
      return
    }
    res.status(500).json(
        formatResponse(false, 'Error retrieving conversations: ' + error.message)
    );
  }
};

export const getConversationById = async (
    req: TypedRequestWithParams<{}, ConversationParams>,
    res: Response
) => {
  try {
    const {conversationId} = req.params;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    // Check if user is part of the conversation
    if (!conversation.participants.some(p => p.toString() === userId)) {
      throw new AppError('You are not authorized to view this conversation', 403);
    }

    const populatedConversation = await populateConversation(conversation._id as string, userId);

    res.status(200).json(
        formatResponse(true, 'Conversation retrieved successfully', populatedConversation)
    );
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json(
          formatResponse(false, error.message)
      );
      return
    }
    res.status(500).json(
        formatResponse(false, 'Error retrieving conversation: ' + error.message)
    );
  }
};

// Helper function to populate conversation with detailed info
async function populateConversation(
    conversationId: mongoose.Types.ObjectId | string,
    currentUserId: string
): Promise<ConversationResponse> {
  const conversation = await Conversation.findById(conversationId)
      .populate({
        path: 'participants',
        select: '_id username avatar'
      })
      .populate({
        path: 'lastMessage',
        select: '_id content sender createdAt'
      })
      .populate({
        path: 'groupAdmin',
        select: '_id username'
      });

  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  // Count unread messages for the current user
  const unreadCount = await Message.countDocuments({
    conversationId,
    receiver: currentUserId,
    read: false
  });

  // Handle lastMessage
  let lastMessageData = null;
  if (conversation.lastMessage) {
    const lastMessage = await Message.findById(conversation.lastMessage)
        .select('_id content sender createdAt');

    if (lastMessage) {
      lastMessageData = {
        _id: lastMessage._id as string,
        content: lastMessage.content,
        sender: lastMessage.sender.toString(),
        createdAt: lastMessage.createdAt
      };
    }
  }

  // Convert to response format
  return {
    _id: conversation._id as string,
    participants: conversation.participants.map((p: any) => ({
      _id: p._id.toString(),
      username: p.username,
      avatar: p.avatar
    })),
    isGroup: conversation.isGroup,
    ...(conversation.isGroup && conversation.groupName && {groupName: conversation.groupName}),
    ...(conversation.isGroup && conversation.groupAdmin && {
      groupAdmin: conversation.groupAdmin._id.toString()
    }),
    ...(lastMessageData && {lastMessage: lastMessageData}),
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    unreadCount
  };
}