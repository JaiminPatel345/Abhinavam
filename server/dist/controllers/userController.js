var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AppError, formatResponse } from "../types/custom.types.js";
import User from "../models/userModel.js";
import INTERESTS from '../utils/userUtils/interested.js';
import PROFESSIONS from '../utils/userUtils/professions.js';
import { signUploadUserWidget } from "../utils/userUtils/cloudinarySignature.js";
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { about, interests, profession, avatar } = req.body;
        const userId = req.userId;
        // Find the user
        const user = yield User.findById(userId);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        // Validate and update about
        if (about !== undefined) {
            if (about.length > 1500) {
                throw new AppError("About section cannot exceed 1500 characters", 400);
            }
            user.about = about.trim();
        }
        // Validate and update interests
        if (interests !== undefined) {
            const invalidInterests = interests.filter(interest => !INTERESTS.includes(interest));
            if (invalidInterests.length > 0) {
                throw new AppError(`Invalid interests: ${invalidInterests.join(", ")}`, 400);
            }
            user.interests = interests;
        }
        // Validate and update profession
        if (profession !== undefined) {
            const invalidProfessions = profession.filter(prof => !PROFESSIONS.includes(prof));
            if (invalidProfessions.length > 0) {
                throw new AppError(`Invalid professions: ${invalidProfessions.join(", ")}`, 400);
            }
            user.profession = profession;
        }
        // Update avatar
        if (avatar !== undefined && avatar.url !== undefined && avatar.public_id === undefined) {
            // You might want to add URL validation here
            user.avatar = avatar;
        }
        // Save the updated user
        // The pre-save middleware will automatically update isProfileComplete
        yield user.save();
        // Return the updated user without sensitive information
        res.status(200).json(formatResponse(true, "Profile updated successfully", {
            user: {
                about: user.about,
                interests: user.interests,
                profession: user.profession,
                avatar: user.avatar,
                isProfileComplete: user.isProfileComplete
            }
        }));
    }
    catch (error) {
        console.error('Error in updating user profile:', error);
        res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error updating user profile'));
    }
});
// Get user profile details
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const user = yield User.findById(userId)
            .select('name username email about interests profession avatar isProfileComplete')
            .lean();
        if (!user) {
            throw new AppError("User not found", 404);
        }
        res.status(200).json(formatResponse(true, "Profile fetched successfully", { user }));
    }
    catch (error) {
        console.error('Error in fetching user profile:', error);
        res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error fetching user profile'));
    }
});
const toggleFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userToFollow } = req.body;
        const userId = req.userId;
        if (!userToFollow) {
            throw new AppError("Invalid body", 400);
        }
        if (userId === userToFollow) {
            throw new AppError("Can't follow yourself", 400);
        }
        const [followUser, user] = yield Promise.all([
            User.findById(userToFollow),
            User.findById(userId),
        ]);
        if (!followUser || !user) {
            throw new AppError("User not found", 404);
        }
        // Convert to string for comparison
        const isFollowing = user.following.some(id => id.toString() === followUser._id.toString());
        if (isFollowing) {
            // Unfollow - use proper MongoDB operations
            yield User.findByIdAndUpdate(userId, {
                $pull: { following: followUser._id }
            });
            yield User.findByIdAndUpdate(userToFollow, {
                $pull: { followers: user._id }
            });
        }
        else {
            // Follow - use proper MongoDB operations
            yield User.findByIdAndUpdate(userId, {
                $addToSet: { following: followUser._id }
            });
            yield User.findByIdAndUpdate(userToFollow, {
                $addToSet: { followers: user._id }
            });
        }
        res.status(200).json(formatResponse(true, isFollowing ? "Unfollowed successfully" : "Followed successfully"));
    }
    catch (error) {
        console.error('Error in toggle following:', error);
        res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error toggling follow status'));
    }
});
const getSignature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const mode = req.params.mode || 'profile';
        if (!userId) {
            throw new AppError("Unauthorized", 401);
        }
        const data = signUploadUserWidget(userId.toString(), mode);
        if (!data) {
            throw new AppError("Error to generate signature", 500);
        }
        res.json(formatResponse(true, "Signature successfully generated", data));
    }
    catch (error) {
        console.error('Error in getSignature:', error);
        res.status(error.statusCode || 500).json(formatResponse(false, error.message || "Error to generate signature"));
    }
});
export default {
    updateUserProfile,
    getUserProfile,
    toggleFollowing,
    getSignature,
};
//# sourceMappingURL=userController.js.map