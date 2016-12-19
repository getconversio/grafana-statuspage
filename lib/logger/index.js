'use strict';

const winston = require('winston'),
  config = require('../config');

winston.level = config.log.level;

module.exports = winston;
