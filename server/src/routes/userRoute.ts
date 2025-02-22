import express from "express";
import userController from "../controllers/userController.js";
import {verifyToken} from "../utils/middlewares/IsUserLoggedIn.js";


const router = express.Router();

router.route("/")
    .patch(verifyToken , userController.updateUserProfile)

router.route("/get-signature")
    .get(verifyToken, userController.getSignature)

router.route("/:userId")
    .get(userController.getUserProfile)


router.route("/follow")
    .post(verifyToken ,userController.toggleFollowing)


export default router;
