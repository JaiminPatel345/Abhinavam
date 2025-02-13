// src/types/user.types.ts
import {Request, Response} from "express";
import mongoose, {Document} from 'mongoose';

// Custom Request types
export interface TypedRequest<T> extends Request {
  body: T;
}

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
  avatar: string;
  about?: string;
  interests?: string[];
  profession?: string;
  posts?: mongoose.Types.ObjectId[];
  isMobileVerified: boolean;
  registrationStage: 1 | 2 | 3;
  isProfileComplete: boolean;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date | null;
  loginAttempts: number;
  accountLockUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  incrementLoginAttempts(): Promise<void>;

  resetLoginAttempts(): Promise<void>;

  isAccountLocked(): boolean;

  checkProfileComplete(): boolean;
}

export interface IUserResponse {
  user: {
    id: string;
    name: string;
    email: string;
    username: string;
    about: string;
    interest: string[];
    profession: string[];
    isEmailVerified: boolean;
    isMobileVerified: boolean;
  },
  token: string;
}

export interface IRegisterUserRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  mobile?: string;
  interest?: string[];
  profession?: string[];
  about: string;
  avatar?: string;
}

export interface IValidateOtpRequest {
  email: string;
  givenOtp: string;
}

export interface IValidateUserRequest {
  identifier: string; // email or username
  password: string;
}

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  user?: T;
}

export interface IJwtPayload {
  userId: string,
  email: string,
  username: string,
  mobile?: string,
  isMobileVerified?: boolean,
}

// Controller types
export type RegisterUserController = (
    req: TypedRequest<IRegisterUserRequest>,
    res: Response
) => Promise<Response> | Response;

export type ValidateOtpController = (
    req: TypedRequest<IValidateOtpRequest>,
    res: Response
) => Promise<void>;

export type ValidateUserController = (
    req: TypedRequest<IValidateUserRequest>,
    res: Response
) => Promise<void>;

export type LogoutUserController = (
    req: Request,
    res: Response
) => void;
