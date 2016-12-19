'use strict';

const fs = require('fs');

const config = {
  port: process.env.PORT || 9002,
  host: process.env.HOST || '0.0.0.0',
  log: {
    level: process.env.LOG_LEVEL || 'debug'
  },
  statuspage: {
    pageId: process.env.STATUSPAGE_PAGE_ID,
    apiKey: process.env.STATUSPAGE_API_KEY
  }
};

const envFile = `${__dirname}/env/${process.env.NODE_ENV}.js`;

if (fs.existsSync(envFile)) {
  /* eslint global-require: off */
  Object.assign(config, require(envFile));
}

module.exports = config;
