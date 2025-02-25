// authController.ts
import {Request, Response} from 'express';
import User from '../models/userModel.js';
import {
  getEmailAndOtp,
  incrementWrongAttempts,
  removeEmailAndOtp
} from '../redis/redisUtils.js';
import {getTokens} from "../utils/tokens/getJwtToken.js";
import {
  encryptPassword,
  validatePassword
} from "../utils/userUtils/passwordEncryption.js";
import {
  LogoutUserController,
  ValidateUserController
} from "../types/user.types.js";
import {MongooseErrorHandler} from "../utils/errors/mongooseErrorHandler.js";
import handleOtp from "../utils/userUtils/handleOtp.js";
import {AppError, formatResponse} from "../types/custom.types.js";

// Stage 1: Initial Registration
const initiateRegistration = async (req: Request, res: Response) => {
  try {
    const {name, username, email, password} = req.body;

    // Check existing username and email
    const existingUser = await User.findOne({
      //TODO: also check for mobile
      $or: [{username}, {email}]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email ' : 'username';
      throw new AppError(`User already exists with this ${field}`, 400);
    }

    // Hash password and create temporary user
    const hashedPassword = await encryptPassword(password);
    const temporaryUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      registrationStage: 1
    });

    //Generate and send otp also set in redis
    await handleOtp(email)


    res.status(201).json(formatResponse(true, 'Registration initiated. Please verify OTP.', {user: temporaryUser}));

  } catch (error: any) {
    console.error('Error in registration initiation:', error);

    //first handle mongoose error

    if (MongooseErrorHandler.handle(error, res)) {
      res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error during registration initiation'));
    }

  }
};

// Stage 2: OTP Verification
const verifyOtp = async (req: Request, res: Response) => {
  try {
    const {email, otp} = req.body;

    const redisData = await getEmailAndOtp(email);
    if (!redisData) {
      throw new AppError('OTP has expired', 400);
    }

    if (redisData.generatedOtp !== otp) {
      await incrementWrongAttempts(email);
      throw new AppError('Invalid OTP', 400);
    }

    const user = await User.findOneAndUpdate(
        {email},
        {
          registrationStage: 2
        },
        {new: true}
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await removeEmailAndOtp(email);
    const tokens = await getTokens(user._id.toString());


    res.json(formatResponse(true, 'OTP verified successfully. Please complete your profile.', {
      user,
      tokens,

    }));

  } catch (error: any) {
    console.error('Error in OTP verification:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json(formatResponse(false, error.message));
      return
    }
    res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error during OTP verification'));
  }
};

// Stage 3: Complete Profile
const completeProfile = async (req: Request, res: Response) => {
  try {
    const {userId, about, interests, profession} = req.body;
    const avatar = req.file;


    const user = await User.findByIdAndUpdate(
        userId,
        {
          avatar,
          about,
          interests,
          profession,
          registrationStage: 3,
          isProfileComplete: true,
        },
        {new: true}
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const tokens = await getTokens(user._id.toString());

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

  } catch (error: any) {
    console.error('Error in profile completion:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json(formatResponse(false, error.message));
      return
    }
    res.status(500).json(formatResponse(false, 'Error during profile completion'));
  }
};

//Resend OTP
const resendOtp = async (req: Request, res: Response) => {
  try {
    const {email} = req.body;

    //find user
    const existingUser = await User.findOne({email});
    if (!existingUser) {
      throw new AppError('Email not registered not found', 404);
    }

    await handleOtp(email)

    res.status(200).json(formatResponse(true, ' OTP sent successfully',));


  } catch (error: any) {
    console.error('Error in resendOtp:', error);

    //first handle mongoose error
    MongooseErrorHandler.handle(error, res);

    res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error during registration initiation'));

  }
}

const validateUser: ValidateUserController = async (req: Request, res: Response) => {
  try {
    const {identifier, password} = req.body;

    if (!identifier || !password) {
      throw new AppError('Identifier and password are required', 400);
    }

    const isEmail = identifier.includes('@');
    const query = isEmail ? {email: identifier} : {username: identifier};

    const user = await User.findOne(query).select('+password');

    if (!user) {
      throw new AppError(
          `No user found with this ${isEmail ? 'email' : 'username'}`,
          401
      );
    }

    const validatedUser = await validatePassword(password, user, isEmail);

    if (user.registrationStage === 1) {
      //TODO: i am assume it is Email
      await handleOtp(identifier)
      res.status(401).json(formatResponse(false, "Account is not verified ", {
        isNeedVerifyOtpVerification: true,
        user
      }))
      return
    }
    const tokens = await getTokens(validatedUser._id.toString());

    res.json(formatResponse(true, 'Login successful', {
      user,
      tokens
    }));

  } catch (error: any) {
    console.error('Error in user validation:', error);

    res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error during login'));
  }
};

const logoutUser: LogoutUserController = async (req: Request, res: Response) => {
  try {
    //TODO:
    //advance logout
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
  resendOtp,
  validateUser,
  logoutUser
};


