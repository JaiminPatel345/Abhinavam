import {Model, model, Schema, Types} from 'mongoose';
import {IComment} from "../types/post.types.js";


// For static methods
interface CommentModel extends Model<IComment> {
  getRepliesTree(commentId: Types.ObjectId): Promise<IComment | null>;
}

const CommentSchema = new Schema<IComment, CommentModel>({
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
    ref: 'Comment', // Fixed: Changed from 'CommentModel' to 'Comment'
    default: null,
    index: true,
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment', // Fixed: Changed from 'CommentModel' to 'Comment'
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
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

// Indexes
CommentSchema.index({createdAt: -1});
CommentSchema.index({post: 1, createdAt: -1});
CommentSchema.index({author: 1, createdAt: -1});
CommentSchema.index({parentComment: 1, createdAt: -1});

// Add virtual for likes count
CommentSchema.virtual('likesCount').get(function (this: IComment) {
  return this.likes.length;
});

// Add virtual for replies count
CommentSchema.virtual('repliesCount').get(function (this: IComment) {
  return this.replies.length;
});

// Middleware to handle replies
CommentSchema.pre('save', async function (this: IComment, next) {
  try {
    if (this.isNew && this.parentComment) {
      await Comment.findByIdAndUpdate(
          this.parentComment,
          {$push: {replies: this._id}},
          {new: true}
      );
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Middleware to handle comment deletion
CommentSchema.pre('deleteOne', {document: true, query: false}, async function (this: IComment, next) {
  try {
    // Remove this comment's ID from parent's replies array if it's a reply
    if (this.parentComment) {
      await Comment.findByIdAndUpdate(
          this.parentComment,
          {$pull: {replies: this._id}}
      );
    }

    // Delete all replies if this is a parent comment
    if (this.replies.length > 0) {
      await Comment.deleteMany({parentComment: this._id});
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Static method to get replies tree
CommentSchema.statics.getRepliesTree = async function (commentId: Types.ObjectId): Promise<IComment | null> {
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
};

// Helper method to check if user has liked the comment
CommentSchema.methods.isLikedByUser = function (userId: Types.ObjectId): boolean {
  return this.likes.some((likeId: Types.ObjectId) =>
      likeId.toString() === userId.toString()
  );
};

const Comment = model<IComment, CommentModel>('Comment', CommentSchema);

export {Comment};