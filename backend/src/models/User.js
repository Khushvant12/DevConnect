import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const socialLinksSchema = new mongoose.Schema(
  {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    portfolio: { type: String, default: '' },
  },
  { _id: false }
);

const EXPERIENCE_LEVELS = ['beginner', 'junior', 'mid', 'senior', 'lead'];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    techStack: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    education: {
      type: String,
      maxlength: [200, 'Education cannot exceed 200 characters'],
      default: '',
    },
    company: {
      type: String,
      maxlength: [120, 'Company/college cannot exceed 120 characters'],
      default: '',
    },
    location: {
      type: String,
      maxlength: [120, 'Location cannot exceed 120 characters'],
      default: '',
    },
    experienceLevel: {
      type: String,
      enum: [...EXPERIENCE_LEVELS, ''],
      default: '',
    },
    githubProfile: {
      type: String,
      default: '',
    },
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    savedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    profileCompletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.index({ name: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ techStack: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export { EXPERIENCE_LEVELS };
const User = mongoose.model('User', userSchema);
export default User;
