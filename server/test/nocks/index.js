const nock = require('nock');
const fixtures = require('../fixtures');
const config = require('../../config');

const cleanAll = () => {
  nock.cleanAll();
};

// Countries
const countries = options => {
  const uri = 'https://restcountries.eu';
  options = options || {};

  switch (options.status) {
    case 200:
      return nock(uri)
        .get('/rest/v2/all')
        .reply(options.status, options.response || {});
    case 500:
      return nock(uri)
        .get('/rest/v2/all')
        .replyWithError('Error on server');
    default:
      return;
  }
};

// State
const state = options => {
  const uri = 'http://services.groupkt.com';
  options = options || {};

  const path = options.countryCode
    ? `/state/get/${options.countryCode}/all`
    : '';

  switch (options.status) {
    case 200:
      return nock(uri)
        .get(path)
        .reply(options.status, options.response || {});
    case 500:
      return nock(uri)
        .get(path)
        .replyWithError('Error on server');
    default:
      return;
  }
};

// Weather
const weather = options => {
  const uri = 'https://api.openweathermap.org';
  options = options || {};

  const path = `/data/2.5/weather?q=${options.city},${
    options.countryCode
  }&units=metric&appid=58ff0718a86aa77fc9f754c6fb8a34d6`;

  switch (options.status) {
    case 200:
      return nock(uri)
        .get(path)
        .reply(options.status, options.response || {});
    case 404:
      return nock(uri)
        .get(path)
        .reply(options.status);
    case 500:
      return nock(uri)
        .get(path)
        .replyWithError('Error on server');
    default:
      return;
  }
};

// Pexel API
const pexelAPI = options => {
  const uri = 'https://api.pexels.com';
  options = options || {};

  const path = `/v1/search?query=${options.city}%20Clouds&per_page=5&page=1`;

  switch (options.status) {
    case 200:
      return nock(uri)
        .matchHeader('Authorization', config.get('PEXELS_API_KEY'))
        .get(path)
        .reply(options.status, fixtures.pexelSearch);
    case 500:
      return nock(uri)
        .matchHeader('Authorization', config.get('PEXELS_API_KEY'))
        .get(path)
        .replyWithError('Error on server');
    default:
      return;
  }
};

module.exports = {
  cleanAll,
  countries,
  state,
  weather,
  pexelAPI
};
