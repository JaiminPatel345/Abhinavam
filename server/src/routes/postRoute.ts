import express from "express";
import postController from "../controllers/postController.js";
import {verifyToken} from "../utils/middlewares/IsUserLoggedIn.js";
import '../models/commentModel.js'

const router = express.Router();

router.route("/")
    .get(postController.getAllPosts)
    .post(verifyToken, postController.createPost)

router.route("/:id")
    .get(postController.getPost)
    .put(verifyToken, postController.updatePost)
    .delete(verifyToken, postController.deletePost)

router.route("/:id/reaction")
    .post(verifyToken, postController.addReaction)
    .delete(verifyToken, postController.removeReaction)

router.route("/user/:userId")
    .get(postController.getUserPosts)


export default router;