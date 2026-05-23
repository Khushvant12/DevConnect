# Module 1 — Foundation & Authentication

This document explains everything built in the first module.

## Folder Structure

```
DevConnect/
├── backend/
│   ├── src/
│   │   ├── config/          # DB & Cloudinary
│   │   ├── controllers/     # Route logic (authController)
│   │   ├── middleware/      # auth, errors, validation
│   │   ├── models/          # Mongoose schemas (User)
│   │   ├── routes/          # API route definitions
│   │   ├── utils/           # JWT, asyncHandler
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # HTTP server entry
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # UI, layout, auth
│   │   ├── context/         # Auth & Theme state
│   │   ├── hooks/           # useForm
│   │   ├── pages/           # Home, Login, Register, Dashboard
│   │   ├── services/        # axios api + authService
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── docs/
```

## Backend Routes (Auth)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login, get JWT |
| GET | `/api/auth/me` | Yes | Current user |

## Authentication Flow

1. **Register/Login** → Server validates input → creates/finds user → `bcrypt` compares password on login → `generateToken(userId)` signs JWT.
2. **Client** stores token in `localStorage` as `devconnect_token`.
3. **Axios interceptor** adds `Authorization: Bearer <token>` to every request.
4. **Protected routes** use `protect` middleware: verify JWT → load user → `req.user`.
5. **On 401** (expired/invalid token) → frontend clears storage → redirects to `/login`.
6. **App load** → `AuthContext` calls `/auth/me` if token exists → restores session.

## User Schema (MongoDB)

| Field | Type | Notes |
|-------|------|-------|
| name | String | Required |
| email | String | Unique, lowercase |
| username | String | Unique, `a-z0-9_` |
| password | String | Hashed, `select: false` |
| avatar, bio | String | Profile (next module) |
| skills, interests | [String] | Matching (later) |
| socialLinks | Object | github, linkedin, etc. |
| isOnline, lastSeen | Boolean/Date | Chat module |
| savedProjects | [ObjectId] | Projects module |

## Socket.IO (Placeholder)

`server.js` creates `http.createServer(app)`. Socket.IO will attach to this same server in the chat module — one port for REST + WebSockets.

## Interview Questions & How to Answer

### 1. "How does JWT authentication work in your project?"

**Answer:** On login/register we sign a JWT with the user ID and secret from env. The client sends it in the `Authorization` header. Middleware `protect` verifies the signature, decodes the ID, loads the user from MongoDB, and attaches it to `req.user`. We don't store sessions on the server — stateless auth, good for scaling on Render.

### 2. "Why bcrypt and `select: false` on password?"

**Answer:** bcrypt salts and hashes passwords so DB leaks don't expose plain text. `select: false` means Mongoose won't return password in normal queries — we only `.select('+password')` on login when we need to compare.

### 3. "Explain your MVC structure."

**Answer:** **Models** define data (User schema). **Controllers** hold business logic (register, login). **Routes** map URLs to controllers and validators. **Middleware** handles cross-cutting concerns — auth, errors, validation. Keeps routes thin and testable.

### 4. "How do you handle errors?"

**Answer:** `asyncHandler` wraps async routes and forwards rejections to `errorHandler`. That middleware normalizes Mongoose validation errors, duplicate keys (11000), JWT errors, and returns consistent `{ success: false, message }` JSON.

### 5. "How does the React protected route work?"

**Answer:** `ProtectedRoute` checks `isAuthenticated` from context. While `loading` is true (restoring session via `/auth/me`), we show a spinner. If not authenticated, `<Navigate to="/login" />` with `state.from` so we can redirect back after login.

### 6. "What is the purpose of axios interceptors?"

**Answer:** Request interceptor attaches the token automatically so we don't repeat that in every service call. Response interceptor handles global 401 — logout and redirect — one place for session expiry behavior.

## Next Module

**Module 2 — Developer Profiles**: edit profile, avatar upload (Cloudinary), skills, social links, public profile page.
