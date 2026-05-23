import { v2 as cloudinary } from 'cloudinary';

/**
 * Cloudinary config for profile/project image uploads.
 * Skips setup if credentials are missing (auth still works without uploads).
 */
export const configureCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn('Cloudinary credentials missing — image upload disabled');
    return false;
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  return true;
};

export { cloudinary };
