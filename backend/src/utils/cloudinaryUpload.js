import { cloudinary } from '../config/cloudinary.js';

export const uploadImageBuffer = (buffer, folder = 'devconnect/projects') => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    const err = new Error(
      'Cloudinary is not configured. Add CLOUDINARY_* variables to backend/.env'
    );
    err.statusCode = 503;
    throw err;
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ width: 800, height: 450, crop: 'fill' }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};
