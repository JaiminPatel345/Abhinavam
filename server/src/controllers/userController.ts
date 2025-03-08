import {Request, Response} from "express";
import {
  ICompleteProfilePayload,
  IToggleFollowingBody,
  TypedRequest
} from "../types/user.types.js";
import {AppError, formatResponse} from "../types/custom.types.js";
import User from "../models/userModel.js";
import INTERESTS from '../utils/userUtils/interested.js';
import PROFESSIONS from '../utils/userUtils/professions.js';
import {signUploadUserWidget} from "../utils/cloudinarySignature.js";
import mongoose from "mongoose";

const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new AppError('Unauthorized', 401)
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('Unauthorized', 401)
    }
    res.json(formatResponse(true, '', user));

  } catch (error: any) {
    console.error('Error in my profile:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(
            false,
            error.message || 'Error to get user profile'
        )
    );
  }
}

const updateUserProfile = async (
    req: TypedRequest<ICompleteProfilePayload>,
    res: Response
) => {
  try {
    const {about, interests, professions, avatar, tagline} = req.body;
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
    if (professions !== undefined) {
      const invalidProfessions = professions.filter(
          prof => !PROFESSIONS.includes(prof)
      );
      if (invalidProfessions.length > 0) {
        throw new AppError(
            `Invalid professions: ${invalidProfessions.join(", ")}`,
            400
        );
      }
      user.professions = professions;
    }

    // Update avatar
    if (avatar !== undefined && avatar.url !== undefined && avatar.public_id !== undefined) {
      // You might want to add URL validation here
      user.avatar = avatar;
    }

    if (tagline !== undefined) {
      user.tagline = tagline;
    }

    // Save the updated user
    // The pre-save middleware will automatically update isProfileComplete
    await user.save();

    // Return the updated user without sensitive information
    res.status(200).json(
        formatResponse(true, "Profile updated successfully", {
          user
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
    const username = req.params.username;

    const user = await User.findOne({username})
        .select('name username email about interests professions avatar isProfileComplete followers following posts ')
        .lean();

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json(
        formatResponse(true, "Profile fetched successfully", user)
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

// const toggleFollowing = async (
//     req: TypedRequest<IToggleFollowingBody>,
//     res: Response
// ) => {
//   try {
//     const {userId: userToFollow} = req.body;
//     const userId = req.userId;
//
//     if (!userToFollow) {
//       throw new AppError("Invalid body", 400);
//     }
//
//     if (userId === userToFollow) {
//       throw new AppError("Can't follow yourself", 400);
//     }
//
//     // Use aggregation to perform the follow/unfollow in a single atomic operation
//     const result = await User.findOneAndUpdate(
//         {
//           _id: userId,
//           following: {$elemMatch: {$eq: userToFollow}}
//         },
//         [
//           {
//             $set: {
//               // If currently following, remove; if not following, add
//               following: {
//                 $cond: {
//                   if: {$in: [userToFollow, "$following"]},
//                   then: {$setDifference: ["$following", [userToFollow]]},
//                   else: {$concatArrays: ["$following", [userToFollow]]}
//                 }
//               }
//             }
//           }
//         ],
//         {
//           new: true,  // Return the updated document
//           projection: {following: 1}  // Only return the following array
//         }
//     );
//
//     // Perform a similar update for the user being followed
//     await User.findOneAndUpdate(
//         {
//           _id: userToFollow,
//           followers: {$elemMatch: {$eq: userId}}
//         },
//         [
//           {
//             $set: {
//               followers: {
//                 $cond: {
//                   if: {$in: [userId, "$followers"]},
//                   then: {$setDifference: ["$followers", [userId]]},
//                   else: {$concatArrays: ["$followers", [userId]]}
//                 }
//               }
//             }
//           }
//         ]
//     );
//
//     // Determine if the user was following or unfollowing
//     const isFollowing = result?.following.includes(new mongoose.Types.ObjectId(userToFollow));
//
//     res.status(200).json(
//         formatResponse(
//             true,
//             isFollowing ? "Followed successfully" : "Unfollowed successfully"
//         )
//     );
//
//   } catch (error: any) {
//     console.error('Error in toggle following:', error);
//     res.status(error.statusCode || 500).json(
//         formatResponse(
//             false,
//             error.message || 'Error toggling follow status'
//         )
//     );
//   }
// };

const toggleFollowing = async (
    req: TypedRequest<IToggleFollowingBody>,
    res: Response
) => {
  try {


    const {userId: userToFollow} = req.body;
    const userId = req.userId;

    // Validate input
    if (!userToFollow) {
      throw new AppError("Invalid body", 400);
    }

    if (userId === userToFollow) {
      throw new AppError("Can't follow yourself", 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        [
          {
            $set: {
              following: {
                $cond: {
                  if: {$in: [userToFollow, "$following"]},
                  then: {$setDifference: ["$following", [userToFollow]]},
                  else: {$concatArrays: ["$following", [userToFollow]]}
                }
              }
            }
          }
        ],
        {
          new: true,  // Return updated document
          runValidators: true  // Run model validations,

        }
    ).select("username avatar name");

    // Parallel update for followers
    const updatedFollowedUser = await User.findByIdAndUpdate(
        userToFollow,
        [
          {
            $set: {
              followers: {
                $cond: {
                  if: {$in: [userId, "$followers"]},
                  then: {$setDifference: ["$followers", [userId]]},
                  else: {$concatArrays: ["$followers", [userId]]}
                }
              }
            }
          }
        ],
        {
          new: true,
          runValidators: true
        }
    );

    // Verify both users exist
    if (!updatedUser || !updatedFollowedUser) {
      throw new AppError("User not found", 404);
    }

    // Determine follow status
    const isFollowing = updatedUser.following.includes(new mongoose.Types.ObjectId(userToFollow));

    // Commit the transaction

    res.status(200).json(
        formatResponse(
            true,
            isFollowing ? "Followed successfully" : "Unfollowed successfully",
            {isFollowing}
        )
    );

  } catch (error: any) {
    // Abort the transaction on error

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
    const data = signUploadUserWidget(userId.toString(), mode);
    if (!data) {
      throw new AppError("Error to generate signature", 500);
    }
    res.json(formatResponse(true, "Signature successfully generated", data))

  } catch (error: any) {
    console.error('Error in getSignature:', error);
    res.status(error.statusCode || 500).json(formatResponse(false, error.message || "Error to generate signature"));

  }
}

const getPostsOfUsers = async (req: Request, res: Response) => {
  try {
    const {username} = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await User.aggregate([
      // Match specific user
      {$match: {username}},

      // First, capture the user info we need
      {
        $project: {
          username: 1,
          avatar: 1,
          posts: 1
        }
      },

      // Lookup to get posts
      {
        $lookup: {
          from: "posts",
          localField: "posts",
          foreignField: "_id",
          as: "userPosts"
        }
      },

      // Unwind to flatten the posts array
      {$unwind: "$userPosts"},

      // Skip and limit for pagination
      {$skip: (page - 1) * limit},
      {$limit: limit},

      // Add the user fields to the post
      {
        $addFields: {
          "userPosts.owner": {
            _id: "$_id",
            username: "$username",
            avatar: "$avatar"
          }
        }
      },

      // Replace the root with the post document
      {$replaceRoot: {newRoot: "$userPosts"}}
    ]);


    res.json(formatResponse(true, "done", {
      posts: result,
      hasMore: result.length === limit
    }));

  } catch (error: any) {
    console.error('Error in getMyPosts:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(false, error.message || "Error to get posts",)
    )
  }
}

const updateAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new AppError("User not found", 404);
    }
    const avatar = req.body.avatar
    await User.findByIdAndUpdate(userId, {
      avatar
    }).lean()
    res.json(formatResponse(true, "Image successfully updated"))
  } catch (error: any) {
    console.error('Error in updateAvatar:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(false, error.message || "Error to updateAvatar",)
    )
  }
}

const getFollowing = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    if (!username) {
      throw new AppError("User not found", 404);
    }

    const result = await User.aggregate([
      // Match the user by username
      {$match: {username}},

      // Lookup to get following users
      {
        $lookup: {
          from: 'users', // Make sure this matches your users collection name
          localField: 'following',
          foreignField: '_id',
          as: 'followingUsers'
        }
      },

      // Project to shape the output
      {
        $project: {
          _id: 0,
          following: {
            $map: {
              input: '$followingUsers',
              as: 'user',
              in: {
                username: '$$user.username',
                name: '$$user.name',
                avatar: '$$user.avatar'
              }
            }
          },
          followingCount: {$size: '$following'}
        }
      }
    ]);

    // Return the result or an empty array if no user found
    const followingData = result[0] || {following: [], followingCount: 0};

    res.status(200).json(formatResponse(true, "Following list retrieved successfully", followingData));
  } catch (error: any) {
    console.error('Error in getFollowing:', error);
    res.status(error.statusCode || 500).json(formatResponse(false, error.message || "Error getting following list"));
  }
};

const getFollowers = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    if (!username) {
      throw new AppError("User not found", 404);
    }

    const result = await User.aggregate([
      // Match the user by username
      {$match: {username}},

      // Lookup to get followers
      {
        $lookup: {
          from: 'users', // Make sure this matches your users collection name
          localField: 'followers',
          foreignField: '_id',
          as: 'followerUsers'
        }
      },

      // Project to shape the output
      {
        $project: {
          _id: 0,
          followers: {
            $map: {
              input: '$followerUsers',
              as: 'user',
              in: {
                username: '$$user.username',
                name: '$$user.name',
                avatar: '$$user.avatar'
              }
            }
          },
          followersCount: {$size: '$followers'}
        }
      }
    ]);

    // Return the result or an empty array if no user found
    const followersData = result[0] || {followers: [], followersCount: 0};

    res.status(200).json(formatResponse(true, "Followers list retrieved successfully", followersData));
  } catch (error: any) {
    console.error('Error in getFollowers:', error);
    res.status(error.statusCode || 500).json(formatResponse(false, error.message || "Error getting followers list"));
  }
};


export default {
  updateUserProfile,
  getUserProfile,
  toggleFollowing,
  getSignature,
  getMyProfile,
  getPostsOfUsers,
  updateAvatar,
  getFollowers,
  getFollowing,

}
