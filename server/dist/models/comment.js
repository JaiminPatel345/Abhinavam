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
const reactionSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        maxlength: 5000, // Adjust based on your requirements
        trim: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
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
    mentions: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        }],
    reactions: [reactionSchema],
    isEdited: {
        type: Boolean,
        default: false,
    },
    editHistory: [{
            content: String,
            editedAt: {
                type: Date,
                default: Date.now,
            },
        }],
    status: {
        type: String,
        enum: ['active', 'deleted', 'hidden', 'flagged'],
        default: 'active',
        index: true,
    },
    metadata: {
        userAgent: String,
        ip: String,
        editCount: {
            type: Number,
            default: 0,
        },
        reportCount: {
            type: Number,
            default: 0,
        },
    },
}, {
    timestamps: true,
});
// Indexes for better query performance
commentSchema.index({ createdAt: -1 });
commentSchema.index({ 'reactions.type': 1 });
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1, createdAt: -1 });
// Virtual for reaction counts
commentSchema.virtual('reactionCounts').get(function () {
    const counts = {};
    this.reactions.forEach((reaction) => {
        counts[reaction.type] = (counts[reaction.type] || 0) + 1;
    });
    return counts;
});
// Middleware to handle replies
commentSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isNew && this.parentComment) {
            try {
                yield this.model('Comment').findByIdAndUpdate(this.parentComment, { $push: { replies: this._id } });
            }
            catch (error) {
                next(error);
            }
        }
        next();
    });
});
// Methods
commentSchema.methods.edit = function (newContent) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.content !== newContent) {
            // Store the current content in edit history
            this.editHistory = this.editHistory || [];
            this.editHistory.push({
                content: this.content,
                editedAt: new Date(),
            });
            this.content = newContent;
            this.isEdited = true;
            this.metadata.editCount += 1;
            yield this.save();
        }
    });
};
commentSchema.methods.addReaction = function (userId, reactionType) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingReaction = this.reactions.find((r) => r.user.toString() === userId.toString());
        if (existingReaction) {
            existingReaction.type = reactionType;
        }
        else {
            this.reactions.push({
                type: reactionType,
                user: userId,
            });
        }
        yield this.save();
    });
};
commentSchema.methods.removeReaction = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        this.reactions = this.reactions.filter((r) => r.user.toString() !== userId.toString());
        yield this.save();
    });
};
// Statics
commentSchema.statics.getRepliesTree = function (commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.findById(commentId)
            .populate({
            path: 'replies',
            populate: {
                path: 'replies',
                populate: 'replies',
            },
        });
    });
};
const Comment = model('Comment', commentSchema);
export { Comment, IReaction };
//# sourceMappingURL=comment.js.map