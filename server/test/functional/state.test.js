const app = require('../../index');
const request = require('supertest');
const assert = require('chai').assert;
const nocks = require('../nocks');
const fixtures = require('../fixtures');

describe('State', () => {
  after(() => {
    nocks.cleanAll();
  });

  describe('GET /api/state', () => {
    it('Should return error 500', done => {
      const options = {
        status: 500,
        countryCode: 'USA'
      };

      const stateNock = nocks.state(options);

      request(app)
        .get(`/api/state?countryCode=${options.countryCode}`)
        .end((err, res) => {
          const response = res.body;
          assert.strictEqual(res.status, options.status);
          assert.strictEqual(
            response.error,
            'There was an error while loading states data.'
          );
          assert.strictEqual(stateNock.isDone(), true);
          done();
        });
    });

    it('Should return the right state/sub-division via "countryCode" query containing 55 records', done => {
      const options = {
        status: 200,
        response: fixtures.state,
        countryCode: 'USA'
      };

      const stateNock = nocks.state(options);

      request(app)
        .get(`/api/state?countryCode=${options.countryCode}`)
        .end((err, res) => {
          const response = res.body;
          assert.isNull(err);
          assert.strictEqual(stateNock.isDone(), true);
          assert.strictEqual(res.status, options.status);
          assert.deepEqual(response, options.response);
          assert.strictEqual(response.RestResponse.result.length, 55);
          done();
        });
    });

    it('Should return 0 records found', done => {
      const options = {
        status: 200,
        response: fixtures.stateNotFound,
        countryCode: 'TUV'
      };

      const stateNock = nocks.state(options);

      request(app)
        .get(`/api/state?countryCode=${options.countryCode}`)
        .end((err, res) => {
          const response = res.body;
          assert.isNull(err);
          assert.strictEqual(stateNock.isDone(), true);
          assert.strictEqual(res.status, options.status);
          assert.deepEqual(response, options.response);
          assert.strictEqual(response.RestResponse.result.length, 0);
          done();
        });
    });
  });
});
