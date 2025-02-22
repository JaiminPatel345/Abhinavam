var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../models/userModel.js';
import { getEmailAndOtp, incrementWrongAttempts, removeEmailAndOtp } from '../redis/redisUtils.js';
import { getTokens } from "../utils/tokens/getJwtToken.js";
import { encryptPassword, validatePassword } from "../utils/userUtils/passwordEncryption.js";
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { MongooseErrorHandler } from "../utils/errors/mongooseErrorHandler.js";
import handleOtp from "../utils/userUtils/handleOtp.js";
import { AppError, formatResponse } from "../types/custom.types.js";
// Stage 1: Initial Registration
const initiateRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, username, email, password } = req.body;
        // Check existing username and email
        const existingUser = yield User.findOne({
            //TODO: also check for mobile
            $or: [{ username }, { email }]
        });
        if (existingUser) {
            const field = existingUser.email === email ? 'email ' : 'username';
            throw new AppError(`User already exists with this ${field}`, 400);
        }
        // Hash password and create temporary user
        const hashedPassword = yield encryptPassword(password);
        const temporaryUser = yield User.create({
            name,
            username,
            email,
            password: hashedPassword,
            registrationStage: 1
        });
        //Generate and send otp also set in redis
        yield handleOtp(email);
        res.status(201).json(formatResponse(true, 'Registration initiated. Please verify OTP.', { user: temporaryUser }));
    }
    catch (error) {
        console.error('Error in registration initiation:', error);
        //first handle mongoose error
        if (MongooseErrorHandler.handle(error, res)) {
            res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error during registration initiation'));
        }
    }
});
// Stage 2: OTP Verification
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const redisData = yield getEmailAndOtp(email);
        if (!redisData) {
            throw new AppError('OTP has expired', 400);
        }
        if (redisData.generatedOtp !== otp) {
            yield incrementWrongAttempts(email);
            throw new AppError('Invalid OTP', 400);
        }
        const user = yield User.findOneAndUpdate({ email }, {
            registrationStage: 2
        }, { new: true });
        if (!user) {
            throw new AppError('User not found', 404);
        }
        yield removeEmailAndOtp(email);
        const tokens = yield getTokens(user._id.toString());
        res.json(formatResponse(true, 'OTP verified successfully. Please complete your profile.', {
            user,
            tokens,
        }));
    }
    catch (error) {
        console.error('Error in OTP verification:', error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json(formatResponse(false, error.message));
            return;
        }
        res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error during OTP verification'));
    }
});
// Stage 3: Complete Profile
const completeProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, about, interests, profession } = req.body;
        const avatar = req.file;
        if (!avatar) {
            throw new AppError('Profile photo is required', 400);
        }
        // Upload avatar to cloudinary
        const avatarResult = yield uploadToCloudinary(avatar.path);
        if (!avatarResult.secure_url) {
            throw new AppError('Failed to upload profile photo', 500);
        }
        const user = yield User.findByIdAndUpdate(userId, {
            avatar: avatarResult.secure_url,
            about,
            interests,
            profession,
            registrationStage: 3,
            isProfileComplete: true,
        }, { new: true });
        if (!user) {
            throw new AppError('User not found', 404);
        }
        const tokens = yield getTokens(user._id.toString());
        res.json(formatResponse(true, 'Registration completed successfully', {
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                mobile: user.mobile,
                avatar: user.avatar,
                about: user.about,
                interests: user.interests,
                professions: user.professions,
                isMobileVerified: user.isMobileVerified
            },
            tokens
        }));
    }
    catch (error) {
        console.error('Error in profile completion:', error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json(formatResponse(false, error.message));
            return;
        }
        res.status(500).json(formatResponse(false, 'Error during profile completion'));
    }
});
//Resend OTP
const resendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        //find user
        const existingUser = yield User.findOne({ email });
        if (!existingUser) {
            throw new AppError('Email not registered not found', 404);
        }
        yield handleOtp(email);
        res.status(200).json(formatResponse(true, ' OTP sent successfully'));
    }
    catch (error) {
        console.error('Error in resendOtp:', error);
        //first handle mongoose error
        MongooseErrorHandler.handle(error, res);
        res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error during registration initiation'));
    }
});
const validateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            throw new AppError('Identifier and password are required', 400);
        }
        const isEmail = identifier.includes('@');
        const query = isEmail ? { email: identifier } : { username: identifier };
        const user = yield User.findOne(query).select('+password');
        if (!user) {
            throw new AppError(`No user found with this ${isEmail ? 'email' : 'username'}`, 401);
        }
        const validatedUser = yield validatePassword(password, user, isEmail);
        if (user.registrationStage === 1) {
            //TODO: i am assume it is Email
            yield handleOtp(identifier);
            res.status(401).json(formatResponse(false, "Account is not verified ", {
                isNeedVerifyOtpVerification: true,
                user
            }));
            return;
        }
        const tokens = yield getTokens(validatedUser._id.toString());
        res.json(formatResponse(true, 'Login successful', {
            user,
            tokens
        }));
    }
    catch (error) {
        console.error('Error in user validation:', error);
        res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error during login'));
    }
});
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('token');
        return res.json(formatResponse(true, 'Logged out successfully'));
    }
    catch (error) {
        console.error('Error in logout:', error);
        return res.status(500).json(formatResponse(false, 'Error during logout'));
    }
});
export default {
    initiateRegistration,
    verifyOtp,
    completeProfile,
    resendOtp,
    validateUser,
    logoutUser
};
//# sourceMappingURL=authController.js.map