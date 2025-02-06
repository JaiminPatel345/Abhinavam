import {NextFunction, Request, Response} from "express";
import {IJwtPayload} from "./user.types.js";

export interface IMiddleware {
    verifyToken: (req: RequestWithUser, res: Response, next: NextFunction) => Promise<Response | void>;
}

export interface RequestWithUser extends Request {
    user?: IJwtPayload
}