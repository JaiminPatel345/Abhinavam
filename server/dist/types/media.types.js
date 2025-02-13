import { Schema } from 'mongoose';
// Media Types Enum with comprehensive formats
export var MediaType;
(function (MediaType) {
    // Images
    MediaType["JPEG"] = "image/jpeg";
    MediaType["JPG"] = "image/jpg";
    MediaType["PNG"] = "image/png";
    MediaType["WEBP"] = "image/webp";
    MediaType["SVG"] = "image/svg+xml";
    MediaType["HEIF"] = "image/heif";
    MediaType["HEIC"] = "image/heic";
    MediaType["AVIF"] = "image/avif";
    // Videos
    MediaType["MP4"] = "video/mp4";
    MediaType["WEBM"] = "video/webm";
    MediaType["MOV"] = "video/quicktime";
    MediaType["M4V"] = "video/x-m4v";
    MediaType["MKV"] = "video/x-matroska";
    // Animated Images
    MediaType["GIF"] = "image/gif";
    MediaType["ANIMATED_WEBP"] = "image/webp-animated";
    MediaType["ANIMATED_PNG"] = "image/apng";
})(MediaType || (MediaType = {}));
export var ProcessingStatus;
(function (ProcessingStatus) {
    ProcessingStatus["PENDING"] = "pending";
    ProcessingStatus["PROCESSING"] = "processing";
    ProcessingStatus["COMPLETED"] = "completed";
    ProcessingStatus["FAILED"] = "failed";
    ProcessingStatus["OPTIMIZING"] = "optimizing";
})(ProcessingStatus || (ProcessingStatus = {}));
export var MediaVisibility;
(function (MediaVisibility) {
    MediaVisibility["PUBLIC"] = "public";
    MediaVisibility["PRIVATE"] = "private";
    MediaVisibility["RESTRICTED"] = "restricted";
})(MediaVisibility || (MediaVisibility = {}));
export const mediaMetadataSchema = new Schema({
    width: Number,
    height: Number,
    duration: Number,
    size: { type: Number, required: true },
    encoding: String,
    bitrate: Number,
    fps: Number,
    aspectRatio: String,
    quality: Number,
    codec: String,
    originalFilename: { type: String, required: true }
});
//# sourceMappingURL=media.types.js.map