import express from 'express';
import commentController from "../controllers/commentController.js";
import {verifyToken} from "../utils/middlewares/IsUserLoggedIn.js";
import {likeLimiter} from "../utils/middlewares/rateLimit.js";

const router = express.Router();


router.route("/like/:commentId")
    .post(verifyToken, likeLimiter, commentController.likeComment)
    .delete(verifyToken, commentController.unlikeComment);

router.route("/:commentId")
    .put(verifyToken, commentController.updateComment)
    .delete(verifyToken, commentController.deleteComment);

router.route("/:commentId/replies")
    .get(commentController.getReplies)


export default router;