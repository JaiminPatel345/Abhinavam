// src/types/user.types.ts
import {Request, Response} from "express";
import mongoose, {Document, Types} from 'mongoose';

// Custom Request types
export interface TypedRequest<T> extends Request {
  body: T;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId,
  name: string;
  username: string;
  email: string;
  mobile?: string;
  password: string;
  avatar: {
    url: string;
    public_id: string;
  };
  tagline?: string;
  about?: string;
  interests?: string[];
  professions?: string[];
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
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


export interface IRegisterUserRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  mobile?: string;
  interests?: string[];
  professions?: string[];
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

export interface IToggleFollowingBody {
  userToFollow: string;
}


export type UserDocument = Document<unknown, {}, IUser> & IUser & {
  _id: Types.ObjectId; // Explicitly define _id as ObjectId
  __v: number;         // Include the version key
} | null;


export interface ICompleteProfilePayload{
      avatar?: {
        url: string,
        public_id: string,
      },
      tagline?: string,
      about?: string,
      interests?: string[],
      professions?: string[]
    }