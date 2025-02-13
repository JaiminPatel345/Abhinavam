import {Document, Schema} from 'mongoose';

// Media Types Enum with comprehensive formats
export enum MediaType {
  // Images
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
  WEBP = 'image/webp',
  SVG = 'image/svg+xml',
  HEIF = 'image/heif',
  HEIC = 'image/heic',
  AVIF = 'image/avif',

  // Videos
  MP4 = 'video/mp4',
  WEBM = 'video/webm',
  MOV = 'video/quicktime',
  M4V = 'video/x-m4v',
  MKV = 'video/x-matroska',

  // Animated Images
  GIF = 'image/gif',
  ANIMATED_WEBP = 'image/webp-animated',
  ANIMATED_PNG = 'image/apng'
}

export enum ProcessingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  OPTIMIZING = 'optimizing'
}

export enum MediaVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  RESTRICTED = 'restricted'
}

export interface IMediaMetadata {
  width?: number;
  height?: number;
  duration?: number;
  size: number;
  encoding?: string;
  bitrate?: number;
  fps?: number;
  aspectRatio?: string;
  quality?: number;
  codec?: string;
  originalFilename: string;
}

export interface IMedia extends Document {
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  metadata: IMediaMetadata;
  alt: string;
  caption?: string;
  processingStatus: ProcessingStatus;
  visibility: MediaVisibility;
  isOptimized: boolean;
  optimizedVersions?: {
    low?: string;
    medium?: string;
    high?: string;
  };
  tags?: string[];
  uploadedBy: string; // User ID
  storageProvider: string;
  storageKey: string;
  processingErrors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const mediaMetadataSchema = new Schema<IMediaMetadata>({
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