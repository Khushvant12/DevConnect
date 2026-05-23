# DevConnect API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require header:

```
Authorization: Bearer <jwt_token>
```

### POST `/auth/register`

Register a new developer account.

**Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePass123",
  "username": "janedev"
}
```

**Response `201`:**

```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "...", "email": "...", "username": "..." },
    "token": "eyJhbG..."
  }
}
```

### POST `/auth/login`

**Body:**

```json
{
  "email": "jane@example.com",
  "password": "securePass123"
}
```

**Response `200`:** Same shape as register.

### GET `/auth/me` (Protected)

Returns current user profile.

**Response `200`:**

```json
{
  "success": true,
  "data": { "user": { ... } }
}
```

## Profiles

### GET `/profile/me` (Protected)

Returns profile, completion %, stats, recent activity.

### PUT `/profile/update` (Protected)

**Body (all optional):**

```json
{
  "name": "Jane Doe",
  "bio": "Full-stack developer",
  "skills": ["react", "node"],
  "techStack": ["mongodb", "express"],
  "education": "B.Tech CS",
  "company": "Acme Inc",
  "location": "Bangalore",
  "experienceLevel": "mid",
  "githubProfile": "https://github.com/janedev",
  "socialLinks": {
    "github": "https://github.com/janedev",
    "linkedin": "https://linkedin.com/in/janedev",
    "portfolio": "https://janedev.dev"
  }
}
```

### POST `/profile/avatar` (Protected)

`multipart/form-data` with field `image` (max 5MB).

### GET `/profile/all`

Query: `q`, `skills`, `tech`, `page`, `limit`

### GET `/profile/:id`

`:id` = MongoDB ObjectId or username. Public (email hidden). Optional Bearer token for owner view.

## Projects

### POST `/projects/create` (Protected)

`multipart/form-data`: `title`, `description`, `techStack` (JSON string), `githubLink`, `liveDemoLink`, `category`, `difficulty`, `teamSize`, optional `thumbnail` (image).

### GET `/projects/all`

Query: `q`, `tech`, `category`, `difficulty`, `developer`, `sort` (`latest`|`liked`|`trending`), `page`, `limit`.

### GET `/projects/saved` (Protected)

### GET `/projects/:id`

### PUT `/projects/update/:id` (Owner)

### DELETE `/projects/:id` (Owner)

### POST `/projects/like/:id` (Protected) — toggle

### POST `/projects/save/:id` (Protected) — toggle

### POST `/projects/comment/:id` (Protected) — body: `{ "text": "..." }`

### GET `/projects/:id/comments`

### PUT `/projects/comments/:commentId`

### DELETE `/projects/comments/:commentId`

## Health

### GET `/health`

```json
{ "success": true, "message": "DevConnect API is running" }
```

## Error Format

```json
{
  "success": false,
  "message": "Error description"
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Validation error |
| 401 | Unauthorized |
| 404 | Not found |
| 500 | Server error |
