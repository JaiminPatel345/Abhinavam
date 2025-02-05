var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { client } from "./redis.js";
export const setEmailAndOtp = (email, generatedOtp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = {
            email: email,
            generatedOtp,
            wrongTry: 0,
        };
        const response = yield client.set(email, JSON.stringify(payload), {
            EX: 60 * 10,
        });
        console.log('Reply from Redis:', response);
    }
    catch (error) {
        console.log('Error to set in redis' + error);
    }
});
export const getEmailAndOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield client.get(email);
        return yield JSON.parse(response);
    }
    catch (error) {
        console.log('Error in getEmailAndOtp', error);
    }
});
export const removeEmailAndOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield client.del(email);
    }
    catch (error) {
        console.log('Error in delEmailAndOtp', error);
    }
});
//# sourceMappingURL=redisUtils.js.map