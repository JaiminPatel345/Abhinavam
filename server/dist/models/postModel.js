var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { model, Schema } from 'mongoose';
import { PostReactionType } from '../types/post.types.js';
// Schema for location
//TODO: make advance
const locationSchema = new Schema({
    city: String,
    country: String,
}, { _id: false });
// Schema for reaction
const reactionSchema = new Schema({
    type: {
        type: String,
        enum: Object.values(PostReactionType),
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, { _id: false });
// Main post schema
const postSchema = new Schema({
    description: {
        type: String,
        trim: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    medias: [{
            type: Schema.Types.ObjectId,
            ref: 'Media',
        }],
    comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        }],
    reactions: [reactionSchema],
    shares: {
        type: Number,
        default: 0,
    },
    location: locationSchema,
    isArchived: {
        type: Boolean,
        default: false,
    },
    tags: [{
            type: String,
            trim: true,
        }],
}, {
    timestamps: true,
});
// Custom validation to ensure either `description` or `medias` is provided
postSchema.path('description').validate(function () {
    var _a;
    const hasDescription = !!((_a = this.description) === null || _a === void 0 ? void 0 : _a.trim()); // Check if description exists and is not just whitespace
    const hasMedias = Array.isArray(this.medias) && this.medias.length > 0; // Check if medias array is not empty
    return hasDescription || hasMedias; // At least one must be true
}, 'A post must have either a description or media.');
// Indexes for better query performance
postSchema.index({ createdAt: -1 });
postSchema.index({ owner: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
// postSchema.index({ 'reactions.user': 1 });
// Virtual for reaction counts
postSchema.virtual('reactionCounts').get(function () {
    const counts = {
        [PostReactionType.INSPIRE]: 0,
        [PostReactionType.VIBE]: 0,
        [PostReactionType.RESPECT]: 0,
        [PostReactionType.WOW]: 0,
    };
    this.reactions.forEach((reaction) => {
        counts[reaction.type]++;
    });
    return counts;
});
// Methods
postSchema.methods.addReaction = function (userId, reactionType) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingReactionIndex = this.reactions.findIndex((r) => r.user.toString() === userId.toString());
        if (existingReactionIndex !== -1) {
            // Update existing reaction
            this.reactions[existingReactionIndex].type = reactionType;
        }
        else {
            // Add new reaction
            this.reactions.push({
                type: reactionType,
                user: userId,
                createdAt: new Date(),
            });
        }
        yield this.save();
    });
};
postSchema.methods.removeReaction = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        this.reactions = this.reactions.filter((r) => r.user.toString() !== userId.toString());
        yield this.save();
    });
};
postSchema.methods.incrementShares = function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.shares += 1;
        yield this.save();
    });
};
postSchema.methods.addComment = function (commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.comments.includes(commentId)) {
            this.comments.push(commentId);
            yield this.save();
        }
    });
};
// Statics
postSchema.statics.getPostsByUser = function (userId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, page = 1, limit = 10) {
        return this.find({ owner: userId, isArchived: false })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('owner', 'username avatar')
            .populate('medias')
            .lean();
    });
};
const Post = model('Post', postSchema);
export { Post, PostReactionType };
//# sourceMappingURL=postModel.js.map