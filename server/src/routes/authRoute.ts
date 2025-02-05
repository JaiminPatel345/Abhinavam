import express from "express";
import authController from '../controllers/authController.js';

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/verify-email", authController.validateOtp);
router.post("/login", authController.validateUser);
router.post("/logout", authController.logoutUser);


export default router;
