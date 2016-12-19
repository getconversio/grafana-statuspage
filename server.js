'use strict';

const config = require('./lib/config'),
  app = require('./lib/express'),
  logger = require('./lib/logger');

app().listen(config.port, config.host, () => {
  logger.info(`Server running at http://${config.host}:${config.port}`);
});
