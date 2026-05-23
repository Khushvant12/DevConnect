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

## Frontend `.env`

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

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

- **CORS errors**: Ensure `CLIENT_URL` matches your Vite URL.
- **JWT invalid**: Clear `localStorage` token and log in again.
- **Mongo connection**: Check URI, network access, and credentials.
