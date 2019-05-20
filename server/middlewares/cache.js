const memoryCache = require('memory-cache');

// Caching requests
const cache = (req, res, next) => {
  const { originalUrl, url } = req;
  const key = `cache_${originalUrl || url}_`;
  const cachedBody = memoryCache.get(key);

  if (cachedBody) {
    res.contentType('application/json');
    return res.send(cachedBody);
  }

  // Set cache key reference
  req.cacheKey = key;

  next();
};

module.exports = cache;
