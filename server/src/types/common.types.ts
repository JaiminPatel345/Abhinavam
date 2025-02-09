import {NextFunction, Request, Response} from "express";
import {IJwtPayload} from "./user.types.js";
import {validateRegistrationInput} from "../utils/middlewares/registrationMiddlewares.js";

export interface IMiddleware {
    verifyToken: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<Response | void>;
    validateRegistrationInput: (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

}

export interface RequestWithUser extends Request {
    user?: IJwtPayload
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
}