// src/types/user.types.ts
import {Request, Response} from "express";

// Custom Request types
export interface TypedRequest<T> extends Request {
    body: T;
}

export interface IUser {
    _id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    mobile?: string;
    about: string;
    interests: string[];
    profession: string[];
    isEmailVerified: boolean;
    isMobileVerified: boolean;
    avatar: string | null;
    lastLogin: Date | null;
    status: 'active' | 'inactive' | 'suspended';
    loginAttempts: number;
    accountLockUntil: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserResponse {
    id: string;
    name: string;
    email: string;
    username: string;
    about: string;
    interest: string[];
    profession: string[];
    isEmailVerified: boolean;
    isMobileVerified: boolean;
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

// Controller types
export type RegisterUserController = (
    req: TypedRequest<IRegisterUserRequest>,
    res: Response
) => Promise<void>;

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
