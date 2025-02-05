import jwt from "jsonwebtoken";
import {IUser} from "../../types/user.types.js";
import {Request , Response} from "express";

const JWT_SECRET = process.env.JWT_SECRET as string;
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: "strict" as const,
  //Want to save it permanent
  // maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days
};

export const clearCookies = (res:Response) => {
  res.clearCookie('authToken', {
    ...COOKIE_OPTIONS,
    maxAge: 0
  });

}

const setCookies = (  res:Response , user:IUser ) => {
   const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        // { expiresIn: '1y' }
      );

      // Set JWT in HTTP-only cookie
      res.cookie('authToken', token, COOKIE_OPTIONS);
}

export default setCookies;