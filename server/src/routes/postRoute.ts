import express from "express";
import postController from "../controllers/postController.js";
import {verifyToken} from "../utils/middlewares/IsUserLoggedIn.js";
import '../models/commentModel.js'
import commentController from "../controllers/commentController.js";
import {commentLimiter, likeLimiter} from "../utils/middlewares/rateLimit.js";

const router = express.Router();

router.route("/")
    .get(postController.getAllPosts)
    .post(verifyToken, postController.createPost)

router.route("/:id")
    .get(postController.getPost)
    .put(verifyToken, postController.updatePost)
    .delete(verifyToken, postController.deletePost)

router.route("/:id/reaction")
    .post(verifyToken, likeLimiter, postController.addReaction)
    .delete(verifyToken, postController.removeReaction)

router.route("/user/:userId")
    .get(postController.getUserPosts)

router.route("/:postId/comment")
    .get(verifyToken, commentController.getPostComments)
    .post(verifyToken, commentLimiter, commentController.createComment)


export default router;
