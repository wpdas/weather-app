const app = require('../../index');
const request = require('supertest');
const assert = require('chai').assert;
const nocks = require('../nocks');
const fixtures = require('../fixtures');

describe('Weather', () => {
  after(() => {
    nocks.cleanAll();
  });

  describe('GET /api/weather', () => {
    it('Should return error 500', done => {
      const options = {
        status: 500,
        countryCode: 'USA',
        city: 'Madison'
      };

      const weatherNock = nocks.weather(options);

      request(app)
        .get(
          `/api/weather?city=${options.city}&countryCode=${options.countryCode}`
        )
        .end((err, res) => {
          const response = res.body;
          assert.strictEqual(res.status, options.status);
          assert.strictEqual(
            response.error,
            'There was an error while loading the weather data.'
          );
          assert.strictEqual(weatherNock.isDone(), true);
          done();
        });
    });

    it('Should return status 400 when "city" parameter is missing', done => {
      const options = {
        status: 400,
        countryCode: 'USA',
        city: ''
      };

      request(app)
        .get(
          `/api/weather?city=${options.city}&countryCode=${options.countryCode}`
        )
        .end((err, res) => {
          const response = res.body;
          assert.strictEqual(res.status, options.status);
          assert.strictEqual(response.error, '"city" parameter is missing');
          done();
        });
    });

    it('Should return status 400 when "countryCode" parameter is missing', done => {
      const options = {
        status: 400,
        countryCode: '',
        city: 'Madison'
      };

      request(app)
        .get(
          `/api/weather?city=${options.city}&countryCode=${options.countryCode}`
        )
        .end((err, res) => {
          const response = res.body;
          assert.strictEqual(res.status, options.status);
          assert.strictEqual(
            response.error,
            '"countryCode" parameter is missing'
          );
          done();
        });
    });

    it('Should return status 404 when not city found', done => {
      const options = {
        status: 404,
        countryCode: 'XXX',
        city: 'YYY'
      };

      const weatherNock = nocks.weather(options);

      request(app)
        .get(
          `/api/weather?city=${options.city}&countryCode=${options.countryCode}`
        )
        .end((err, res) => {
          const response = res.body;
          assert.strictEqual(res.status, options.status);
          assert.strictEqual(response.error, 'City not found.');
          assert.strictEqual(weatherNock.isDone(), true);
          done();
        });
    });

    it('Should return the right weather forecast data via "countryCode" and "city" query plus images from pexel API', done => {
      const options = {
        status: 200,
        response: fixtures.weatherWithoutImages,
        countryCode: 'USA',
        city: 'Madison'
      };

      const pexelOptions = {
        status: 200,
        city: options.city
      };

      const weatherNock = nocks.weather(options);
      const pexelNock = nocks.pexelAPI(pexelOptions);

      const finalWeatherBody = fixtures.weather;

      request(app)
        .get(
          `/api/weather?city=${options.city}&countryCode=${options.countryCode}`
        )
        .end((err, res) => {
          const response = res.body;
          assert.isNull(err);
          assert.strictEqual(res.status, options.status);
          assert.deepEqual(response, finalWeatherBody);
          assert.isDefined(response.images);
          assert.isDefined(response.images.large);
          assert.isDefined(response.images.large2x);
          assert.strictEqual(pexelNock.isDone(), true);
          assert.strictEqual(weatherNock.isDone(), true);
          done();
        });
    });

    it('Should return the right weather forecast data via "countryCode" and "city" query without images', done => {
      const options = {
        status: 200,
        response: fixtures.weatherWithoutImages,
        countryCode: 'USAx',
        city: 'Madison'
      };

      const pexelOptions = {
        status: 500,
        city: options.city
      };

      const weatherNock = nocks.weather(options);
      const pexelNock = nocks.pexelAPI(pexelOptions);

      request(app)
        .get(
          `/api/weather?city=${options.city}&countryCode=${options.countryCode}`
        )
        .end((err, res) => {
          const response = res.body;
          assert.isNull(err);
          assert.strictEqual(res.status, options.status);
          assert.deepEqual(response, options.response);
          assert.isUndefined(response.images);
          assert.strictEqual(pexelNock.isDone(), true);
          assert.strictEqual(weatherNock.isDone(), true);
          done();
        });
    });
  });
});
