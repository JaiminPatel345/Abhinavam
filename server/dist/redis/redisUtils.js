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
import { AppError } from "../types/custom.types.js";
const MAX_OTP_ATTEMPTS = 3;
const OTP_EXPIRY_SECONDS = 60 * 10; // 10 minutes
/**
 * Sets email and OTP data in Redis with expiration
 */
export const setEmailAndOtp = (email, generatedOtp) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email || !generatedOtp) {
        throw new Error('Email and OTP are required');
    }
    try {
        const payload = {
            email,
            generatedOtp,
            wrongAttempts: 0,
            createdAt: new Date().toISOString()
        };
        const response = yield client.set(`otp:${email}`, JSON.stringify(payload), {
            EX: OTP_EXPIRY_SECONDS
        });
        if (response !== 'OK') {
            throw new Error('Failed to set OTP data in Redis');
        }
        return true;
    }
    catch (error) {
        console.error('Error setting OTP data in Redis:', error);
        throw new Error('Failed to store OTP data');
    }
});
/**
 * Retrieves email and OTP data from Redis
 */
export const getEmailAndOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email) {
        throw new Error('Email is required');
    }
    try {
        const response = yield client.get(`otp:${email}`);
        if (!response) {
            return null;
        }
        const data = JSON.parse(response);
        // Check if max attempts exceeded
        if (data.wrongAttempts >= MAX_OTP_ATTEMPTS) {
            yield removeEmailAndOtp(email);
            throw new AppError('Maximum OTP attempts exceeded', 400);
        }
        return data;
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            console.error('Invalid JSON data in Redis:', error);
            yield removeEmailAndOtp(email);
            return null;
        }
        console.error('Error retrieving OTP data from Redis:', error);
        throw error;
    }
});
/**
 * Increments the wrong attempts counter for an OTP
 */
export const incrementWrongAttempts = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield getEmailAndOtp(email);
        if (!data) {
            return false;
        }
        const updatedData = Object.assign(Object.assign({}, data), { wrongAttempts: (data.wrongAttempts || 0) + 1 });
        yield client.set(`otp:${email}`, JSON.stringify(updatedData), {
            EX: OTP_EXPIRY_SECONDS
        });
        return true;
    }
    catch (error) {
        console.error('Error incrementing wrong attempts:', error);
        throw error;
    }
});
/**
 * Removes email and OTP data from Redis
 */
export const removeEmailAndOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email) {
        throw new Error('Email is required');
    }
    try {
        const response = yield client.del(`otp:${email}`);
        return response === 1;
    }
    catch (error) {
        console.error('Error removing OTP data from Redis:', error);
        throw new Error('Failed to remove OTP data');
    }
});
//# sourceMappingURL=redisUtils.js.map