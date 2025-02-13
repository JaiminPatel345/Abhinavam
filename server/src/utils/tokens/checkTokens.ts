import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {formatResponse, AppError} from "../../types/custom.types.js";


const checkTokens = (req: Request, res: Response, SECRET: string): Promise<string> => {
  const bearerHeader = req.headers.authorization;

  // Check if the authorization header is present
  if (!bearerHeader) {
    throw new AppError("No token provided", 401);
  }

  // Extract the token from the header
  const token = bearerHeader.split(" ")[1];
  if (!token) {
    throw new AppError("Invalid token format", 401);
  }


  // Return a Promise to handle the asynchronous verification
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) {
        reject(new AppError("Invalid or expired token", 403));
      } else {
        resolve(decoded.userId || decoded.uuid as string);
      }
    });
  });
};

export default checkTokens;