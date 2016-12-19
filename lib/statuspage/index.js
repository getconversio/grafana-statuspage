'use strict';

const config = require('../config'),
  logger = require('../logger');

require('isomorphic-fetch');

const VALID_STATUSES = [
  'operational',
  'degraded_performance',
  'partial_outage',
  'major_outage'
];

const postUpdate = (componentId, status) => {
  if (!VALID_STATUSES.includes(status)) {
    return Promise.reject(new Error(`${status} is not a valid status. Valid statuses are ${VALID_STATUSES.join(', ')}.`));
  }

  return fetch(`https://api.statuspage.io/v1/pages/${config.statuspage.pageId}/components/${componentId}.json`, {
    method: 'PATCH',
    body: JSON.stringify({ component: { status } }),
    headers: {
      Authorization: 'OAuth ' + config.statuspage.apiKey
    }
  })
  .then(res => {
    if (res.ok) return;

    return res.text()
      .then(_res => {
        logger.warn('Got a bad response', _res);

        const error = new Error(`Request to StatusPage.io failed: ${res.status} ${res.statusText}`);
        error.body = _res;

        throw error;
      });
  });
};

module.exports = {
  postUpdate
};
