'use strict';

const request = require('supertest-as-promised'),
  app = require('../../lib/express');

describe('express/index', () => {
  it('should handle /', () => {
    return request(app())
      .get('/')
      .expect(200);
  });
});
