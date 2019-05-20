const PexelsAPI = require('pexels-api-wrapper');
const request = require('request');
const memoryCache = require('memory-cache');
const config = require('../../config');

const CACHE_TIME = config.get('CACHE_TIME');
const OPEN_WEATHER_MAP_URI = config.get('OPEN_WEATHER_MAP_URI');
const pexelsClient = new PexelsAPI(config.get('PEXELS_API_KEY'));

// Get weather details
const getWeatherByCityAndCode = (req, res) => {
  const { city, countryCode } = req.query;

  if (!city) {
    return res.status(400).json({ error: '"city" parameter is missing' });
  } else if (!countryCode) {
    return res
      .status(400)
      .json({ error: '"countryCode" parameter is missing' });
  }

  const formatedWeatherUri = OPEN_WEATHER_MAP_URI.replace(
    '{city}',
    city
  ).replace('{countryCode}', countryCode);

  request(formatedWeatherUri, (error, response, body) => {
    if (error) {
      return res
        .status(500)
        .json({ error: 'There was an error while loading the weather data.' });
    } else if (response && response.statusCode === 404) {
      return res.status(404).json({ error: 'City not found.' });
    }

    getImageIdByPlace(body, req, res);
  });
};

// Seach images in pexel API
const getImageIdByPlace = (weatherData, req, res) => {
  const { cacheKey } = req;
  let jsonWeatherData = JSON.parse(weatherData);

  const { name, weather } = jsonWeatherData;
  const weatherSearchText = weather && weather.length ? weather[0].main : '';
  const pexelsSearchQuery = `${name} ${weatherSearchText}`; // Ex: Sacramento Rain

  // Get image id
  pexelsClient
    .search(pexelsSearchQuery, 5, 1)
    .then(result => {
      // Set Images
      const sortImage = Math.ceil(Math.random() * 4);
      jsonWeatherData.images = {
        large: result.photos[sortImage].src.large,
        large2x: result.photos[sortImage].src.large2x
      };

      // Response containing images
      const bodyResponse = JSON.stringify(jsonWeatherData);

      // Cache weatherData for this request
      memoryCache.put(cacheKey, bodyResponse, CACHE_TIME);
      res.contentType('application/json');
      res.send(bodyResponse);
    })
    .catch(() => {
      // Send normal response
      memoryCache.put(cacheKey, weatherData, CACHE_TIME);
      res.contentType('application/json');
      res.send(weatherData);
    });
};

module.exports = {
  getWeatherByCityAndCode
};
