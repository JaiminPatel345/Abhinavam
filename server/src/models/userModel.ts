import mongoose, {Model} from 'mongoose';
import INTERESTS from '../utils/userUtils/interested.js';
import PROFESSIONS from '../utils/userUtils/professions.js';
import {IUser} from "../types/user.types.js";

const UserSchema = new mongoose.Schema<IUser>({
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
      'Username can only contain lowercase letters, numbers, dots, and underscores',
    ],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      'Please enter a valid email address',
    ],
    index: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false, // Don't include password in default queries
  },
  mobile: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values for optional field
    match: [
      /^\+[1-9]\d{6,14}$/,
      'Please enter a valid mobile number with country code (e.g., +1234567890)',
    ],
  },
  about: {
    type: String,
    required: [true, 'About is required'],
  },
  interests: {
    type: [String],
    validate: {
      validator: function(interests) {
        // Allow empty array
        if (interests.length === 0) return true;
        return interests.every((interest:string) => INTERESTS.includes(interest));
      },
      message: props => `${props.value} contains invalid interests`,
    },
    default: [], // Changed default to empty array
  },
  profession: {
    type: [String],
    validate: {
      validator: function(professions) {
        // Allow empty array
        if (professions.length === 0) return true;
        return professions.every((profession:string) => PROFESSIONS.includes(profession));
      },
      message: props => `${props.value} contains invalid professions`,
    },
    default: [], // Changed default to empty array
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isMobileVerified: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    default: null,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
  // loginAttempts: {
  //   type: Number,
  //   default: 0,
  // },
  // accountLockUntil: {
  //   type: Date,
  //   default: null,
  // },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
});

// Add instance methods if needed
// UserSchema.methods.incrementLoginAttempts = function() {
//   if (this.loginAttempts >= 5) {
//     this.accountLockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
//   }
//   this.loginAttempts += 1;
//   return this.save();
// };
//
// UserSchema.methods.resetLoginAttempts = function() {
//   this.loginAttempts = 0;
//   this.accountLockUntil = null;
//   return this.save();
// };

const User:Model<IUser> = mongoose.model('User', UserSchema);

export default User;