// authController.ts
import { Request, Response } from 'express';
import User from '../models/userModel.js';
import {
  getEmailAndOtp,
  removeEmailAndOtp,
  setEmailAndOtp,
  incrementWrongAttempts
} from '../redis/redisUtils.js';
import generateOtp from "../utils/userUtils/generateOtp.js";
import sendMail from "../utils/userUtils/sendMail.js";
import {setCookies} from "../utils/userUtils/getJwtToken.js";
import { encryptPassword, validatePassword } from "../utils/userUtils/passwordEncryption.js";
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { AppError, formatResponse } from '../utils/helpers.js';
import {LogoutUserController, ValidateUserController} from "../types/user.types.js";

// Stage 1: Initial Registration
const initiateRegistration = async (req: Request, res: Response) => {
  try {
    const { name, username, mobile, password } = req.body;

    // Check existing username and mobile
    const existingUser = await User.findOne({
      $or: [{ username }, { mobile }]
    });

    if (existingUser) {
      const field = existingUser.mobile === mobile ? 'mobile number' : 'username';
      throw new AppError(`User already exists with this ${field}`, 400);
    }

    // Hash password and create temporary user
    const hashedPassword = await encryptPassword(password);
    const temporaryUser = await User.create({
      name,
      username,
      mobile,
      password: hashedPassword,
      registrationStage: 1
    });

    // Generate and send OTP
    const generatedOtp = generateOtp();
    await Promise.all([
      sendMail(mobile, generatedOtp), // Assuming SMS functionality
      setEmailAndOtp(mobile, generatedOtp)
    ]);

    return res.status(201).json(formatResponse(true, 'Registration initiated. Please verify OTP.', {
      userId: temporaryUser._id
    }));

  } catch (error) {
    console.error('Error in registration initiation:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(formatResponse(false, error.message));
    }
    return res.status(500).json(formatResponse(false, 'Error during registration initiation'));
  }
};

// Stage 2: OTP Verification
const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { userId, mobile, otp } = req.body;

    const redisData = await getEmailAndOtp(mobile);
    if (!redisData) {
      throw new AppError('OTP has expired', 400);
    }

    if (redisData.generatedOtp !== otp) {
      await incrementWrongAttempts(mobile);
      throw new AppError('Invalid OTP', 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isMobileVerified: true,
        registrationStage: 2
      },
      { new: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await removeEmailAndOtp(mobile);

    return res.json(formatResponse(true, 'OTP verified successfully. Please complete your profile.', {
      userId: user._id
    }));

  } catch (error) {
    console.error('Error in OTP verification:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(formatResponse(false, error.message));
    }
    return res.status(500).json(formatResponse(false, 'Error during OTP verification'));
  }
};

// Stage 3: Complete Profile
const completeProfile = async (req: Request, res: Response) => {
  try {
    const { userId, about, interests, profession } = req.body;
    const avatar = req.file;

    if (!avatar) {
      throw new AppError('Profile photo is required', 400);
    }

    // Upload avatar to cloudinary
    const avatarResult = await uploadToCloudinary(avatar.path);
    if (!avatarResult.secure_url) {
      throw new AppError('Failed to upload profile photo', 500);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        avatar: avatarResult.secure_url,
        about,
        interests,
        profession,
        registrationStage: 3,
        isProfileComplete: true
      },
      { new: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const token = setCookies( user);

    return res.json(formatResponse(true, 'Registration completed successfully', {
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        mobile: user.mobile,
        avatar: user.avatar,
        about: user.about,
        interests: user.interests,
        profession: user.profession,
        isMobileVerified: user.isMobileVerified
      },
      token
    }));

  } catch (error:any) {
    console.error('Error in profile completion:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(formatResponse(false, error.message));
    }
    return res.status(500).json(formatResponse(false, 'Error during profile completion'));
  }
};


const validateUser: ValidateUserController = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      throw new AppError('Identifier and password are required', 400);
    }

    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier } : { username: identifier };

    const user = await User.findOne(query).select('+password');

    if (!user) {
      throw new AppError(
        `No user found with this ${isEmail ? 'email' : 'username'}`,
        401
      );
    }

    const validatedUser = await validatePassword(password, user, isEmail);
    const token = setCookies(validatedUser);

    return res.json(formatResponse(true, 'Login successful', {
      user: {
        id: validatedUser._id,
        name: validatedUser.name,
        email: validatedUser.email,
        username: validatedUser.username,
        about: validatedUser.about,
        interest: validatedUser.interests,
        profession: validatedUser.profession,
        isMobileVerified: validatedUser.isMobileVerified,
      },
      token
    }));

  } catch (error) {
    console.error('Error in user validation:', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(formatResponse(false, error.message));
    }
    return res.status(500).json(formatResponse(false, 'Error during login'));
  }
};

const logoutUser: LogoutUserController = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token');
    return res.json(formatResponse(true, 'Logged out successfully'));
  } catch (error) {
    console.error('Error in logout:', error);
    return res.status(500).json(formatResponse(false, 'Error during logout'));
  }
};


export default {
  initiateRegistration,
  verifyOtp,
  completeProfile,
  validateUser,
  logoutUser
};


