import express from "express";
import userController from "../controllers/userController.js";
import {verifyToken} from "../utils/middlewares/IsUserLoggedIn.js";


const router = express.Router();

router.route("/")
    .get(verifyToken, userController.getMyProfile)
    .patch(verifyToken, userController.updateUserProfile)

router.route("/get-signature")
    .get(verifyToken, userController.getSignature)

router.route("/follow")
    .post(verifyToken, userController.toggleFollowing)

router.route("/:userId")
    .get(userController.getUserProfile)


export default router;
