import express from "express";
import userController from "../controllers/userController.js";
import {verifyToken} from "../utils/middlewares/IsUserLoggedIn.js";
import {validateUsername} from "../utils/middlewares/validateUsername.js";


const router = express.Router();

router.route("/")
    .get(verifyToken, userController.getMyProfile)
    .patch(verifyToken, userController.updateUserProfile)

router.route("/get-signature")
    .get(verifyToken, userController.getSignature)

router.route("/upload-avatar")
    .put(verifyToken, userController.updateAvatar)

router.route("/toggle-follow")
    .post(verifyToken, userController.toggleFollowing)

router.route("/:username/following")
    .get(validateUsername, verifyToken, userController.getFollowing)

router.route("/:username/followers")
    .get(validateUsername, verifyToken, userController.getFollowers)

router.route("/:username/posts")
    .get(validateUsername, userController.getPostsOfUsers)

router.route("/:username")
    .get(validateUsername, userController.getUserProfile)


export default router;
