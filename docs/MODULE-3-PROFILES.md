# Module 3 — Developer Profiles & Dashboard

## Folder structure (new files)

```
backend/src/
├── controllers/profileController.js
├── middleware/uploadMiddleware.js
├── routes/profileRoutes.js
└── utils/profileHelpers.js

frontend/src/
├── components/profile/
│   ├── ProfileCard.jsx
│   ├── ProfileHeader.jsx
│   ├── SkillBadge.jsx
│   └── EditProfileModal.jsx
├── components/dashboard/
│   ├── DashboardSidebar.jsx
│   └── StatCard.jsx
├── components/layout/DashboardLayout.jsx
├── pages/Profile.jsx
├── pages/Developers.jsx
├── pages/DeveloperProfile.jsx
├── services/profileService.js
└── utils/profileCompletion.js
```

## MongoDB schema (User extensions)

| Field | Type | Purpose |
|-------|------|---------|
| techStack | [String] | Technology badges |
| education | String | Degree / school |
| company | String | College or company |
| location | String | City, country |
| experienceLevel | enum | beginner → lead |
| profileCompletedAt | Date | Set when completion ≥ 80% |

Existing: `avatar`, `bio`, `skills`, `socialLinks`, `githubProfile`

## API routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/profile/me` | Yes | Own profile + stats + activity |
| PUT | `/api/profile/update` | Yes | Update profile fields |
| POST | `/api/profile/avatar` | Yes | Cloudinary image upload |
| GET | `/api/profile/all` | No | Search developers |
| GET | `/api/profile/:id` | Optional | Profile by ID or username |

### Search query params (`/profile/all`)

- `q` — name, username, bio
- `skills` — comma-separated (must match all)
- `tech` — comma-separated tech stack
- `page`, `limit` — pagination

## Image upload flow

1. User selects image in `EditProfileModal`
2. `POST /api/profile/avatar` with `multipart/form-data`, field `image`
3. Multer stores file in memory (max 5MB, images only)
4. Buffer streamed to Cloudinary `devconnect/avatars` folder
5. `secure_url` saved to `user.avatar` in MongoDB
6. Frontend preview via `URL.createObjectURL` before upload

### Cloudinary setup (if env missing)

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Dashboard → copy **Cloud name**, **API Key**, **API Secret**
3. Add to `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Restart backend (`npm run dev`)
5. Upload again from Edit Profile

Without Cloudinary, API returns **503** with setup instructions.

## Protected route logic

- `ProtectedRoute` checks JWT in `localStorage`
- Profile **edit** only via modal on `/profile`, `/dashboard` (protected)
- Public view: `/developers/:username` (no email shown)
- `optionalProtect` on `GET /profile/:id` — if token matches owner, email included

## Interview questions

**Q: How do you calculate profile completion?**  
A: We define N required fields (avatar, bio, skills, etc.). Count how many are non-empty. `(filled / N) * 100`. Same logic on backend and frontend for consistency.

**Q: Why Multer + Cloudinary instead of saving files on disk?**  
A: Render/Vercel have ephemeral filesystems. Cloudinary CDN handles storage, resizing, and HTTPS URLs.

**Q: How does search by skills work?**  
A: Skills stored lowercase. Query `skills=react,node` uses MongoDB `$all` so user must have every listed skill.

**Q: Public vs private profile data?**  
A: `toPublicProfile()` strips email. Owner viewing own profile or `/profile/me` gets full data including email.

**Q: How do you prevent invalid file uploads?**  
A: Multer `fileFilter` for `image/*`, 5MB limit, Cloudinary transformation for consistent avatar size.

## Manual test checklist

- [ ] GET `/api/profile/me` with token
- [ ] PUT `/api/profile/update` — add bio, skills, tech stack
- [ ] Profile completion % increases on dashboard
- [ ] Upload avatar (with Cloudinary configured)
- [ ] Search developers by name and skills
- [ ] View another user at `/developers/:username`
- [ ] Edit own profile via modal; public page updates
- [ ] Logout; public profile still visible without email
