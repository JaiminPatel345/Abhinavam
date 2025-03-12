import express from 'express';
import * as conversationController
  from '../controllers/conversationController.js';
import * as messageController from '../controllers/messageController.js';
import '../models/conversationModel.js'
import '../models/messageModel.js'
import {verifyToken} from "../utils/middlewares/IsUserLoggedIn.js";

const router = express.Router();

// Apply verifyToken middleware to all routes
router.use(verifyToken);


// Conversation routes
router.route('/conversations')
    .get(conversationController.getConversations)
    .post(conversationController.createConversation)

router.route('/conversations/:conversationId')
    .get(conversationController.getConversationById)


// Message routes
router.route('/messages')
    .post(messageController.sendMessage)

//TODO: handle case when use delete last message
router.route('/messages/:messageId')
    .delete(messageController.deleteMessageForMe)

router.route('/messages/:messageId/everyone')
    .delete(messageController.deleteMessageForEveryone)

//TODO: do for bulk message mark as read
router.route('/messages/:messageId/read')
    .patch(messageController.markMessageAsRead)

//TODO: make small response , no need to populate user
router.route('/conversations/:conversationId/messages')
    .get(messageController.getMessages)

export default router;
