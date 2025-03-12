import {Response} from 'express';
import mongoose from 'mongoose';
import {
  ConversationParams,
  MarkAsReadRequest,
  MessageParams,
  SendMessageRequest,
  TypedRequestWithParams
} from '../types/request.types.js';
import {AppError, formatResponse} from "../types/custom.types.js";
import Conversation from "../models/conversationModel.js";
import Message, {IMessage} from "../models/messageModel.js";
import {MessageResponse, PaginatedResponse} from "../types/response.types.js";

export const sendMessage = async (
    req: TypedRequestWithParams<SendMessageRequest, {}>,
    res: Response
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {content, attachment, conversationId, receiver} = req.body;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    if (!content || !conversationId) {
      throw new AppError('Invalid body', 403);
    }

    if (receiver && userId === receiver) {
      throw new AppError('Can\'t send message to yourself', 403);
    }

    // Validate conversation exists and user is part of it
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    if (!conversation.participants.some(p => p.toString() === userId)) {
      throw new AppError('You are not part of this conversation', 403);
    }

    let receiverId;

    if (conversation.isGroup) {
      const messageData = {
        sender: new mongoose.Types.ObjectId(userId),
        // No receiver field for group messages
        content,
        ...(attachment && {attachment}),
        conversationId: new mongoose.Types.ObjectId(conversationId),
        // Initialize empty readBy array (or could pre-populate with some users if needed)
        readBy: []
      };

      const newMessage = await Message.create(messageData);

      // Update conversation's lastMessage
      await Conversation.findByIdAndUpdate(
          conversationId,
          {
            lastMessage: newMessage._id,
            updatedAt: new Date()
          }
      );
    } else {
      // For direct messages, validate receiver is part of the conversation
      if (!receiver) {
        throw new AppError('Receiver is required for direct messages', 400);
      }

      if (!conversation.participants.some(p => p.toString() === receiver)) {
        throw new AppError('Receiver is not part of this conversation', 400);
      }

      // Create message
      const newMessage = await Message.create({
        sender: new mongoose.Types.ObjectId(userId),
        receiver: new mongoose.Types.ObjectId(receiver),
        content,
        ...(attachment && {attachment}),
        conversationId: new mongoose.Types.ObjectId(conversationId),
        read: false
      });

      // Update conversation's lastMessage
      await Conversation.findByIdAndUpdate(
          conversationId,
          {
            lastMessage: newMessage._id,
            updatedAt: new Date()
          }
      );

      receiverId = newMessage.receiver;
    }

    await session.commitTransaction();
    session.endSession();

    // Populate message data for the response
    const latestMessage = await Message.findOne({
      conversationId,
      sender: userId,
      ...(receiverId && {receiver: receiverId})
    })
        .sort({createdAt: -1})
        .populate({
          path: 'sender',
          select: '_id username avatar'
        });

    if (!latestMessage) {
      throw new AppError('Error retrieving sent message', 500);
    }

    const messageResponse: MessageResponse = {
      _id: latestMessage._id as string,
      sender: {
        _id: (latestMessage.sender as any)._id.toString(),

        username: (latestMessage.sender as any).username,
        avatar: (latestMessage.sender as any).avatar
      },
      content: latestMessage.content,
      ...(latestMessage.attachment && {attachment: latestMessage.attachment}),
      readBy: latestMessage.readBy,
      conversationId: latestMessage.conversationId.toString(),
      createdAt: latestMessage.createdAt
    };

    res.status(201).json(
        formatResponse(true, 'Message sent successfully', messageResponse)
    );
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    if (error instanceof AppError) {
      res.status(error.statusCode).json(
          formatResponse(false, error.message)
      );
      return
    }
    res.status(500).json(
        formatResponse(false, 'Error sending message: ' + error.message)
    );
  }
};


export const getMessages = async (
    req: TypedRequestWithParams<{}, ConversationParams>,
    res: Response
) => {
  try {
    const {conversationId} = req.params;
    const {limit = 20, page = 1} = req.query;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // Validate conversation exists and user is part of it
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    if (!conversation.participants.some(p => p.toString() === userId)) {
      throw new AppError('You are not part of this conversation', 403);
    }

    const skip = (page - 1) * limit;

    // Build query based on conversation type and message deletion status
    const messageQuery: any = {
      conversationId,
      // Don't show messages deleted for everyone
      deletedForEveryone: {$ne: true},
      // Don't show messages deleted for this specific user
      'deletedFor.user': {$ne: new mongoose.Types.ObjectId(userId)}
    };

    // Get messages for the conversation
    const messages = await Message.find(messageQuery)
        .populate({
          path: 'sender',
          select: '_id username avatar'
        })
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit);

    const totalDocs = await Message.countDocuments(messageQuery);

    // Format response
    const messageResponses = messages.map(msg => ({
      _id: msg._id as string,
      sender: {
        _id: (msg.sender as any)._id.toString(),
        username: (msg.sender as any).username,
        avatar: (msg.sender as any).avatar
      },
      content: msg.content,
      ...(msg.attachment && {attachment: msg.attachment}),
      readBy: msg.readBy,
      conversationId: msg.conversationId.toString(),
      createdAt: msg.createdAt
    }));

    const paginationData: PaginatedResponse<MessageResponse> = {
      data: messageResponses,
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
        formatResponse(true, 'Messages retrieved successfully', paginationData)
    );
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json(
          formatResponse(false, error.message)
      );
      return
    }
    res.status(500).json(
        formatResponse(false, 'Error retrieving messages: ' + error.message)
    );
  }
};


