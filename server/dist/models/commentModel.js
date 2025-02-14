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
const CommentSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        maxlength: [5000, 'Comment cannot exceed 5000 characters'],
        trim: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required'],
        index: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post reference is required'],
        index: true,
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
        index: true,
    },
    replies: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        }],
    likes: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
    isEdited: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Indexes
CommentSchema.index({ createdAt: -1 });
CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ author: 1, createdAt: -1 });
CommentSchema.index({ parentComment: 1, createdAt: -1 });
// Add virtual for likes count
CommentSchema.virtual('likesCount').get(function () {
    return this.likes.length;
});
// Add virtual for replies count
CommentSchema.virtual('repliesCount').get(function () {
    return this.replies.length;
});
// Middleware to handle replies
CommentSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this.isNew && this.parentComment) {
                yield Comment.findByIdAndUpdate(this.parentComment, { $push: { replies: this._id } }, { new: true });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
// Middleware to handle comment deletion
CommentSchema.pre('deleteOne', { document: true, query: false }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Remove this comment's ID from parent's replies array if it's a reply
            if (this.parentComment) {
                yield Comment.findByIdAndUpdate(this.parentComment, { $pull: { replies: this._id } });
            }
            // Delete all replies if this is a parent comment
            if (this.replies.length > 0) {
                yield Comment.deleteMany({ parentComment: this._id });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
// Static method to get replies tree
CommentSchema.statics.getRepliesTree = function (commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.findById(commentId)
            .populate({
            path: 'replies',
            populate: [
                {
                    path: 'author',
                    select: 'username avatar'
                },
                {
                    path: 'replies',
                    populate: {
                        path: 'author',
                        select: 'username avatar'
                    }
                }
            ]
        })
            .exec();
    });
};
// Helper method to check if user has liked the comment
CommentSchema.methods.isLikedByUser = function (userId) {
    return this.likes.some((likeId) => likeId.toString() === userId.toString());
};
const Comment = model('Comment', CommentSchema);
export { Comment };
//# sourceMappingURL=commentModel.js.map