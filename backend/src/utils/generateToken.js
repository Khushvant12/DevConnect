import jwt from 'jsonwebtoken';

/**
 * Sign a JWT for the authenticated user.
 * Payload keeps minimal data — full user loaded via /auth/me.
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};
