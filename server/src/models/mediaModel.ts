import {Model, model, Schema} from 'mongoose';
import {IMediaMetadata , IMedia ,MediaType , ProcessingStatus , MediaVisibility} from '../types/media.types.js'


const mediaMetadataSchema = new Schema<IMediaMetadata>({
  width: Number,
  height: Number,
  duration: Number,
  size: {type: Number, required: true},
  encoding: String,
  bitrate: Number,
  fps: Number,
  aspectRatio: String,
  quality: Number,
  codec: String,
  originalFilename: {type: String, required: true}
});

const mediaSchema = new Schema<IMedia>({
  type: {
    type: String,
    required: true,
    enum: Object.values(MediaType),
    index: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: function (this: IMedia) {
      return this.type.startsWith('video/');
    }
  },
  metadata: {
    type: mediaMetadataSchema,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  caption: String,
  processingStatus: {
    type: String,
    enum: Object.values(ProcessingStatus),
    default: ProcessingStatus.PENDING,
    index: true
  },
  visibility: {
    type: String,
    enum: Object.values(MediaVisibility),
    default: MediaVisibility.PUBLIC,
    index: true
  },
  isOptimized: {
    type: Boolean,
    default: false
  },
  optimizedVersions: {
    low: String,
    medium: String,
    high: String
  },
  tags: [String],
  uploadedBy: {
    type: String,
    required: true,
    index: true
  },
  storageProvider: {
    type: String,
    required: true
  },
  storageKey: {
    type: String,
    required: true,
    unique: true
  },
  processingErrors: [String],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
mediaSchema.index({'metadata.size': 1});
mediaSchema.index({type: 1, processingStatus: 1});
mediaSchema.index({visibility: 1, createdAt: -1});
mediaSchema.index({tags: 1});

// Instance methods
mediaSchema.methods.isVideo = function (): boolean {
  return this.type.startsWith('video/');
};

mediaSchema.methods.isImage = function (): boolean {
  return this.type.startsWith('image/');
};

mediaSchema.methods.isAnimated = function (): boolean {
  return [
    MediaType.GIF,
    MediaType.ANIMATED_WEBP,
    MediaType.ANIMATED_PNG
  ].includes(this.type);
};

const Media: Model<IMedia> = model<IMedia>('Media', mediaSchema);

export {
  Media,
  IMedia,
  MediaType,
  ProcessingStatus,
  MediaVisibility,
  IMediaMetadata
};