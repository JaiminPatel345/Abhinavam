import express from 'express';
import commentController from "../controllers/commentController.js";
import {verifyToken} from "../utils/middlewares/IsUserLoggedIn.js";
import {likeLimiter} from "../utils/middlewares/rateLimit.js";

const router = express.Router();

router.route("/:commentId")
    .get(commentController.getReplies)
    .put(verifyToken, commentController.updateComment)
    .delete(verifyToken, commentController.deleteComment);


router.route("/:postId/comment")
    .get(verifyToken, commentController.getPostComments)
    .post(verifyToken, commentController.createComment)

router.route("/:commentId/like")
    .post(verifyToken, likeLimiter, commentController.toggleLike)

export default router;