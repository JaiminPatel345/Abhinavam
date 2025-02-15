import mongoose, {Model} from 'mongoose';
import INTERESTS from '../utils/userUtils/interested.js';
import PROFESSIONS from '../utils/userUtils/professions.js';
import {IUser} from "../types/user.types.js";

const UserSchema = new mongoose.Schema<IUser>(
    {
  // Stage 1 Fields
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [
      /^[a-z0-9_.]+$/,
      'Username can only contain lowercase letters, numbers, dot ,  and underscores',
    ],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please enter a valid email address'
    ],
    validate: {
      validator: function (email: string) {
        // Additional custom validation if needed
        return email.length <= 254; // Maximum email length as per RFC 5321
      },
      message: 'Email is too long. Maximum length is 254 characters'
    },
    index: true // For query performance
  },
  mobile: {
    type: String,
    // required: [true, 'Mobile number is required'],
    // unique: true,
    match: [
      /^\+[1-9]\d{6,14}$/,
      'Please enter a valid mobile number with country code (e.g., +1234567890)',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
    minlength: [6, 'Password must be at least 6 characters long'],
    // You might want to add password strength validation here
  },

  // Stage 2 Fields (OTP Verification)
  isMobileVerified: {
    type: Boolean,
    default: false,
  },

  // Stage 3 Fields (Profile Completion)
  avatar: {
    url: {
      type: String,
      default: 'https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png',
    },
    path: String,
  },
  about: {
    type: String,
    trim: true,
    maxlength: [500, 'About section cannot exceed 500 characters'],
  },
  interests: {
    type: [String],
    validate: {
      validator: function (interests: string[]) {
        if (interests.length === 0) return true;
        if (interests.length > 5) return false; // Maximum 5 interests
        return interests.every(interest => INTERESTS.includes(interest));
      },
      message: props =>
          props.value.length > 5
              ? 'Maximum 5 interests allowed'
              : `${props.value} contains invalid interests`,
    },
    default: [],
  },
  profession: {
    type: [String],
    validate: {
      validator: function (professions: string[]) {
        // Allow empty array during initial registration
        if (professions.length === 0) return true;
        // Validate each profession in the array
        return professions.every(profession => PROFESSIONS.includes(profession));
      },
      message: props => `One or more professions are not valid`,
    },
    default: []
  },

  //connections
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  //post
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],

  // Registration Process Tracking
  registrationStage: {
    type: Number,
    enum: [1, 2, 3],
    default: 1,
    required: true,
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
  },

  // Account Status and Security
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  accountLockUntil: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.password;
      delete ret.__v;
      delete ret.loginAttempts;
      delete ret.accountLockUntil;
      return ret;
    },
  },
});

// Indexes for performance
// UserSchema.index({ username: 1 });
// UserSchema.index({ mobile: 1 });
UserSchema.index({status: 1});

// Methods for account security
UserSchema.methods.incrementLoginAttempts = async function () {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.accountLockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
    this.status = 'suspended';
  }
  await this.save();
};

UserSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.accountLockUntil = null;
  this.status = 'active';
  await this.save();
};

UserSchema.methods.isAccountLocked = function () {
  return this.accountLockUntil && this.accountLockUntil > new Date();
};

// Method to check if profile is complete
UserSchema.methods.checkProfileComplete = function () {
  return Boolean(
      this.isMobileVerified &&
      this.about &&
      this.interests.length > 0 &&
      this.profession &&
      this.avatar !== 'https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png'
  );
};

// Pre-save middleware to update isProfileComplete
UserSchema.pre('save', function (next) {
  if (this.isModified('about') ||
      this.isModified('interests') ||
      this.isModified('profession') ||
      this.isModified('avatar') ||
      this.isModified('isMobileVerified')) {
    this.isProfileComplete = this.checkProfileComplete();
  }
  next();
});

const User: Model<IUser> = mongoose.model('User', UserSchema);

export default User;