'use strict';

const grafana = require('./grafana');

module.exports = router => {
  router.post('/:componentId', grafana.receiveWebhook);
  return router;
};
