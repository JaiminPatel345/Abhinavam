import {NextFunction, Request, Response} from "express";
import {IJwtPayload} from "./user.types.js";
import {validateRegistrationInput} from "../utils/middlewares/registrationMiddlewares.js";

export interface IMiddleware {
    verifyToken: (req: RequestWithUserId, res: Response, next: NextFunction) => void | Promise<void>;
    validateRegistrationInput: (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

}

export interface RequestWithUserId extends Request {
    userId?: string
}

