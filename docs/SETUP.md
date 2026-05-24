# DevConnect — Setup Guide

## MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and whitelist your IP (or `0.0.0.0/0` for dev).
3. Copy the connection string: `mongodb+srv://<user>:<pass>@cluster.mongodb.net/devconnect`

## Backend `.env`

Copy `backend/.env.example` to `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/devconnect
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Frontend environment

Local dev uses `frontend/.env.development` (defaults to `http://localhost:5000` → API base `http://localhost:5000/api`).

Production builds use `frontend/.env.production` (Render backend). On Vercel you can override with the same variables.

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

Production (Vercel **or** `.env.production`):

```env
VITE_API_URL=https://devconnect-backend-opz0.onrender.com
VITE_SOCKET_URL=https://devconnect-backend-opz0.onrender.com
```

Rules:

- Set **origin only** (no `/api` in `VITE_API_URL`); `src/config/env.js` appends `/api` exactly once.
- Never use relative URLs like `/api` for production — requests would hit the frontend host.
- All REST calls go through `src/services/api.js` (Axios `baseURL` = resolved API base).

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| `backend/` | `npm run dev` | Nodemon dev server |
| `backend/` | `npm start` | Production start |
| `frontend/` | `npm run dev` | Vite dev server |
| `frontend/` | `npm run build` | Production build |

## Cloudinary (profile photos)

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. From the dashboard, copy **Cloud name**, **API Key**, and **API Secret**.
3. Add them to `backend/.env` (see `backend/.env.example`).
4. Restart the backend server.
5. In the app, open **Dashboard → Edit profile → Upload photo**.

If upload returns 503, Cloudinary env vars are missing or incorrect.

## Troubleshooting

- **CORS errors**: Ensure `CLIENT_URL` includes your frontend origin (comma-separated for multiple).
- **API hits `/auth/login` on the frontend domain**: Rebuild frontend — `API_BASE_URL` must be absolute (`http://localhost:5000/api` locally, Render URL in prod). Check browser Network tab for full request URL.
- **JWT invalid**: Clear `localStorage` token and log in again.
- **Mongo connection**: Check URI, network access, and credentials.
