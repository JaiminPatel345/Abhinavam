var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../models/userModel.js';
import { getEmailAndOtp, removeEmailAndOtp, setEmailAndOtp, } from '../redis/redisUtils.js';
import generateOtp from "../utils/userUtils/generateOtp.js";
import sendMail from "../utils/userUtils/sendMail.js";
import setCookies from "../utils/userUtils/getJwtToken.js";
import { encryptPassword, validatePassword } from "../utils/userUtils/passwordEncryption.js";
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, username, email, password, mobile } = req.body;
        // Check existing email
        const existingEmail = yield User.findOne({ email });
        if (existingEmail) {
            return res.status(401).json({
                success: false,
                message: `User already exists for ${email}!`
            });
        }
        // Check existing mobile
        const existingMobile = yield User.findOne({ mobile });
        if (existingMobile) {
            return res.status(401).json({
                success: false,
                message: `User already exists with this mobile number!`
            });
        }
        // Hash password and create user
        const hashedPassword = yield encryptPassword(password);
        const newUser = yield User.create({
            name,
            username,
            email,
            password: hashedPassword,
            mobile,
        });
        // Generate and send OTP
        const generatedOtp = generateOtp();
        yield Promise.all([
            sendMail(email, generatedOtp),
            setEmailAndOtp(email, generatedOtp, '10m') // Add expiration time
        ]);
        return res.status(201).json({
            success: true,
            message: 'User registered successfully. Please verify OTP.'
        });
    }
    catch (error) {
        console.error('Error in registering user:', error);
        return res.status(500).json({
            success: false,
            message: 'Error during registration'
        });
    }
});
const validateOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, givenOtp } = req.body;
    getEmailAndOtp(email)
        .then((redisData) => {
        if (!redisData) {
            throw {
                status: 400, message: 'OTP has expired'
            };
        }
        if (redisData.generatedOtp !== givenOtp) {
            throw {
                status: 400, message: 'Invalid OTP'
            };
        }
        // If OTP is valid, find and update user
        return User.findOneAndUpdate({ email }, { isEmailVerified: true }, { new: true });
    })
        .then((user) => {
        if (!user) {
            throw {
                status: 404, message: 'User not found'
            };
        }
        setCookies(res, user);
        removeEmailAndOtp(email);
        res.json({
            success: true, message: 'OTP verified successfully', user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isEmailVerified: user.isEmailVerified,
                isMobileVerified: user.isMobileVerified,
                profession: user.profession,
                interests: user.interests,
            }
        });
    })
        .catch((error) => {
        console.error('Error in OTP validation:', error);
        const statusCode = error.status || 500;
        const errorMessage = error.message || 'Error during OTP validation';
        res.status(statusCode).json({
            success: false, message: errorMessage
        });
    });
});
const validateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { identifier, password } = req.body;
    // Check if identifier is email or username
    const isEmail = identifier.includes('@');
    // Create query based on identifier type
    const query = isEmail ? { email: identifier } : { username: identifier };
    User.findOne(query)
        .select('+password') // Explicitly include password field if it's protected
        .then((user) => {
        if (!user) {
            throw {
                status: 401,
                message: `No user found with this ${isEmail ? 'email' : 'username'}`
            };
        }
        // Check if user is verified
        if (!user.isEmailVerified) {
            throw {
                status: 403, message: 'Please verify your email before logging in'
            };
        }
        // Compare password
        return validatePassword(password, user, isEmail);
    })
        .then((user) => {
        // Set JWT in HTTP-only cookie
        const token = setCookies(res, user);
        // Return user data (excluding sensitive information)
        res.json({
            success: true, message: 'Login successful', data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    about: user.about,
                    interest: user.interests,
                    profession: user.profession,
                    isEmailVerified: user.isEmailVerified,
                    isMobileVerified: user.isMobileVerified,
                },
                token
            }
        });
    })
        .catch((error) => {
        console.error('Error in user validation:', error);
        const statusCode = error.status || 500;
        const errorMessage = error.message || 'Error during login';
        res.status(statusCode).json({
            success: false, message: errorMessage
        });
    });
});
const logoutUser = (req, res) => {
    res.json({
        success: true, message: 'Logged out successfully'
    });
};
export default { registerUser, validateOtp, validateUser, logoutUser };
//# sourceMappingURL=authController.js.map