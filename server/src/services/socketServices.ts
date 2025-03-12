import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';

const connectedUsers = new Map<string, string>();

export const initializeSocketServer = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      socket.data.userId = (decoded as any).id;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId;

    // Store user's socket id
    connectedUsers.set(userId, socket.id);

    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('send_message', (message) => {
      // Emit to all users in conversation
      io.to(message.conversationId).emit('receive_message', message);

      // If it's a direct message, also notify the receiver
      if (message.receiver && connectedUsers.has(message.receiver)) {
        const receiverSocketId = connectedUsers.get(message.receiver);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new_message_notification', {
            conversationId: message.conversationId,
            sender: message.sender
          });
        }
      }
    });

    socket.on('typing', (data) => {
      socket.to(data.conversationId).emit('user_typing', {
        userId: data.userId,
        conversationId: data.conversationId,
        isTyping: data.isTyping
      });
    });

    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
    });
  });

  return io;
};