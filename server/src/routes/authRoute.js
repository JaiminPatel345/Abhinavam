import express from "express";
const router = express.Router();
import authController from '../controllers/authController.js';

router.post("/register", authController.registerUser);
router.post("/verify-email", authController.validateOtp);
router.post("/login", authController.validateUser);
router.post("/logout", authController.logoutUser);


export default router;
