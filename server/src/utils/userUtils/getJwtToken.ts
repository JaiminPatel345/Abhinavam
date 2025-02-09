import jwt from 'jsonwebtoken';
import { IUser } from '../../types/user.types.js';

const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: '30d' }
  );
};

export const setCookies = (user: IUser): string => {
  const token = generateToken(user);
  return token;
};