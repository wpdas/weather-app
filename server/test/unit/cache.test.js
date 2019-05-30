const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const assert = chai.assert;
const expect = chai.expect;
const memoryCache = require('memory-cache');
const cacheMiddleware = require('../../middlewares/cache');

describe('Middleware', () => {
  describe('cache - unit', () => {
    it('Should get "req.cacheKey" a value', () => {
      const req = {
        originalUrl: 'test',
        url: 'test'
      };
      const res = {};
      const next = chai.spy();
      const testBodyData = 'testBodyData';

      cacheMiddleware(req, res, next);
      expect(next).to.have.been.called();
      expect(next).to.have.been.called.once;
      expect(next).to.have.been.called.with();
      assert.isDefined(req.cacheKey);
      assert.strictEqual(req.cacheKey, 'cache_test_');
      memoryCache.put(req.cacheKey, testBodyData);
    });

    it('Should get cached body', () => {
      const req = {
        originalUrl: 'test',
        url: 'test'
      };
      const res = {
        contentType: chai.spy(),
        send: chai.spy()
      };
      const next = chai.spy();

      cacheMiddleware(req, res, next);
      expect(next).to.not.have.been.called();
      expect(res.contentType).to.have.been.called();
      expect(res.contentType).to.have.been.called.once;
      expect(res.contentType).to.have.been.called.with('application/json');
      expect(res.send).to.have.been.called();
      expect(res.send).to.have.been.called.once;
      expect(res.send).to.have.been.called.with(memoryCache.get('cache_test_'));
    });
  });
});
