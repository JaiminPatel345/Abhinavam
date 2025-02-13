import {Model, model, Schema, Types} from 'mongoose';
import {ILocation, IPost, IReaction, PostReactionType} from '../types/post.types.js'


// Schema for location
//TODO: make advance
const locationSchema = new Schema<ILocation>({
  city: String,
  country: String,
}, {_id: false});

// Schema for reaction
const reactionSchema = new Schema<IReaction>({
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
}, {_id: false});

// Main post schema
const postSchema = new Schema<IPost>({
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
postSchema.path('description').validate(function (this: IPost) {
  const hasDescription = !!this.description?.trim(); // Check if description exists and is not just whitespace
  const hasMedias = Array.isArray(this.medias) && this.medias.length > 0; // Check if medias array is not empty
  return hasDescription || hasMedias; // At least one must be true
}, 'A post must have either a description or media.');

// Indexes for better query performance
postSchema.index({createdAt: -1});
postSchema.index({owner: 1, createdAt: -1});
postSchema.index({tags: 1});
// postSchema.index({ 'reactions.user': 1 });

// Virtual for reaction counts
postSchema.virtual('reactionCounts').get(function (this: IPost) {
  const counts: Record<PostReactionType, number> = {
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
postSchema.methods.addReaction = async function (
    userId: Types.ObjectId,
    reactionType: PostReactionType
) {
  const existingReactionIndex = this.reactions.findIndex(
      (r: IReaction) => r.user.toString() === userId.toString()
  );

  if (existingReactionIndex !== -1) {
    // Update existing reaction
    this.reactions[existingReactionIndex].type = reactionType;
  } else {
    // Add new reaction
    this.reactions.push({
      type: reactionType,
      user: userId,
      createdAt: new Date(),
    });
  }

  await this.save();
};

postSchema.methods.removeReaction = async function (userId: Types.ObjectId) {
  this.reactions = this.reactions.filter(
      (r: IReaction) => r.user.toString() !== userId.toString()
  );
  await this.save();
};

postSchema.methods.incrementShares = async function () {
  this.shares += 1;
  await this.save();
};

postSchema.methods.addComment = async function (commentId: Types.ObjectId) {
  if (!this.comments.includes(commentId)) {
    this.comments.push(commentId);
    await this.save();
  }
};

// Statics
postSchema.statics.getPostsByUser = async function (
    userId: Types.ObjectId,
    page: number = 1,
    limit: number = 10
) {
  return this.find({owner: userId, isArchived: false})
      .sort({createdAt: -1})
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('owner', 'username avatar')
      .populate('medias')
      .lean();
};

const Post: Model<IPost> = model<IPost>('Post', postSchema);

export {
  Post,
  IPost,
  IReaction,
  ILocation,
  PostReactionType
};