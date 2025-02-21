var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
export const generateAccessToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return jwt.sign({
        userId,
        jti: crypto.randomUUID()
    }, process.env.JWT_ACCESS_SECRET, { expiresIn: '20Minutes' });
});
export const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '8Weeks' });
};
export const getTokens = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield generateAccessToken(userId.toString());
    const refreshToken = generateRefreshToken(userId);
    return {
        accessToken,
        refreshToken
    };
});
//# sourceMappingURL=getJwtToken.js.map