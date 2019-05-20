const request = require('request');
const memoryCache = require('memory-cache');
const config = require('../../config');

const CACHE_TIME = config.get('CACHE_TIME');
const COUNTRIES_URI = config.get('COUNTRIES_URI');

// Get all countries
const getAllCountries = (req, res) => {
  const { cacheKey } = req;

  request(COUNTRIES_URI, (error, response, body) => {
    if (error) {
      return res
        .status(500)
        .json({ error: 'There was an error while loading countries.' });
    }

    // Cache body for this request
    memoryCache.put(cacheKey, body, CACHE_TIME);

    res.contentType('application/json');
    res.send(body);
  });
};

module.exports = {
  getAllCountries
};
