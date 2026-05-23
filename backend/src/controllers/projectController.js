import mongoose from 'mongoose';
import Project, { PROJECT_CATEGORIES, DIFFICULTY_LEVELS } from '../models/Project.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadImageBuffer } from '../utils/cloudinaryUpload.js';
import {
  buildProjectFilter,
  enrichProject,
  getCommentsCountMap,
  getSortOption,
  normalizeTechStack,
} from '../utils/projectHelpers.js';
import { createNotification } from '../services/notificationService.js';

const parseBodyField = (body, key, fallback = '') => {
  const val = body[key];
  return val !== undefined && val !== null ? String(val).trim() : fallback;
};

const parseTechFromBody = (body) => {
  if (body.techStack) {
    try {
      const parsed = typeof body.techStack === 'string' ? JSON.parse(body.techStack) : body.techStack;
      return normalizeTechStack(parsed);
    } catch {
      return normalizeTechStack(body.techStack);
    }
  }
  return [];
};

const authorPublicFields = 'name username avatar';

/**
 * POST /api/projects/create
 */
export const createProject = asyncHandler(async (req, res) => {
  const title = parseBodyField(req.body, 'title');
  const description = parseBodyField(req.body, 'description');

  if (!title || !description) {
    res.status(400);
    throw new Error('Title and description are required');
  }

  const category = parseBodyField(req.body, 'category', 'web');
  const difficulty = parseBodyField(req.body, 'difficulty', 'intermediate');

  if (!PROJECT_CATEGORIES.includes(category)) {
    res.status(400);
    throw new Error(`category must be one of: ${PROJECT_CATEGORIES.join(', ')}`);
  }
  if (!DIFFICULTY_LEVELS.includes(difficulty)) {
    res.status(400);
    throw new Error(`difficulty must be one of: ${DIFFICULTY_LEVELS.join(', ')}`);
  }

  let thumbnail = '';
  if (req.file) {
    const result = await uploadImageBuffer(req.file.buffer);
    thumbnail = result.secure_url;
  }

  const project = await Project.create({
    title,
    description,
    techStack: parseTechFromBody(req.body),
    githubLink: parseBodyField(req.body, 'githubLink'),
    liveDemoLink: parseBodyField(req.body, 'liveDemoLink'),
    thumbnail,
    category,
    difficulty,
    teamSize: Math.min(50, Math.max(1, parseInt(req.body.teamSize, 10) || 1)),
    createdBy: req.user._id,
  });

  await project.populate('createdBy', authorPublicFields);

  res.status(201).json({
    success: true,
    data: {
      project: enrichProject({ ...project.toObject(), commentsCount: 0 }, req.user._id),
    },
  });
});

/**
 * GET /api/projects/all — feed with pagination & sorting
 */
export const getAllProjects = asyncHandler(async (req, res) => {
  const {
    q,
    tech,
    category,
    difficulty,
    developer,
    sort = 'latest',
    page = 1,
    limit = 10,
  } = req.query;

  const filter = buildProjectFilter({ q, tech, category, difficulty });
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(30, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  if (developer?.trim()) {
    const devRegex = new RegExp(developer.trim(), 'i');
    const devs = await User.find({
      $or: [{ name: devRegex }, { username: devRegex }],
    }).select('_id');
    filter.createdBy = { $in: devs.map((d) => d._id) };
  }

  const sortKey = ['latest', 'liked', 'trending'].includes(sort) ? sort : 'latest';

  const pipeline = [
    { $match: filter },
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdBy',
      },
    },
    { $unwind: '$createdBy' },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'project',
        as: '_comments',
      },
    },
    {
      $addFields: {
        likesCount: { $size: '$likes' },
        commentsCount: { $size: '$_comments' },
        trendingScore: {
          $divide: [
            { $size: '$likes' },
            {
              $pow: [
                {
                  $add: [
                    {
                      $divide: [
                        { $subtract: [new Date(), '$createdAt'] },
                        3600000,
                      ],
                    },
                    2,
                  ],
                },
                1.5,
              ],
            },
          ],
        },
      },
    },
    { $sort: getSortOption(sortKey) },
    { $skip: skip },
    { $limit: limitNum },
    {
      $project: {
        _comments: 0,
        'createdBy.password': 0,
        'createdBy.email': 0,
      },
    },
  ];

  const [projects, totalResult] = await Promise.all([
    Project.aggregate(pipeline),
    Project.countDocuments(filter),
  ]);

  const userId = req.user?._id;
  let savedSet = new Set();

  if (userId) {
    const me = await User.findById(userId).select('savedProjects');
    savedSet = new Set((me?.savedProjects || []).map(String));
  }

  const formatted = projects.map((p) => {
    const likes = p.likes || [];
    const enriched = {
      ...p,
      likesCount: p.likesCount ?? likes.length,
      isLiked: userId ? likes.some((id) => String(id) === String(userId)) : false,
      isSaved: savedSet.has(String(p._id)),
    };
    delete enriched.likes;
    delete enriched.trendingScore;
    return enriched;
  });

  res.json({
    success: true,
    data: {
      projects: formatted,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalResult,
        pages: Math.ceil(totalResult / limitNum),
        hasMore: skip + formatted.length < totalResult,
      },
    },
  });
});

/**
 * GET /api/projects/saved
 */
export const getSavedProjects = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'savedProjects',
    populate: { path: 'createdBy', select: authorPublicFields },
  });

  const ids = (user.savedProjects || []).map((p) => p._id);
  const countMap = await getCommentsCountMap(ids);

  const projects = (user.savedProjects || [])
    .filter((p) => p && p._id)
    .map((p) => {
      const obj = p.toObject();
      obj.commentsCount = countMap[String(p._id)] || 0;
      return enrichProject(
        { ...obj, isSaved: true },
        req.user._id
      );
    })
    .reverse();

  res.json({ success: true, data: { projects } });
});

