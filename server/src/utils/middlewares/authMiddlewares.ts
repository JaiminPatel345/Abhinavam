// authMiddlewares.ts
import {NextFunction, Request, Response} from 'express';
import {formatResponse} from "../../types/custom.types.js";

export const validateInitialRegistration = (req: Request, res: Response, next: NextFunction) => {
  const {name, username, mobile, password} = req.body;
  const errors = [];

  if (!name?.trim()) {
    errors.push('Name is required');
  }

  if (!username?.match(/^[a-zA-Z0-9_]{3,20}$/)) {
    errors.push('Username must be 3-20 characters long and contain only letters, numbers, and underscores');
  }

  if (mobile && !isValidPhoneNumber(mobile)) {
    console.log("came")
    errors.push('Invalid mobile number format');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    res.status(400).json(formatResponse(false, 'Validation failed', {errors}));
    return
  }

  next();
};

export const validateOtpVerification = (req: Request, res: Response, next: NextFunction) => {
  const {email, otp} = req.body;
  const errors = [];

  if (!email) errors.push('email is required');
  if (!otp?.match(/^\d{6}$/)) errors.push('Invalid OTP format');

  if (errors.length > 0) {
    res.status(400).json(formatResponse(false, 'Validation failed', {errors}));
    return
  }

  next();
};

export const validateProfileCompletion = (req: Request, res: Response, next: NextFunction) => {
  const {userId, about, interests, profession} = req.body;
  const errors = [];

  if (!userId) errors.push('User ID is required');
  if (!about?.trim()) errors.push('About section is required');
  if (!Array.isArray(interests) || interests.length === 0) {
    errors.push('At least one interest is required');
  }
  if (!profession?.trim()) errors.push('Profession is required');

  if (errors.length > 0) {
    res.status(400).json(formatResponse(false, 'Validation failed', {errors}));
    return
  }

  next();
};


export const validateLoginInput = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
  try {
    const {identifier, password} = req.body;
    const errors: string[] = [];

    if (!identifier) {
      errors.push('Username or email is required');
    }

    if (!password) {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      res.status(400).json(formatResponse(false, 'Validation failed', {errors}));
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

const isValidPhoneNumber = (phone: string): boolean => {
  // Remove all spaces and hyphens
  const cleanPhone = phone.replace(/[\s-]/g, '');

  // Indian number validation (+91 followed by 10 digits)
  if (cleanPhone.startsWith('+91')) {
    return /^\+91\d{10}$/.test(cleanPhone);
  }

  // General international number validation
  // 1. Must start with + followed by country code (1-3 digits)
  // 2. Followed by 6-15 digits
  return /^\+\d{1,3}\d{6,15}$/.test(cleanPhone);
};

export const isValidatedEmail = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  const {email} = req.body;
  if (!email) {
    res.status(401).json(formatResponse(false, 'Invalid email address'));
    return
  }

  //TODO: using external api check is email valid
  if (!email?.match(/^[a-zA-Z0-9]+([._-][0-9a-zA-Z]+)*@[a-zA-Z0-9]+([.-][0-9a-zA-Z]+)*\.[a-zA-Z]{2,}$/)) {
    res.status(401).json(formatResponse(false, 'Invalid email address'));
  }
  next()

}

