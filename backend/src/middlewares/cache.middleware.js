const store = new Map();

/**
 * In-memory GET response cache with TTL (seconds).
 * Speeds up repeated reads for public market endpoints.
 */
export const cacheMiddleware = (ttlSeconds = 60) => (req, res, next) => {
  if (req.method !== 'GET') return next();

  const key = req.originalUrl || req.url;
  const hit = store.get(key);

  if (hit && Date.now() < hit.expiresAt) {
    res.set('X-Cache', 'HIT');
    res.set('Cache-Control', `public, max-age=${ttlSeconds}`);
    return res.status(hit.statusCode).json(hit.body);
  }

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    store.set(key, {
      body,
      statusCode: res.statusCode || 200,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
    res.set('X-Cache', 'MISS');
    res.set('Cache-Control', `public, max-age=${ttlSeconds}`);
    return originalJson(body);
  };

  next();
};

export const clearResponseCache = () => store.clear();
