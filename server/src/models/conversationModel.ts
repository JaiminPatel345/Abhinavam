import mongoose, {Document, Schema} from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  isGroup: boolean;
  groupName?: string;
  groupAdmin?: mongoose.Types.ObjectId;
  lastMessage?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema(
    {
      participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }],
      isGroup: {
        type: Boolean,
        default: false
      },
      groupName: {
        type: String,
        trim: true
      },
      groupAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
      }
    },
    {timestamps: true}
);

// Create compound index for efficient participant queries
ConversationSchema.index({participants: 1});
ConversationSchema.index({lastMessage: 1});

export default mongoose.model<IConversation>('Conversation', ConversationSchema);