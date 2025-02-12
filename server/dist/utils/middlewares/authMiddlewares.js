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
import User from '../../models/userModel.js';
import { formatResponse } from "../formatResponse.js";
export const validateInitialRegistration = (req, res, next) => {
    const { name, username, mobile, password } = req.body;
    const errors = [];
    if (!(name === null || name === void 0 ? void 0 : name.trim())) {
        errors.push('Name is required');
    }
    if (!(username === null || username === void 0 ? void 0 : username.match(/^[a-zA-Z0-9_]{3,20}$/))) {
        errors.push('Username must be 3-20 characters long and contain only letters, numbers, and underscores');
    }
    if (mobile && !isValidPhoneNumber(mobile)) {
        console.log("came");
        errors.push('Invalid mobile number format');
    }
    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    if (errors.length > 0) {
        res.status(400).json(formatResponse(false, 'Validation failed', { errors }));
        return;
    }
    next();
};
export const validateOtpVerification = (req, res, next) => {
    const { email, otp } = req.body;
    const errors = [];
    if (!email)
        errors.push('email is required');
    if (!(otp === null || otp === void 0 ? void 0 : otp.match(/^\d{6}$/)))
        errors.push('Invalid OTP format');
    if (errors.length > 0) {
        res.status(400).json(formatResponse(false, 'Validation failed', { errors }));
        return;
    }
    next();
};
export const validateProfileCompletion = (req, res, next) => {
    const { userId, about, interests, profession } = req.body;
    const errors = [];
    if (!userId)
        errors.push('User ID is required');
    if (!(about === null || about === void 0 ? void 0 : about.trim()))
        errors.push('About section is required');
    if (!Array.isArray(interests) || interests.length === 0) {
        errors.push('At least one interest is required');
    }
    if (!(profession === null || profession === void 0 ? void 0 : profession.trim()))
        errors.push('Profession is required');
    if (errors.length > 0) {
        res.status(400).json(formatResponse(false, 'Validation failed', { errors }));
        return;
    }
    next();
};
export const validateLoginInput = (req, res, next) => {
    try {
        const { identifier, password } = req.body;
        const errors = [];
        if (!identifier) {
            errors.push('Username or mobile number is required');
        }
        if (!password) {
            errors.push('Password is required');
        }
        if (errors.length > 0) {
            res.status(400).json(formatResponse(false, 'Validation failed', { errors }));
            return;
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
export const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            res.status(401).json(formatResponse(false, 'No auth token'));
            return;
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = yield User.findById(decoded.id);
            if (!user) {
                res.status(401).json(formatResponse(false, 'User not found'));
                return;
            }
            if (user.status !== 'active') {
                res.status(403).json(formatResponse(false, 'Account is not active. Please contact support.'));
                return;
            }
            if (user.isAccountLocked()) {
                res.status(403).json(formatResponse(false, 'Account is temporarily locked. Please try again later.'));
                return;
            }
            // Attach user to request object
            req.user = user;
            next();
        }
        catch (error) {
            res.status(401).json(formatResponse(false, 'Invalid or expired token'));
            return;
        }
    }
    catch (error) {
        next(error);
    }
});
const isValidPhoneNumber = (phone) => {
    // Remove all spaces and hyphens
    const cleanPhone = phone.replace(/[\s-]/g, '');
    // Indian number validation (+91 followed by 10 digits)
    if (cleanPhone.startsWith('+91')) {
        return /^\+91\d{10}$/.test(cleanPhone);
    }
    // General international number validation
    // 1. Must start with + followed by country code (1-3 digits)
    // 2. Followed by 6-15 digits
    return /^\+\d{1,3}\d{6,15}$/.test(cleanPhone);
};
export const isValidatedEmail = (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        res.status(401).json(formatResponse(false, 'Invalid email address'));
        return;
    }
    //TODO: using external api check is email valid
    if (!(email === null || email === void 0 ? void 0 : email.match(/^[a-zA-Z0-9]+([._-][0-9a-zA-Z]+)*@[a-zA-Z0-9]+([.-][0-9a-zA-Z]+)*\.[a-zA-Z]{2,}$/))) {
        res.status(401).json(formatResponse(false, 'Invalid email address'));
    }
    next();
};
//# sourceMappingURL=authMiddlewares.js.map