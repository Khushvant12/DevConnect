# DevConnect — Developer Collaboration Platform

A full-stack platform where developers create profiles, showcase projects, find teammates, and chat in real time.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, Socket.IO |
| Other | Cloudinary, bcrypt, dotenv |

## Project Structure

```
DevConnect/
├── backend/          # Express API (MVC)
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── utils/
│       ├── app.js
│       └── server.js
├── frontend/         # React + Vite SPA
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       └── utils/
├── docs/             # API & setup guides
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Cloudinary account (for profile images — optional in dev)

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

API runs at `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Environment Variables

See [docs/SETUP.md](docs/SETUP.md) and [docs/API.md](docs/API.md).

## Deployment

| Service | Host |
|---------|------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

## Modules (build order)

1. ✅ Folder structure, backend & frontend setup, authentication
2. ✅ Developer profiles & dashboard
3. ✅ Project showcase & developer feed
4. ✅ Real-time chat & team collaboration
5. Tech stack matching
7. Search & filters
8. Dashboard

## License

MIT
