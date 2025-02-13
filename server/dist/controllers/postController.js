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
class PostController {
    // Create a new post
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { description, tags, location } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                if (!userId) {
                    throw new AppError('User not authenticated', 401);
                }
                const postData = {
                    description,
                    owner: userId,
                    tags: tags || [],
                    location,
                };
                const post = yield Post.create(postData);
                res.status(201).json(formatResponse(true, 'Post created successfully', post));
            }
            catch (error) {
                console.error('Error in post creation:', error);
                res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error creating post'));
            }
        });
    }
    // Get single post
    getPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield Post.findById(req.params.id)
                    .populate('owner', 'username avatar')
                    .populate('comments');
                if (!post) {
                    throw new AppError('Post not found', 404);
                }
                res.json(formatResponse(true, 'Post retrieved successfully', post));
            }
            catch (error) {
                console.error('Error fetching post:', error);
                res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error fetching post'));
            }
        });
    }
    // Update post
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                if (!userId) {
                    throw new AppError('User not authenticated', 401);
                }
                const post = yield Post.findOne({
                    _id: req.params.id,
                    owner: userId,
                });
                if (!post) {
                    throw new AppError('Post not found or unauthorized', 404);
                }
                const updatedPost = yield Post.findOneAndUpdate({ _id: req.params.id, owner: userId }, { $set: req.body }, { new: true, runValidators: true });
                res.json(formatResponse(true, 'Post updated successfully', updatedPost));
            }
            catch (error) {
                console.error('Error updating post:', error);
                res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error updating post'));
            }
        });
    }
    // Delete post
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                if (!userId) {
                    throw new AppError('User not authenticated', 401);
                }
                const post = yield Post.findOneAndDelete({
                    _id: req.params.id,
                    owner: userId,
                });
                if (!post) {
                    throw new AppError('Post not found or unauthorized', 404);
                }
                res.json(formatResponse(true, 'Post deleted successfully'));
            }
            catch (error) {
                console.error('Error deleting post:', error);
                res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error deleting post'));
            }
        });
    }
    // Add reaction
    addReaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { type } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                if (!userId) {
                    throw new AppError('User not authenticated', 401);
                }
                const post = yield Post.findById(req.params.id);
                if (!post) {
                    throw new AppError('Post not found', 404);
                }
                const existingReactionIndex = post.reactions.findIndex((r) => r.user.toString() === userId.toString());
                if (existingReactionIndex !== -1) {
                    post.reactions[existingReactionIndex].type = type;
                }
                else {
                    post.reactions.push({
                        type,
                        user: userId,
                        createdAt: new Date(),
                    });
                }
                yield post.save();
                res.json(formatResponse(true, 'Reaction added successfully', post));
            }
            catch (error) {
                console.error('Error adding reaction:', error);
                res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error adding reaction'));
            }
        });
    }
    // Remove reaction
    removeReaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                if (!userId) {
                    throw new AppError('User not authenticated', 401);
                }
                const post = yield Post.findById(req.params.id);
                if (!post) {
                    throw new AppError('Post not found', 404);
                }
                post.reactions = post.reactions.filter((r) => r.user.toString() !== userId.toString());
                yield post.save();
                res.json(formatResponse(true, 'Reaction removed successfully', post));
            }
            catch (error) {
                console.error('Error removing reaction:', error);
                res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error removing reaction'));
            }
        });
    }
    // Get user posts
    getUserPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const userId = req.params.userId || ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
                if (!userId) {
                    throw new AppError('User ID is required', 400);
                }
                const posts = yield Post.find({ owner: userId, isArchived: false })
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('owner', 'username avatar')
                    .populate('comments');
                res.json(formatResponse(true, 'Posts retrieved successfully', posts));
            }
            catch (error) {
                console.error('Error fetching user posts:', error);
                res.status(error.statusCode || 500).json(formatResponse(false, error.message || 'Error fetching user posts'));
            }
        });
    }
}
export default new PostController();
//# sourceMappingURL=postController.js.map