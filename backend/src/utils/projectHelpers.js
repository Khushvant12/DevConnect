import Comment from '../models/Comment.js';

export const normalizeTechStack = (arr) => {
  if (!Array.isArray(arr)) {
    if (typeof arr === 'string') {
      return arr
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    }
    return [];
  }
  return [...new Set(arr.map((s) => String(s).trim().toLowerCase()).filter(Boolean))];
};

/**
 * Build filter for project search / feed.
 */
export const buildProjectFilter = ({ q, tech, category, difficulty }) => {
  const filter = {};

  if (q?.trim()) {
    const regex = new RegExp(q.trim(), 'i');
    filter.$or = [{ title: regex }, { description: regex }];
  }

  if (tech?.trim()) {
    const list = tech
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    if (list.length) filter.techStack = { $all: list };
  }

  if (category?.trim()) filter.category = category.trim().toLowerCase();
  if (difficulty?.trim()) filter.difficulty = difficulty.trim().toLowerCase();

  return filter;
};

export const getSortOption = (sort) => {
  switch (sort) {
    case 'liked':
      return { likesCount: -1, createdAt: -1 };
    case 'trending':
      return { trendingScore: -1, createdAt: -1 };
    case 'latest':
    default:
      return { createdAt: -1 };
  }
};

/**
 * Attach engagement fields for API responses.
 */
export const enrichProject = (project, userId) => {
  const doc = project.toObject ? project.toObject() : { ...project };
  const likes = doc.likes || [];
  doc.likesCount = likes.length;
  doc.commentsCount = doc.commentsCount ?? 0;
  delete doc.likes;

  if (userId) {
    const uid = String(userId);
    doc.isLiked = likes.some((id) => String(id) === uid);
    doc.isSaved = Boolean(doc.isSaved);
  }

  return doc;
};

export const getCommentsCountMap = async (projectIds) => {
  if (!projectIds.length) return {};
  const counts = await Comment.aggregate([
    { $match: { project: { $in: projectIds } } },
    { $group: { _id: '$project', count: { $sum: 1 } } },
  ]);
  return counts.reduce((acc, { _id, count }) => {
    acc[String(_id)] = count;
    return acc;
  }, {});
};