/**
 * GET /api/projects/:id
 */
export const getProjectById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid project ID');
  }

  const project = await Project.findById(req.params.id).populate(
    'createdBy',
    authorPublicFields
  );

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const commentsCount = await Comment.countDocuments({ project: project._id });
  let isSaved = false;
  if (req.user) {
    const me = await User.findById(req.user._id).select('savedProjects');
    isSaved = (me?.savedProjects || []).some((id) => String(id) === String(project._id));
  }

  const enriched = enrichProject(
    { ...project.toObject(), commentsCount, isSaved },
    req.user?._id
  );

  res.json({ success: true, data: { project: enriched } });
});

/**
 * PUT /api/projects/update/:id
 */
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (String(project.createdBy) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to update this project');
  }

  if (req.body.title) project.title = parseBodyField(req.body, 'title');
  if (req.body.description) project.description = parseBodyField(req.body, 'description');
  if (req.body.techStack !== undefined) project.techStack = parseTechFromBody(req.body);
  if (req.body.githubLink !== undefined) project.githubLink = parseBodyField(req.body, 'githubLink');
  if (req.body.liveDemoLink !== undefined) project.liveDemoLink = parseBodyField(req.body, 'liveDemoLink');
  if (req.body.category) {
    if (!PROJECT_CATEGORIES.includes(req.body.category)) {
      res.status(400);
      throw new Error('Invalid category');
    }
    project.category = req.body.category;
  }
  if (req.body.difficulty) {
    if (!DIFFICULTY_LEVELS.includes(req.body.difficulty)) {
      res.status(400);
      throw new Error('Invalid difficulty');
    }
    project.difficulty = req.body.difficulty;
  }
  if (req.body.teamSize !== undefined) {
    project.teamSize = Math.min(50, Math.max(1, parseInt(req.body.teamSize, 10) || 1));
  }

  if (req.file) {
    const result = await uploadImageBuffer(req.file.buffer);
    project.thumbnail = result.secure_url;
  }

  await project.save();
  await project.populate('createdBy', authorPublicFields);

  const commentsCount = await Comment.countDocuments({ project: project._id });

  res.json({
    success: true,
    data: {
      project: enrichProject({ ...project.toObject(), commentsCount }, req.user._id),
    },
  });
});

/**
 * DELETE /api/projects/:id
 */
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (String(project.createdBy) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to delete this project');
  }

  await Comment.deleteMany({ project: project._id });
  await User.updateMany(
    { savedProjects: project._id },
    { $pull: { savedProjects: project._id } }
  );
  await project.deleteOne();

  res.json({ success: true, message: 'Project deleted' });
});

/**
 * POST /api/projects/like/:id — toggle
 */
export const toggleLikeProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const uid = req.user._id;
  const index = project.likes.findIndex((id) => String(id) === String(uid));

  const liked = index < 0;

  if (index >= 0) {
    project.likes.splice(index, 1);
  } else {
    project.likes.push(uid);
    if (String(project.createdBy) !== String(uid)) {
      await createNotification({
        userId: project.createdBy,
        type: 'project_like',
        title: `${req.user.name} liked your project`,
        body: project.title,
        link: `/projects/${project._id}`,
        fromUser: req.user._id,
        project: project._id,
      });
    }
  }

  await project.save();

  res.json({
    success: true,
    data: {
      liked,
      likesCount: project.likes.length,
    },
  });
});

/**
 * POST /api/projects/save/:id — toggle bookmark
 */
export const toggleSaveProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const user = await User.findById(req.user._id);
  const pid = project._id;
  const idx = user.savedProjects.findIndex((id) => String(id) === String(pid));

  if (idx >= 0) {
    user.savedProjects.splice(idx, 1);
  } else {
    user.savedProjects.push(pid);
  }

  await user.save();

  res.json({
    success: true,
    data: {
      saved: idx < 0,
      savedCount: user.savedProjects.length,
    },
  });
});

/**
 * POST /api/projects/comment/:id
 */
export const addProjectComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const comment = await Comment.create({
    project: project._id,
    user: req.user._id,
    text: text.trim(),
  });

  await comment.populate('user', authorPublicFields);

  if (String(project.createdBy) !== String(req.user._id)) {
    await createNotification({
      userId: project.createdBy,
      type: 'project_comment',
      title: `${req.user.name} commented on your project`,
      body: text.trim().slice(0, 80),
      link: `/projects/${project._id}`,
      fromUser: req.user._id,
      project: project._id,
    });
  }

  res.status(201).json({
    success: true,
    data: { comment },
  });
});

/**
 * GET /api/projects/:id/comments
 */
export const getProjectComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ project: req.params.id })
    .populate('user', authorPublicFields)
    .sort({ createdAt: -1 });

  res.json({ success: true, data: { comments } });
});

/**
 * PUT /api/projects/comments/:commentId
 */
export const updateProjectComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (String(comment.user) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to edit this comment');
  }

  if (!req.body.text?.trim()) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  comment.text = req.body.text.trim();
  await comment.save();
  await comment.populate('user', authorPublicFields);

  res.json({ success: true, data: { comment } });
});

/**
 * DELETE /api/projects/comments/:commentId
 */
export const deleteProjectComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (String(comment.user) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
  }

  await comment.deleteOne();
  res.json({ success: true, message: 'Comment deleted' });
});
