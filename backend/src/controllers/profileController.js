import User, { EXPERIENCE_LEVELS } from '../models/User.js';
import TeamRequest from '../models/TeamRequest.js';
import { cloudinary } from '../config/cloudinary.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  buildProfileLookup,
  buildSearchFilter,
  calculateProfileCompletion,
  toPrivateProfile,
  toPublicProfile,
} from '../utils/profileHelpers.js';

const normalizeStringArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  return [...new Set(arr.map((s) => String(s).trim().toLowerCase()).filter(Boolean))];
};

const syncGithubFields = (body, user) => {
  const github =
    body.githubProfile?.trim() ||
    body.socialLinks?.github?.trim() ||
    user.githubProfile ||
    user.socialLinks?.github ||
    '';

  user.githubProfile = github;
  user.socialLinks = {
    ...user.socialLinks?.toObject?.() || user.socialLinks || {},
    github: body.socialLinks?.github?.trim() ?? user.socialLinks?.github ?? github,
    linkedin: body.socialLinks?.linkedin?.trim() ?? user.socialLinks?.linkedin ?? '',
    twitter: body.socialLinks?.twitter?.trim() ?? user.socialLinks?.twitter ?? '',
    portfolio: body.socialLinks?.portfolio?.trim() ?? user.socialLinks?.portfolio ?? '',
  };
};

/**
 * GET /api/profile/me
 */
export const getMyProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  const profile = toPrivateProfile(user);
  const profileCompletion = calculateProfileCompletion(user);

  res.json({
    success: true,
    data: {
      profile,
      profileCompletion,
      stats: {
        skillsCount: user.skills?.length || 0,
        techStackCount: user.techStack?.length || 0,
        savedProjectsCount: user.savedProjects?.length || 0,
        collaborationRequestsCount: await TeamRequest.countDocuments({
          receiver: user._id,
          status: 'pending',
        }),
      },
      recentActivity: buildRecentActivity(user),
    },
  });
});

/**
 * PUT /api/profile/update
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const {
    name,
    bio,
    skills,
    techStack,
    education,
    company,
    location,
    experienceLevel,
    interests,
    githubProfile,
    socialLinks,
  } = req.body;

  if (name !== undefined) user.name = name.trim();
  if (bio !== undefined) user.bio = bio.trim();
  if (skills !== undefined) user.skills = normalizeStringArray(skills);
  if (techStack !== undefined) user.techStack = normalizeStringArray(techStack);
  if (interests !== undefined) user.interests = normalizeStringArray(interests);
  if (education !== undefined) user.education = education.trim();
  if (company !== undefined) user.company = company.trim();
  if (location !== undefined) user.location = location.trim();

  if (experienceLevel !== undefined) {
    if (experienceLevel && !EXPERIENCE_LEVELS.includes(experienceLevel)) {
      res.status(400);
      throw new Error(`experienceLevel must be one of: ${EXPERIENCE_LEVELS.join(', ')}`);
    }
    user.experienceLevel = experienceLevel;
  }

  syncGithubFields({ githubProfile, socialLinks }, user);

  const completion = calculateProfileCompletion(user);
  if (completion >= 80 && !user.profileCompletedAt) {
    user.profileCompletedAt = new Date();
  }

  await user.save();

  res.json({
    success: true,
    data: {
      profile: toPrivateProfile(user),
      profileCompletion: completion,
    },
  });
});

/**
 * POST /api/profile/avatar
 */
export const uploadProfileAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload an image file');
  }

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    res.status(503);
    throw new Error(
      'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to backend/.env'
    );
  }

  const user = await User.findById(req.user._id);

  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'devconnect/avatars',
        width: 400,
        height: 400,
        crop: 'fill',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(req.file.buffer);
  });

  user.avatar = uploadResult.secure_url;
  await user.save();

  res.json({
    success: true,
    data: {
      avatar: user.avatar,
      profileCompletion: calculateProfileCompletion(user),
    },
  });
});

/**
 * GET /api/profile/all
 */
export const getAllProfiles = asyncHandler(async (req, res) => {
  const { q, skills, tech, page = 1, limit = 12 } = req.query;
  const filter = buildSearchFilter({ q, skills, tech });

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password -email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(filter),
  ]);

  const profiles = users.map((u) => ({
    ...u,
    profileCompletion: calculateProfileCompletion(u),
  }));

  res.json({
    success: true,
    data: {
      profiles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    },
  });
});

/**
 * GET /api/profile/:id
 */
export const getProfileById = asyncHandler(async (req, res) => {
  const lookup = buildProfileLookup(req.params.id);
  const user = await User.findOne(lookup).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('Developer profile not found');
  }

  const isOwner = req.user && String(req.user._id) === String(user._id);
  const profile = isOwner ? toPrivateProfile(user) : toPublicProfile(user);

  res.json({
    success: true,
    data: {
      profile,
      profileCompletion: calculateProfileCompletion(user),
      isOwner,
    },
  });
});

function buildRecentActivity(user) {
  const items = [];

  if (user.updatedAt) {
    items.push({
      type: 'profile_update',
      message: 'Profile updated',
      date: user.updatedAt,
    });
  }
  if (user.profileCompletedAt) {
    items.push({
      type: 'profile_complete',
      message: 'Profile reached 80% completion',
      date: user.profileCompletedAt,
    });
  }
  if (user.createdAt) {
    items.push({
      type: 'account_created',
      message: 'Joined DevConnect',
      date: user.createdAt,
    });
  }

  return items.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
}
