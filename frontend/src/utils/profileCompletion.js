/** Mirror of backend profile completion fields */
const FIELDS = [
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

const getNested = (obj, path) =>
  path.split('.').reduce((acc, key) => acc?.[key], obj);

export const calculateProfileCompletion = (user) => {
  if (!user) return 0;
  let filled = 0;
  for (const field of FIELDS) {
    const value = getNested(user, field);
    if (Array.isArray(value) && value.length > 0) filled += 1;
    else if (typeof value === 'string' && value.trim()) filled += 1;
  }
  return Math.round((filled / FIELDS.length) * 100);
};

export const EXPERIENCE_LABELS = {
  beginner: 'Beginner',
  junior: 'Junior',
  mid: 'Mid-level',
  senior: 'Senior',
  lead: 'Lead',
};
