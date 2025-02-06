import {IMiddleware} from "../../types/common.types.js";
import jwt, {VerifyErrors} from "jsonwebtoken";
import {IJwtPayload} from "../../types/user.types.js";
import {Response} from "express";

export const verifyToken: IMiddleware['verifyToken'] = async (req, res, next) => {
    try {
        const bearerHeader = req.headers.authorization;

        if (!bearerHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = bearerHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        jwt.verify(
            token,
            process.env.JWT_SECRET as string,
            (err: jwt.VerifyErrors | null , decoded) => {
                if (err) {
                    return res.status(403).json({ message: "Invalid or expired token" });
                }

                req.user = decoded as IJwtPayload;
                next();
            }
        );
    } catch (error) {
        return res.status(500).json({ message: "Server error during authentication" });
    }
}