export const markMessageAsRead = async (
    req: TypedRequestWithParams<MarkAsReadRequest, MessageParams>,
    res: Response
) => {
  try {
    const {messageId} = req.params;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const message: IMessage | null = await Message.findById(messageId);
    if (!message) {
      throw new AppError('Message not found', 404);
    }

    const conversation = await Conversation.findById(message.conversationId);
    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    // Check if user is part of the conversation
    if (!conversation.participants.some(p => p.toString() === userId)) {
      throw new AppError('You are not part of this conversation', 403);
    }

    // For direct messages
    if (!conversation.isGroup) {
      // Only receiver can mark message as read
      if (message.receiver?.toString() !== userId) {
        throw new AppError('You are not authorized to mark this message as read', 403);
      }

      // Use $set for direct messages
      await Message.findByIdAndUpdate(messageId, {readBy: [new mongoose.Schema.Types.ObjectId(userId)]});
    }
    // For group messages
    else {
      // Don't let sender mark their own message as read
      if (message.sender.toString() === userId) {
        throw new AppError('Cannot mark your own message as read', 400);
      }

      // Check if user has already marked this message as read
      const alreadyRead = message.readBy?.some(item =>
          item.user.toString() === userId
      );

      if (!alreadyRead) {
        // Add user to readBy array
        await Message.findByIdAndUpdate(messageId, {
          $addToSet: {
            readBy: {
              user: new mongoose.Types.ObjectId(userId),
              readAt: new Date()
            }
          }
        });
      }
    }

    res.status(200).json(
        formatResponse(true, 'Message marked as read')
    );
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json(
          formatResponse(false, error.message)
      );
      return
    }
    res.status(500).json(
        formatResponse(false, 'Error marking message as read: ' + error.message)
    );
  }
};


export const deleteMessageForMe = async (
    req: TypedRequestWithParams<{}, MessageParams>,
    res: Response
) => {
  try {
    const {messageId} = req.params;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const message = await Message.findById(messageId);
    if (!message) {
      throw new AppError('Message not found', 404);
    }

    // Check if user is part of the conversation
    const conversation = await Conversation.findById(message.conversationId);
    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    if (!conversation.participants.some(p => p.toString() === userId)) {
      throw new AppError('You are not part of this conversation', 403);
    }

    // Check if already deleted for this user
    const alreadyDeleted = message.deletedFor?.some(item =>
        item.toString() === userId
    );

    if (alreadyDeleted) {
      throw new AppError('Message already deleted for you', 400);
    }

    // Add user to deletedFor array
    await Message.findByIdAndUpdate(messageId, {
      $addToSet: {
        deletedFor: {
          user: new mongoose.Types.ObjectId(userId),
          deletedAt: new Date()
        }
      }
    });

    res.status(200).json(
        formatResponse(true, 'Message deleted for you')
    );
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json(
          formatResponse(false, error.message)
      );
      return;
    }
    res.status(500).json(
        formatResponse(false, 'Error deleting message for you: ' + error.message)
    );
  }
};


export const deleteMessageForEveryone = async (
    req: TypedRequestWithParams<{}, MessageParams>,
    res: Response
) => {
  try {
    const {messageId} = req.params;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const message = await Message.findById(messageId);
    if (!message) {
      throw new AppError('Message not found', 404);
    }

    // Only sender can delete for everyone
    if (message.sender.toString() !== userId) {
      throw new AppError('Only sender can delete message for everyone', 403);
    }

    // Optional: Check time limit (e.g., within 1 hour of sending)
    const messageTime = new Date(message.createdAt).getTime();
    const currentTime = new Date().getTime();
    const oneHour = 61 * 60 * 1000;

    if (currentTime - messageTime > oneHour) {
      throw new AppError('Cannot delete messages older than 1 hour for everyone', 400);
    }

    // Mark as deleted for everyone
    await Message.findByIdAndUpdate(messageId, {
      deletedForEveryone: true
    });

    // If this is the last message in the conversation, update lastMessage
    const conversation = await Conversation.findById(message.conversationId);
    if (conversation && conversation.lastMessage?.toString() === messageId) {
      // Find the previous message that's not deleted for everyone
      const previousMessage: IMessage | null = await Message.findOne({
        conversationId: message.conversationId,
        _id: {$ne: messageId},
        'deletedForEveryone.isDeleted': {$ne: true}
      }).sort({createdAt: -1});

      // Update conversation's lastMessage
      if (previousMessage) {
        conversation.lastMessage = previousMessage._id as mongoose.Types.ObjectId;
      } else {
        // If no previous message, set lastMessage to undefined
        conversation.lastMessage = undefined;
      }
      await conversation.save();
    }

    res.status(200).json(
        formatResponse(true, 'Message deleted for everyone')
    );
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json(
          formatResponse(false, error.message)
      );
      return;
    }
    res.status(500).json(
        formatResponse(false, 'Error deleting message for everyone: ' + error.message)
    );
  }
};