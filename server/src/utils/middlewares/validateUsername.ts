import { Request, Response, NextFunction } from 'express';
import {AppError} from "../../types/custom.types.js";

export const validateUsername = (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;

    // Check if username exists
    if (!username) {
        return next(new AppError('Username is required', 400));
    }
    //TODO: remove in production
    console.log("Username :", username);

    // Optional: Add more specific validation rules
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
        return next(new AppError('Invalid username format', 400));
    }

    // Optional: Normalize username (convert to lowercase)
    req.params.username = username.toLowerCase();

    next();
};