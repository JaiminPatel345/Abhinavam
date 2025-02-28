import {Request, Response} from 'express';
import {
  AppError,
  formatResponse,
  TypedRequestBody
} from "../types/custom.types.js";
import {IReaction, Post} from "../models/postModel.js";
import {
  CreatePostBody,
  ReactionBody,
  UpdatePostBody
} from "../types/post.types.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";

const {ObjectId} = mongoose.Types;


// Create a new post
const createPost = async (req: TypedRequestBody<CreatePostBody>, res: Response) => {
  try {
    const {description, tags, location, media} = req.body;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const postData = {
      description,
      owner: userId,
      tags: tags || [],
      location: location || {},
      media: media || [],
    };

    const post = await Post.create(postData);
    await User.findByIdAndUpdate(userId, {$push: {posts: post._id}});

    res.status(201).json(formatResponse(true, 'Post created successfully', post));
  } catch (error: any) {
    console.error('Error in post creation:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(false, error.message || 'Error creating post')
    );
  }
}

// Get single post
const getPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)
        .populate('owner', 'username avatar')
        .populate('comments');

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    res.json(formatResponse(true, 'Post retrieved successfully', post));
  } catch (error: any) {
    console.error('Error fetching post:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(false, error.message || 'Error fetching post')
    );
  }
}

// Update post
const updatePost = async (req: TypedRequestBody<UpdatePostBody>, res: Response) => {
  try {
    const userId = req.userId

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const post = await Post.findOne({
      _id: req.params.id,
      owner: userId,
    });

    if (!post) {
      throw new AppError('Post not found or unauthorized', 404);
    }

    const updatedPost = await Post.findOneAndUpdate(
        {_id: req.params.id, owner: userId},
        {$set: req.body},
        {new: true, runValidators: true}
    );

    res.json(formatResponse(true, 'Post updated successfully', updatedPost));
  } catch (error: any) {
    console.error('Error updating post:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(false, error.message || 'Error updating post')
    );
  }
}

// Delete post
const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = req.userId

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      owner: userId,
    });

    if (!post) {
      throw new AppError('Post not found or unauthorized', 404);
    }

    res.json(formatResponse(true, 'Post deleted successfully'));
  } catch (error: any) {
    console.error('Error deleting post:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(false, error.message || 'Error deleting post')
    );
  }
}

// Add reaction
const addReaction = async (req: TypedRequestBody<ReactionBody>, res: Response) => {
  try {
    const {type} = req.body;

    const userId = req.userId

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const existingReactionIndex = post.reactions.findIndex(
        (r: IReaction) => r.user.toString() === userId.toString()
    );

    if (existingReactionIndex !== -1) {
      post.reactions[existingReactionIndex].type = type;
    } else {
      post.reactions.push({
        type,
        user: new ObjectId(userId),
        createdAt: new Date(),
      });
    }

    await post.save();

    res.json(formatResponse(true, 'Reaction added successfully', post));
  } catch (error: any) {
    console.error('Error adding reaction:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(false, error.message || 'Error adding reaction')
    );
  }
}

// Remove reaction
const removeReaction = async (req: Request, res: Response) => {
  try {
    const userId = req.userId

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    post.reactions = post.reactions.filter(
        (r) => r.user.toString() !== userId.toString()
    );
    await post.save();

    res.json(formatResponse(true, 'Reaction removed successfully', post));
  } catch (error: any) {
    console.error('Error removing reaction:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(false, error.message || 'Error removing reaction')
    );
  }
}

// Get user posts
const getUserPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.params.userId || req.userId

    if (!userId) {
      throw new AppError('User ID is required', 400);
    }

    const posts = await Post.find({owner: userId, isArchived: false})
        .sort({createdAt: -1})
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('owner', 'username avatar')
        .populate('comments');

    res.json(formatResponse(true, 'Posts retrieved successfully', posts));
  } catch (error: any) {
    console.error('Error fetching user posts:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(false, error.message || 'Error fetching user posts')
    );
  }
}

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;


    const posts = await Post.find({isArchived: false})
        .sort({createdAt: -1})
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('owner', 'username avatar')
        .populate({
          path: 'reactions.user',
          select: 'username -_id'
        })


    // console.log(`sends page:${page} with limit of ${limit}`)
    res.json(formatResponse(true, 'Posts retrieved successfully', {posts}));

  } catch (error: any) {
    console.error('Error fetching user posts:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(false, error.message || 'Error fetching  posts')
    );
  }
}

const toggleArchive = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.userId
    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }
    if (post.owner.toString() !== userId) {
      throw new AppError('Unauthorized user', 404);
    }
    const isArchived = post.isArchived;
    post.isArchived = !isArchived;
    post.save()
    res.json(formatResponse(true, `${!isArchived ? 'Archived' : 'Unarchived'}  successfully`, post));
  } catch (error: any) {
    console.error('Error fetching user posts:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(false, error.message || 'Error fetching  posts')
    );
  }
}

export default {
  createPost,
  getPost,
  updatePost,
  deletePost,
  addReaction,
  removeReaction,
  getUserPosts,
  getAllPosts,
  toggleArchive,

}