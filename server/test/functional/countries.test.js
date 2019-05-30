const app = require('../../index');
const request = require('supertest');
const assert = require('chai').assert;
const nocks = require('../nocks');
const fixtures = require('../fixtures');

describe('Countries', () => {
  after(() => {
    nocks.cleanAll();
  });

  describe('GET /api/countries', () => {
    it('Should return error 500', done => {
      const options = {
        status: 500
      };

      const countriesNock = nocks.countries(options);

      request(app)
        .get('/api/countries')
        .end((err, res) => {
          const response = res.body;
          assert.strictEqual(res.status, options.status);
          assert.strictEqual(
            response.error,
            'There was an error while loading countries.'
          );
          assert.strictEqual(countriesNock.isDone(), true);
          done();
        });
    });

    it('Should return the list of countries', done => {
      const options = {
        status: 200,
        response: fixtures.countries
      };

      const countriesNock = nocks.countries(options);

      request(app)
        .get('/api/countries')
        .end((err, res) => {
          const response = res.body;
          assert.isNull(err);
          assert.strictEqual(countriesNock.isDone(), true);
          assert.strictEqual(res.status, options.status);
          assert.deepEqual(response, options.response);
          done();
        });
    });
  });
});
