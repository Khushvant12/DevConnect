/**
 * Parse CLIENT_URL — supports comma-separated origins for dev + production frontends.
 */
export function getAllowedOrigins() {
  const raw = process.env.CLIENT_URL || 'http://localhost:5173';
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const corsOptions = {
  origin: getAllowedOrigins(),
  credentials: true,
};
