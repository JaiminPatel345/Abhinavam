import mongoose, {Document, Schema} from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  content: string;
  attachment?: string;
  readBy: [{
    user: mongoose.Types.ObjectId;
    readAt: Date;
  }];
  conversationId: mongoose.Types.ObjectId;
  deletedFor: mongoose.Types.ObjectId[];
  deletedForEveryone: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
    {
      sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      // For direct messages only - can be null/undefined for group messages
      receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // Not required since it's only for direct messages
      },
      content: {
        type: String,
        required: true,
      },
      attachment: {
        type: String,
      },
      conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true,
      },
      // Track read status - for both types, but particularly useful for groups
      readBy: [{
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        readAt: Date
      }],
      deletedFor: [{
        _id: false,
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        deletedAt: Date
      }],
      deletedForEveryone: {
        type: Boolean,
        default: false
      }
    },
    {timestamps: true}
);

MessageSchema.index({conversationId: 1, createdAt: -1});
MessageSchema.index({sender: 1});

export default mongoose.model<IMessage>('Message', MessageSchema);