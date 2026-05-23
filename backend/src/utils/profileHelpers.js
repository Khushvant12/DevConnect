import mongoose from 'mongoose';

/** Fields used to calculate profile completion % */
const PROFILE_FIELDS = [
  'avatar',
  'bio',
  'skills',
  'techStack',
  'education',
  'company',
  'location',
  'experienceLevel',
  'githubProfile',
  'socialLinks.github',
  'socialLinks.linkedin',
  'socialLinks.portfolio',
];

const getNested = (obj, path) => {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
};

/**
 * Profile completion 0–100 based on filled fields.
 */
export const calculateProfileCompletion = (user) => {
  if (!user) return 0;

  let filled = 0;
  for (const field of PROFILE_FIELDS) {
    const value = getNested(user, field);
    if (Array.isArray(value) && value.length > 0) filled += 1;
    else if (typeof value === 'string' && value.trim()) filled += 1;
  }

  return Math.round((filled / PROFILE_FIELDS.length) * 100);
};

/**
 * Public-safe profile (no email, no password).
 */
export const toPublicProfile = (user) => {
  if (!user) return null;
  const doc = user.toObject ? user.toObject() : { ...user };
  delete doc.password;
  delete doc.email;
  return doc;
};

/**
 * Own profile — includes email.
 */
export const toPrivateProfile = (user) => {
  if (!user) return null;
  const doc = user.toObject ? user.toObject() : { ...user };
  delete doc.password;
  return doc;
};

/**
 * Resolve :id param as MongoDB ObjectId or username.
 */
export const buildProfileLookup = (idOrUsername) => {
  if (mongoose.Types.ObjectId.isValid(idOrUsername)) {
    return { _id: idOrUsername };
  }
  return { username: idOrUsername.toLowerCase() };
};

/**
 * Parse comma-separated query into trimmed lowercase tokens.
 */
export const parseListParam = (value) => {
  if (!value || typeof value !== 'string') return [];
  return value
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
};

/**
 * Build MongoDB filter for developer search.
 */
export const buildSearchFilter = ({ q, skills, tech }) => {
  const filter = {};

  if (q?.trim()) {
    const regex = new RegExp(q.trim(), 'i');
    filter.$or = [{ name: regex }, { username: regex }, { bio: regex }];
  }

  const skillList = parseListParam(skills);
  if (skillList.length) {
    filter.skills = { $all: skillList };
  }

  const techList = parseListParam(tech);
  if (techList.length) {
    filter.techStack = { $all: techList };
  }

  return filter;
};
