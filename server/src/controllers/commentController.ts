import {Request, Response} from 'express';
import {CreateCommentBody, UpdateCommentBody} from "../types/post.types.js";
import {AppError, formatResponse, TypedRequestBody} from "../types/custom.types.js";
import {Post} from "../models/postModel.js";
import {Comment} from "../models/commentModel.js";
import {Types} from "mongoose";


// Individual controller methods approach
export const createComment = async (
    req: TypedRequestBody<CreateCommentBody>,
    res: Response
) => {
  try {
    const {content, postId, parentCommentId} = req.body;
    const userId = req.user?._id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // If this is a reply, verify parent comment exists
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        throw new AppError('Parent comment not found', 404);
      }
    }

    const comment = await Comment.create({
      content,
      author: userId,
      post: postId,
      parentComment: parentCommentId || null,
    });

    await Post.findByIdAndUpdate(postId, {
      $push: {comments: comment._id}
    });

    const populatedComment = await Comment.findById(comment._id)
        .populate('author', 'username avatar');

    res.status(201).json(
        formatResponse(true, 'Comment created successfully', populatedComment)
    );
  } catch (error: any) {
    console.error('Error in comment creation:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(false, error.message || 'Error creating comment')
    );
  }
};

export const getPostComments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const postId = req.params.postId;

    if (!Types.ObjectId.isValid(postId)) {
      throw new AppError('Invalid post ID', 400);
    }

    const comments = await Comment.find({
      post: postId,
      parentComment: null // Only get top-level comments
    })
        .sort({createdAt: -1})
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('author', 'username avatar')
        .populate({
          path: 'replies',
          populate: {
            path: 'author',
            select: 'username avatar'
          }
        });

    const total = await Comment.countDocuments({
      post: postId,
      parentComment: null
    });

    res.json(formatResponse(true, 'Comments retrieved successfully', {
      comments,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    }));
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(false, error.message || 'Error fetching comments')
    );
  }
};

export const updateComment = async (
    req: TypedRequestBody<UpdateCommentBody>,
    res: Response
) => {
  try {
    const {content} = req.body;
    const userId = req.user?._id;
    const commentId = req.params.id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const comment = await Comment.findOne({
      _id: commentId,
      author: userId
    });

    if (!comment) {
      throw new AppError('Comment not found or unauthorized', 404);
    }

    comment.content = content;
    comment.isEdited = true;
    await comment.save();

    res.json(formatResponse(true, 'Comment updated successfully', comment));
  } catch (error: any) {
    console.error('Error updating comment:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(false, error.message || 'Error updating comment')
    );
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const commentId = req.params.id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const comment = await Comment.findOne({
      _id: commentId,
      author: userId
    });

    if (!comment) {
      throw new AppError('Comment not found or unauthorized', 404);
    }

    // Remove comment from post's comments array
    await Post.findByIdAndUpdate(comment.post, {
      $pull: {comments: commentId}
    });

    // If this is a parent comment, delete all replies
    if (!comment.parentComment) {
      await Comment.deleteMany({parentComment: commentId});
    }

    await comment.deleteOne();

    res.json(formatResponse(true, 'Comment deleted successfully'));
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(false, error.message || 'Error deleting comment')
    );
  }
};

export const toggleLike = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const commentId = req.params.id;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    const userLiked = comment.likes.includes(userId);

    if (userLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json(formatResponse(
        true,
        userLiked ? 'Like removed successfully' : 'Comment liked successfully',
        comment
    ));
  } catch (error: any) {
    console.error('Error toggling like:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(false, error.message || 'Error toggling like')
    );
  }
};

export const getReplies = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const replies = await Comment.find({parentComment: id})
        .sort({createdAt: -1})
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('author', 'username avatar');

    const total = await Comment.countDocuments({parentComment: id});

    res.json(formatResponse(true, 'Replies retrieved successfully', {
      replies,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    }));
  } catch (error: any) {
    console.error('Error fetching replies:', error);
    res.status(error.statusCode || 500).json(
        formatResponse(false, error.message || 'Error fetching replies')
    );
  }
};