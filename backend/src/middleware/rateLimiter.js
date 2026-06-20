// In-memory request store
const store = new Map();

// Cleanup interval (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (now - value.resetTime > 0) {
      store.delete(key);
    }
  }
}, 10 * 60 * 1000).unref(); // unref allows process exit if server is shutting down

/**
 * Lightweight, zero-dependency in-memory rate limiter middleware.
 * Prevents API brute force attacks.
 */
export const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // default 15 mins
  const max = options.max || 100; // default 100 requests per window
  const message = options.message || 'Too many requests from this IP, please try again later';

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    let client = store.get(ip);

    if (!client) {
      client = {
        hits: 1,
        resetTime: now + windowMs,
      };
      store.set(ip, client);
    } else {
      if (now > client.resetTime) {
        // Window expired, reset
        client.hits = 1;
        client.resetTime = now + windowMs;
      } else {
        client.hits += 1;
      }
    }

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - client.hits));
    res.setHeader('X-RateLimit-Reset', Math.ceil(client.resetTime / 1000));

    if (client.hits > max) {
      return res.status(429).json({
        success: false,
        message,
      });
    }

    next();
  };
};
// Force reload to clear in-memory rate limit store
