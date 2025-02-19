var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import { AppError } from "../../types/custom.types.js";
const SALT_ROUNDS = 10;
export const encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt.hash(password, SALT_ROUNDS);
});
export const validatePassword = (password, user, isEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const isMatch = yield bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError(`Invalid ${isEmail ? 'Email' : 'Username'} or Password`, 401);
    }
    return user;
});
//# sourceMappingURL=passwordEncryption.js.map