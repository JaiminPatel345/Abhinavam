import jwt from "jsonwebtoken";
import {IJwtPayload, IUser} from "../../types/user.types.js";
import {Response} from "express";

const JWT_SECRET = process.env.JWT_SECRET as string;

const getJwtToken = (res: Response, user: IUser) => {
    return jwt.sign(
        {userId: user._id, email: user.email, username: user.username} as IJwtPayload,
        JWT_SECRET,
        // { expiresIn: '1y' }
    );

}

export default getJwtToken;