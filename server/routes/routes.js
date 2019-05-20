const express = require('express');
const router = express.Router();

const countryController = require('./controllers/country.controller');
const stateController = require('./controllers/state.controller');
const weatherController = require('./controllers/weather.controller');

/**
 * Country
 */
router.get('/countries', countryController.getAllCountries);

/**
 * State
 * @query countryCode
 */
router.get('/state', stateController.getStateByCode);

/**
 * Weather
 * @query city
 * @query countryCode
 */
router.get('/weather', weatherController.getWeatherByCityAndCode);

module.exports = router;
