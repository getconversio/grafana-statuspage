'use strict';

const config = require('../config');

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
    body: JSON.stringify({ status }),
    headers: {
      Authorization: 'OAuth ' + config.statuspage.apiKey
    }
  })
  .then(res => {
    if (res.ok) return;

    throw new Error(`Request to StatusPage.io failed: ${res.status} ${res.statusText}`);
  });
};

module.exports = {
  postUpdate
};
