const request = require('supertest');
const assert = require('chai').assert;
const app = require('../../index');
const nocks = require('../nocks');
const fixtures = require('../fixtures');

describe('Middleware', () => {
  after(() => {
    nocks.cleanAll();
  });

  describe('cache - functional', () => {
    it('Should cache the body result', done => {
      const options = {
        status: 200,
        response: fixtures.weatherWithoutImages,
        countryCode: 'USAy',
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

    it('Should return cached body for the previous same request', done => {
      const options = {
        status: 200,
        response: fixtures.weatherWithoutImages,
        countryCode: 'USAy',
        city: 'Madison'
      };

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
          done();
        });
    });
  });
});
