'use strict';

const statuspage = require('../../lib/statuspage'),
  nock = require('nock'),
  assert = require('assert');

describe('statuspage/index', () => {
  const self = { };

  afterEach(() => nock.cleanAll());

  describe('postUpdate', () => {
    beforeEach(() => {
      self.updateCall = nock('https://api.statuspage.io', { reqheaders: { authorization: 'OAuth fooApiKey' } })
        .patch('/v1/pages/fooPageId/components/ftgks51sfs2d.json', {
          component: {
            status: 'degraded_performance'
          }
        })
        .reply(200, {
          created_at: '2013-03-05T20:50:42Z',
          id: 'ftgks51sfs2d',
          name: 'API',
          description: 'Lorem',
          position: 1,
          status: 'degraded_performance',
          updated_at: '2013-03-05T22:44:21Z'
        });
    });

    it('should post an update to statuspage.io', () => {
      return statuspage.postUpdate('ftgks51sfs2d', 'degraded_performance')
        .then(() => assert.equal(true, self.updateCall.isDone()));
    });

    it('should throw an error with an invalid status', () => {
      return statuspage.postUpdate('ftgks51sfs2d', 'foo')
        .then(() => Promise.reject(new Error('You shall not pass!')))
        .catch(err => {
          assert.equal(false, self.updateCall.isDone());
          assert(err.message.includes('foo is not a valid status'));
        });
    });

    context('given a failure on statuspage call', () => {
      beforeEach(() => {
        nock.cleanAll();

        self.updateCall = nock('https://api.statuspage.io')
          .patch('/v1/pages/fooPageId/components/ftgks51sfs2d.json')
          .reply(503);
      });

      it('should throw an error', () => {
        return statuspage.postUpdate('ftgks51sfs2d', 'degraded_performance')
          .then(() => Promise.reject(new Error('You shall not pass!')))
          .catch(err => {
            assert.equal(true, self.updateCall.isDone());
            assert(err.message.includes(503));
          });
      });
    });
  });
});
