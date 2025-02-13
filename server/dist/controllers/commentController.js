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
import { Post } from "../models/postModel.js";
import { Comment } from "../models/commentModel.js";
import mongoose, { Types } from "mongoose";
// Individual controller methods approach
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, postId, parentCommentId } = req.body;
        const userId = req.userId;
        if (!userId) {
            throw new AppError('User not authenticated', 401);
        }
        const post = yield Post.findById(postId);
        if (!post) {
            throw new AppError('Post not found', 404);
        }
        // If this is a reply, verify parent comment exists
        if (parentCommentId) {
            const parentComment = yield Comment.findById(parentCommentId);
            if (!parentComment) {
                throw new AppError('Parent comment not found', 404);
            }
        }
        const comment = yield Comment.create({
            content,
            author: userId,
            post: postId,
            parentComment: parentCommentId || null,
        });
        yield Post.findByIdAndUpdate(postId, {
            $push: { comments: comment._id }
        });
        const populatedComment = yield Comment.findById(comment._id)
            .populate('author', 'username avatar');
        res.status(201).json(formatResponse(true, 'Comment created successfully', populatedComment));
    }
    catch (error) {
        console.error('Error in comment creation:', error);
        res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error creating comment'));
    }
});
const getPostComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const postId = req.params.postId;
        if (!Types.ObjectId.isValid(postId)) {
            throw new AppError('Invalid post ID', 400);
        }
        const comments = yield Comment.find({
            post: postId,
            parentComment: null // Only get top-level comments
        })
            .sort({ createdAt: -1 })
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
        const total = yield Comment.countDocuments({
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
    }
    catch (error) {
        console.error('Error fetching comments:', error);
        res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error fetching comments'));
    }
});
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        const userId = req.userId;
        const commentId = req.params.id;
        if (!userId) {
            throw new AppError('User not authenticated', 401);
        }
        const comment = yield Comment.findOne({
            _id: commentId,
            author: userId
        });
        if (!comment) {
            throw new AppError('Comment not found or unauthorized', 404);
        }
        comment.content = content;
        comment.isEdited = true;
        yield comment.save();
        res.json(formatResponse(true, 'Comment updated successfully', comment));
    }
    catch (error) {
        console.error('Error updating comment:', error);
        res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error updating comment'));
    }
});
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const commentId = req.params.id;
        if (!userId) {
            throw new AppError('User not authenticated', 401);
        }
        const comment = yield Comment.findOne({
            _id: commentId,
            author: userId
        });
        if (!comment) {
            throw new AppError('Comment not found or unauthorized', 404);
        }
        // Remove comment from post's comments array
        yield Post.findByIdAndUpdate(comment.post, {
            $pull: { comments: commentId }
        });
        // If this is a parent comment, delete all replies
        if (!comment.parentComment) {
            yield Comment.deleteMany({ parentComment: commentId });
        }
        yield comment.deleteOne();
        res.json(formatResponse(true, 'Comment deleted successfully'));
    }
    catch (error) {
        console.error('Error deleting comment:', error);
        res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error deleting comment'));
    }
});
const toggleLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const commentId = req.params.id;
        if (!userId) {
            throw new AppError('User not authenticated', 401);
        }
        const comment = yield Comment.findById(commentId);
        if (!comment) {
            throw new AppError('Comment not found', 404);
        }
        const userLiked = comment.likes.includes(userId);
        if (userLiked) {
            comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());
        }
        else {
            comment.likes.push(userId);
        }
        yield comment.save();
        res.json(formatResponse(true, userLiked ? 'Like removed successfully' : 'Comment liked successfully', comment));
    }
    catch (error) {
        console.error('Error toggling like:', error);
        res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error toggling like'));
    }
});
const getReplies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const replies = yield Comment.find({ parentComment: id })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('author', 'username avatar');
        const total = yield Comment.countDocuments({ parentComment: id });
        res.json(formatResponse(true, 'Replies retrieved successfully', {
            replies,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        }));
    }
    catch (error) {
        console.error('Error fetching replies:', error);
        res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error fetching replies'));
    }
});
export default {
    createComment,
    getPostComments,
    updateComment,
    deleteComment,
    toggleLike,
    getReplies,
};
//# sourceMappingURL=commentController.js.map