import jwt from 'jsonwebtoken';
import {IUser} from '../../types/user.types.js';
import {v4 as uuidv4} from 'uuid';
import {client} from "../../redis/redis.js";

export const generateAccessToken = async (userId: string): Promise<string> => {
  const uuid = uuidv4();

  await client.set(uuid, userId, {
    EX: 60 * 30 //30 min
  });

  return jwt.sign(
      {uuid},
      process.env.JWT_ACCESS_SECRET as string,
      {expiresIn: '30Minutes'}
  );
};

export const generateRefreshToken = (userId:string): string => {
  return jwt.sign(
      {userId},
      process.env.JWT_REFRESH_SECRET as string,
      {expiresIn: '4Weeks'}
  );
};

export const getTokens = async (userId:string): Promise<{ accessToken: string, refreshToken: string }> => {

  const accessToken = await generateAccessToken(userId.toString());
  const refreshToken = generateRefreshToken(userId);
  return {
    accessToken,
    refreshToken
  };
};