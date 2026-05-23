import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * POST /api/auth/register
 * Creates user, hashes password via User model pre-save hook.
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, username } = req.body;

  const existing = await User.findOne({
    $or: [{ email }, { username: username?.toLowerCase() }],
  });

  if (existing) {
    res.status(400);
    throw new Error(
      existing.email === email.toLowerCase()
        ? 'Email already registered'
        : 'Username already taken'
    );
  }

  const user = await User.create({
    name,
    email,
    password,
    username: username.toLowerCase(),
  });

  res.status(201).json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
      },
      token: generateToken(user._id),
    },
  });
});

/**
 * POST /api/auth/login
 * Validates credentials and returns JWT.
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+password'
  );

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
      },
      token: generateToken(user._id),
    },
  });
});

/**
 * GET /api/auth/me
 * Returns authenticated user (protected route).
 */
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user },
  });
});
