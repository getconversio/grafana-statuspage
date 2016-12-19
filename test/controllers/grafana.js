'use strict';

const request = require('supertest-as-promised'),
  app = require('../../lib/express'),
  statuspage = require('../../lib/statuspage'),
  logger = require('../../lib/logger'),
  sinon = require('sinon');

describe('controllers/grafana', () => {
  const self = { };

  beforeEach(() => {
    self.sandbox = sinon.sandbox.create();

    self.postUpdateStub = self.sandbox.stub(statuspage, 'postUpdate')
      .returns(Promise.resolve());

    self.warnSpy = self.sandbox.spy(logger, 'warn');
  });

  afterEach(() => self.sandbox.restore());

  describe('receiveWebhook', () => {
    it('should reply 200 to a correct url', () => {
      return request(app())
        .post('/grafana/foo')
        .send({
          state: 'Alerting'
        })
        .expect(200)
        .then(() => {
          sinon.assert.calledOnce(self.postUpdateStub);
          sinon.assert.calledWith(self.postUpdateStub, 'foo', 'degraded_performance');
        });
    });

    it('should post an update for OK status', () => {
      return request(app())
        .post('/grafana/foo')
        .send({
          state: 'OK'
        })
        .expect(200)
        .then(() => {
          sinon.assert.calledOnce(self.postUpdateStub);
          sinon.assert.calledWith(self.postUpdateStub, 'foo', 'operational');
        });
    });

    it('should have a default status for missing mapping', () => {
      return request(app())
        .post('/grafana/foo')
        .send({
          state: 'Foo'
        })
        .expect(200)
        .then(() => {
          sinon.assert.calledOnce(self.postUpdateStub);
          sinon.assert.calledWith(self.postUpdateStub, 'foo', 'operational');
        });
    });

    it('should handle lowercase statuses', () => {
      return request(app())
        .post('/grafana/foo')
        .send({
          state: 'alerting'
        })
        .expect(200)
        .then(() => {
          sinon.assert.calledOnce(self.postUpdateStub);
          sinon.assert.calledWith(self.postUpdateStub, 'foo', 'degraded_performance');
        });
    });

    context('given an error from postUpdate', () => {
      beforeEach(() => {
        self.postUpdateStub.returns(Promise.reject(new Error('401 Not authorized')));
      });

      it('should still reply a 200', () => {
        return request(app())
          .post('/grafana/foo')
          .send({
            state: 'Alerting'
          })
          .expect(200)
          .then(() => {
            sinon.assert.calledOnce(self.warnSpy);
          });
      });
    });
  });
});
