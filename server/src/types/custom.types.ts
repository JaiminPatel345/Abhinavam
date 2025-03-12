// types/custom.types.ts
import { Request, Response } from 'express';
import {TypedRequestWithParams} from "./request.types.js";

export interface TypedRequestBody<T> extends Request {
  body: T;
  userId?: string;
}

// utils/AppError.ts
export class AppError extends Error {
  statusCode: number;
  status: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

// utils/response.utils.ts
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export const formatResponse = <T>(
  success: boolean,
  message: string,
  data?: T
): ApiResponse<T> => ({
  success,
  message,
  data
});