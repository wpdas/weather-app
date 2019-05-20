const request = require('request');
const memoryCache = require('memory-cache');
const config = require('../../config');

const CACHE_TIME = config.get('CACHE_TIME');
const STATES_URI = config.get('STATES_URI');

// Get state data by code
const getStateByCode = (req, res) => {
  const { cacheKey } = req;
  const { countryCode } = req.query;

  if (!countryCode) {
    return res
      .status(400)
      .json({ error: 'You must inform "countryCode" parameter' });
  }

  const formatedStatesUri = STATES_URI.replace('{countryCode}', countryCode);

  request(formatedStatesUri, (error, response, body) => {
    if (error) {
      return res
        .status(500)
        .json({ error: 'There was an error while loading states data.' });
    }

    // Cache body for this request
    memoryCache.put(cacheKey, body, CACHE_TIME);

    res.contentType('application/json');
    res.send(body);
  });
};

module.exports = {
  getStateByCode
};
