import {Request, Response} from "express";
import {IToggleFollowingBody, IUpdateUserProfileBody, IUser, TypedRequest} from "../types/user.types.js";
import {AppError, formatResponse} from "../types/custom.types.js";
import User from "../models/userModel.js";
import INTERESTS from '../utils/userUtils/interested.js';
import PROFESSIONS from '../utils/userUtils/professions.js';
import {signUploadUserWidget} from "../utils/userUtils/cloudinarySignature.js";


const updateUserProfile = async (
    req: TypedRequest<IUpdateUserProfileBody>,
    res: Response
) => {
  try {
    const {about, interests, profession, avatar} = req.body;
    const userId = req.userId;

    // Find the user
    const user = await User.findById(userId);
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

      const invalidInterests = interests.filter(
          interest => !INTERESTS.includes(interest)
      );
      if (invalidInterests.length > 0) {
        throw new AppError(
            `Invalid interests: ${invalidInterests.join(", ")}`,
            400
        );
      }
      user.interests = interests;
    }

    // Validate and update profession
    if (profession !== undefined) {
      const invalidProfessions = profession.filter(
          prof => !PROFESSIONS.includes(prof)
      );
      if (invalidProfessions.length > 0) {
        throw new AppError(
            `Invalid professions: ${invalidProfessions.join(", ")}`,
            400
        );
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
    await user.save();

    // Return the updated user without sensitive information
    res.status(200).json(
        formatResponse(true, "Profile updated successfully", {
          user: {
            about: user.about,
            interests: user.interests,
            profession: user.profession,
            avatar: user.avatar,
            isProfileComplete: user.isProfileComplete
          }
        })
    );

  } catch (error: any) {
    console.error('Error in updating user profile:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(
            false,
            error.message || 'Error updating user profile'
        )
    );
  }
};

// Get user profile details
const getUserProfile = async (req: TypedRequest<{}>, res: Response) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId)
        .select('name username email about interests profession avatar isProfileComplete')
        .lean();

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json(
        formatResponse(true, "Profile fetched successfully", {user})
    );

  } catch (error: any) {
    console.error('Error in fetching user profile:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(
            false,
            error.message || 'Error fetching user profile'
        )
    );
  }
};

const toggleFollowing = async (
    req: TypedRequest<IToggleFollowingBody>,
    res: Response
) => {
  try {
    const {userToFollow} = req.body;
    const userId = req.userId;

    if (!userToFollow) {
      throw new AppError("Invalid body", 400);
    }

    if (userId === userToFollow) {
      throw new AppError("Can't follow yourself", 400);
    }

    const [followUser, user] = await Promise.all([
      User.findById(userToFollow),
      User.findById(userId),
    ]) as [IUser | null, IUser | null];

    if (!followUser || !user) {
      throw new AppError("User not found", 404);
    }

    // Convert to string for comparison
    const isFollowing = user.following.some(id =>
        id.toString() === followUser._id.toString()
    );

    if (isFollowing) {
      // Unfollow - use proper MongoDB operations
      await User.findByIdAndUpdate(userId, {
        $pull: {following: followUser._id}
      });
      await User.findByIdAndUpdate(userToFollow, {
        $pull: {followers: user._id}
      });
    } else {
      // Follow - use proper MongoDB operations
      await User.findByIdAndUpdate(userId, {
        $addToSet: {following: followUser._id}
      });
      await User.findByIdAndUpdate(userToFollow, {
        $addToSet: {followers: user._id}
      });
    }

    res.status(200).json(
        formatResponse(
            true,
            isFollowing ? "Unfollowed successfully" : "Followed successfully"
        )
    );

  } catch (error: any) {
    console.error('Error in toggle following:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(
            false,
            error.message || 'Error toggling follow status'
        )
    );
  }
};

const getSignature = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const mode = req.params.mode || 'profile';
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    const data = signUploadUserWidget(userId.toString() , mode);
    if (!data) {
      throw new AppError("Error to generate signature", 500);
    }
    res.json(formatResponse(true, "Signature successfully generated", data))

  } catch (error: any) {
    console.error('Error in getSignature:', error);
    res.status(error.statusCode || 500).json(formatResponse(false, error.message || "Error to generate signature"));

  }
}

export default {
  updateUserProfile,
  getUserProfile,
  toggleFollowing,
  getSignature,

};
