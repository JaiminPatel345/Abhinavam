import express from "express";
import multer from "multer";
import authController from "../controllers/authController.js";
import {
   isValidatedEmail,
  validateInitialRegistration,
  validateLoginInput,
  validateOtpVerification,
  validateProfileCompletion,
} from "../utils/middlewares/authMiddlewares.js";
import {verifyToken} from "../utils/middlewares/IsUserLoggedIn.js";

const router = express.Router();

// Configure multer
const upload = multer({
  dest: "uploads/",
  limits: {fileSize: 5 * 1024 * 1024}, // 5MB
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
    isValidatedEmail,
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
    verifyToken,
    upload.single("avatar"),
    validateProfileCompletion,
    authController.completeProfile
);

router.post("/register/resend-otp",
    isValidatedEmail,
    authController.resendOtp
);

router.post("/login", validateLoginInput, authController.validateUser);

router.post("/logout", verifyToken, authController.logoutUser);

export default router;
