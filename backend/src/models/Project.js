import mongoose from 'mongoose';

export const PROJECT_CATEGORIES = [
  'web',
  'mobile',
  'ai-ml',
  'devops',
  'blockchain',
  'game',
  'open-source',
  'other',
];

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'];

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    techStack: {
      type: [String],
      default: [],
    },
    githubLink: {
      type: String,
      default: '',
    },
    liveDemoLink: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: PROJECT_CATEGORIES,
      default: 'web',
    },
    difficulty: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      default: 'intermediate',
    },
    teamSize: {
      type: Number,
      min: 1,
      max: 50,
      default: 1,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

projectSchema.index({ title: 'text', description: 'text' });
projectSchema.index({ category: 1, difficulty: 1, createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;
