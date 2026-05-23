# Frontend ↔ Backend Integration (Auth Module)

## Frontend folder structure

```
frontend/src/
├── config/
│   └── constants.js       # API URL, localStorage keys
├── services/
│   ├── api.js             # Axios instance (baseURL, withCredentials, interceptors)
│   └── authService.js     # register, login, getMe
├── context/
│   └── AuthContext.jsx    # Global auth state
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.jsx
│   │   └── GuestRoute.jsx
│   ├── layout/
│   │   ├── AuthLayout.jsx
│   │   └── Navbar.jsx
│   └── ui/
│       ├── Alert.jsx
│       ├── Button.jsx
│       └── Input.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx
├── utils/
│   └── getErrorMessage.js
└── App.jsx                # React Router routes
```

## Axios setup (`services/api.js`)

```js
baseURL: 'http://localhost:5000/api'
withCredentials: true   // sends cookies if backend sets them; pairs with CORS credentials
```

Request interceptor → reads `devconnect_token` from localStorage → `Authorization: Bearer <token>`

Response interceptor → on 401 (except login/register) → clear storage → redirect `/login`

## Authentication flow (step-by-step)

1. **Sign up** — `Register.jsx` → `AuthContext.register()` → `POST /api/auth/register`
2. Backend creates user, returns `{ user, token }`
3. **Store JWT** — `localStorage.setItem('devconnect_token', token)`
4. **Load full profile** — `GET /api/auth/me` with Bearer token → save user to state + `devconnect_user`
5. **Redirect** — `navigate('/dashboard')`
6. **Login** — same flow with `POST /api/auth/login`
7. **Protected route** — `ProtectedRoute` checks `localStorage` token; while validating, shows spinner; if missing → `/login`
8. **Dashboard** — displays user from `/auth/me`; refreshes profile on visit
9. **Logout** — clears token + user from localStorage and context → `/login`
10. **App reload** — if token exists, `AuthContext` calls `/auth/me` again to restore session

## JWT storage & verification

| Layer | What happens |
|-------|----------------|
| **Store** | After login/register, JWT saved as `devconnect_token` in localStorage |
| **Send** | Axios interceptor adds `Authorization: Bearer <token>` on every request |
| **Verify (backend)** | `protect` middleware in `authMiddleware.js` calls `jwt.verify()` with `JWT_SECRET`, loads user by ID |
| **Expire** | Invalid/expired token → 401 → frontend clears storage and redirects to login |

JWT is **not** stored in cookies in this setup (header-based). `withCredentials: true` keeps the client ready if you add cookie-based auth later.

## Routes

| Path | Guard | API used |
|------|-------|----------|
| `/login` | GuestRoute | POST `/auth/login` |
| `/register` | GuestRoute | POST `/auth/register` |
| `/dashboard` | ProtectedRoute | GET `/auth/me` |

## Error handling

`getErrorMessage()` reads `response.data.message` from backend, e.g.:

- Login: `"Invalid email or password"`
- Register: `"Email already registered"` / `"Username already taken"`
- Network down: friendly message about backend not running

## Interview questions

**Q: How did you connect React to Express?**  
A: Axios instance with `baseURL` pointing to `/api`, JWT in Authorization header, CORS enabled on backend with `credentials: true`.

**Q: Where is the token stored and why?**  
A: localStorage — simple for SPAs; attached via interceptor. Tradeoff: vulnerable to XSS, so we sanitize inputs and avoid storing sensitive data in JS-accessible places beyond the token.

**Q: How does ProtectedRoute work?**  
A: Checks for token in localStorage; waits while AuthContext validates via `/auth/me`; redirects to login if missing or invalid.

**Q: Why call `/auth/me` after login if login already returns user?**  
A: Login returns a subset; `/me` returns the full profile (bio, skills, timestamps) and confirms the token works before entering the dashboard.

**Q: What happens on 401?**  
A: Response interceptor clears auth storage and redirects to login, except during login/register attempts where we show the error inline.

## Test checklist

1. Backend running on port 5000
2. `npm run dev` in frontend
3. Register new user → lands on dashboard with profile
4. Logout → login again with wrong password → see error message
5. Open `/dashboard` without token → redirected to login
6. Refresh page while logged in → session restored
