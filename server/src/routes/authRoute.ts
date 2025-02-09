import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import authController from "../controllers/authController.js";
import {
  validateInitialRegistration,
  validateOtpVerification,
  validateProfileCompletion,
  validateLoginInput,
} from "../utils/middlewares/authMiddlewares.js";
import { isAuthenticated } from "../utils/middlewares/authMiddlewares.js";

const router = express.Router();

// Configure multer
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Routes
router.post(
  "/register/init",
  validateInitialRegistration,
  authController.initiateRegistration
);

router.post(
  "/register/verify-otp",
  validateOtpVerification,
  authController.verifyOtp
);

router.post(
  "/register/complete-profile",
  isAuthenticated,
  upload.single("avatar"),
  validateProfileCompletion,
  authController.completeProfile
);

router.post("/login", validateLoginInput, authController.validateUser);

router.post("/logout", isAuthenticated, authController.logoutUser);

export default router;