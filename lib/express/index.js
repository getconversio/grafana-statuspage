'use strict';

const express = require('express'),
  bodyParser = require('body-parser'),
  logger = require('../logger'),
  routes = require('../controllers/routes');

module.exports = () => {
  const app = express();
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use('/grafana', routes(new express.Router()));

  /* eslint no-unused-vars: off */
  app.use((err, req, res, next) => {
    logger.error('Internal server error', err, req.query, req.params);

    res.status(err.status || 500);
    res.send('Internal server error');
  });

  app.get('/', (req, res) => res.sendStatus(200));

  return app;
};
