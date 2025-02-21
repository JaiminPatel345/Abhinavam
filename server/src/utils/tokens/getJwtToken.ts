import jwt from 'jsonwebtoken';

//TODO: when need advance security
// export const generateAccessToken = async (userId: string): Promise<string> => {
//   const uuid = uuidv4();
//
//   await client.set(uuid, userId, {
//     EX: 60 * 30 //30 min
//   });
//
//   return jwt.sign(
//       {uuid},
//       process.env.JWT_ACCESS_SECRET as string,
//       {expiresIn: '30Minutes'}
//   );
// };

export const generateAccessToken = async (userId: string): Promise<string> => {
  return jwt.sign(
      {
        userId,
        jti: crypto.randomUUID()
      },
      process.env.JWT_ACCESS_SECRET as string,
      {expiresIn: '20Minutes'}
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
      {userId},
      process.env.JWT_REFRESH_SECRET as string,
      {expiresIn: '8Weeks'}
  );
};

export const getTokens = async (userId: string): Promise<{ accessToken: string, refreshToken: string }> => {

  const accessToken = await generateAccessToken(userId.toString());
  const refreshToken = generateRefreshToken(userId);
  return {
    accessToken,
    refreshToken
  };
};