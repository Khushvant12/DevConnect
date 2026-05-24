/**
 * CORS — CLIENT_URL is comma-separated origins (no trailing slashes).
 * In production, *.vercel.app is allowed so deploys work even if CLIENT_URL is mistyped.
 */
export function getAllowedOrigins() {
  const raw = process.env.CLIENT_URL || 'http://localhost:5173';
  return raw
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}

function isVercelProductionOrigin(origin) {
  return (
    process.env.NODE_ENV === 'production' &&
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)
  );
}

export function isOriginAllowed(origin) {
  if (!origin) return true;

  const normalized = origin.replace(/\/+$/, '');
  const allowed = getAllowedOrigins();

  if (allowed.includes(normalized)) return true;
  if (isVercelProductionOrigin(normalized)) return true;

  return false;
}

export const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      callback(null, origin || true);
    } else {
      console.warn(
        `CORS blocked: ${origin}. Allowed: ${getAllowedOrigins().join(', ')}`
      );
      callback(null, false);
    }
  },
  credentials: true,
};
