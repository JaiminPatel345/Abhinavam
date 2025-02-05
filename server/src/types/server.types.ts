import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export interface CustomError extends Error {
  status?: number;
  code?: string;
}

export type CustomErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => void;